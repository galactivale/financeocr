const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GAP 4: Document Hash & Tamper Detection

/**
 * Generate hash for memo content
 * @param {Object} memo - Memo object
 * @param {Buffer} pdfBuffer - PDF buffer (optional)
 * @returns {Object} Hash values
 */
function generateMemoHash(memo, pdfBuffer = null) {
  // Create hash of JSON content
  const contentString = JSON.stringify({
    client_id: memo.client_id,
    title: memo.title,
    sections: memo.sections,
    conclusion: memo.conclusion,
    recommendations: memo.recommendations,
    attestation: memo.attestation,
    statute_versions: memo.statute_versions,
    created_at: memo.created_at
  });

  const contentHash = crypto
    .createHash('sha256')
    .update(contentString)
    .digest('hex');

  // Create hash of PDF binary if provided
  let pdfHash = null;
  if (pdfBuffer) {
    pdfHash = crypto
      .createHash('sha256')
      .update(pdfBuffer)
      .digest('hex');
  }

  // Create combined document hash
  const combinedString = pdfHash ? contentHash + pdfHash : contentHash;
  const documentHash = crypto
    .createHash('sha256')
    .update(combinedString)
    .digest('hex');

  return {
    contentHash,
    pdfHash,
    documentHash
  };
}

/**
 * Seal a memo (finalize with hash)
 * @param {string} memoId - Memo ID
 * @param {string} userId - User ID who is sealing
 * @param {Buffer} pdfBuffer - PDF buffer
 * @returns {Object} Sealed memo info
 */
async function sealMemo(memoId, userId, pdfBuffer) {
  try {
    // Get memo data
    const memoQuery = `SELECT * FROM nexus_memos WHERE id = $1`;
    const memoResult = await pool.query(memoQuery, [memoId]);

    if (memoResult.rows.length === 0) {
      throw new Error('Memo not found');
    }

    const memo = memoResult.rows[0];

    if (memo.is_sealed) {
      throw new Error('Memo is already sealed');
    }

    // Generate hashes
    const hashes = generateMemoHash(memo, pdfBuffer);

    // Update memo with hash and seal it
    const updateQuery = `
      UPDATE nexus_memos
      SET
        document_hash = $1,
        content_hash = $2,
        pdf_hash = $3,
        sealed_at = NOW(),
        sealed_by = $4,
        is_sealed = true,
        is_editable = false,
        status = 'SEALED',
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [
      hashes.documentHash,
      hashes.contentHash,
      hashes.pdfHash,
      userId,
      memoId
    ]);

    // Store hash in verification log
    const hashLogQuery = `
      INSERT INTO memo_hash_verifications (
        memo_id, hash, algorithm, verified, stored_hash, current_hash
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(hashLogQuery, [
      memoId,
      hashes.documentHash,
      'SHA-256',
      true,
      hashes.documentHash,
      hashes.documentHash
    ]);

    return {
      memo: updateResult.rows[0],
      hash: hashes.documentHash,
      sealed: true,
      sealedAt: new Date(),
      sealedBy: userId
    };
  } catch (error) {
    console.error('Error sealing memo:', error);
    throw error;
  }
}

/**
 * Verify memo integrity
 * @param {string} memoId - Memo ID
 * @param {Buffer} pdfBuffer - Current PDF buffer (optional)
 * @returns {Object} Verification result
 */
async function verifyMemoIntegrity(memoId, pdfBuffer = null) {
  try {
    // Get memo
    const memoQuery = `SELECT * FROM nexus_memos WHERE id = $1`;
    const memoResult = await pool.query(memoQuery, [memoId]);

    if (memoResult.rows.length === 0) {
      throw new Error('Memo not found');
    }

    const memo = memoResult.rows[0];

    if (!memo.is_sealed) {
      return {
        verified: false,
        reason: 'Memo has not been sealed yet',
        status: 'NOT_SEALED'
      };
    }

    // Get stored hash
    const storedHash = memo.document_hash;

    // Regenerate hash from current data
    const currentHashes = generateMemoHash(memo, pdfBuffer);

    // Compare hashes
    const verified = storedHash === currentHashes.documentHash;

    // Log verification attempt
    const logQuery = `
      INSERT INTO memo_hash_verifications (
        memo_id, hash, algorithm, verified, stored_hash, current_hash, verified_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    await pool.query(logQuery, [
      memoId,
      currentHashes.documentHash,
      'SHA-256',
      verified,
      storedHash,
      currentHashes.documentHash,
      null // Can add user ID if available
    ]);

    return {
      verified,
      storedHash,
      currentHash: currentHashes.documentHash,
      sealedAt: memo.sealed_at,
      sealedBy: memo.sealed_by,
      verificationTimestamp: new Date(),
      status: verified ? 'VERIFIED' : 'TAMPERED'
    };
  } catch (error) {
    console.error('Error verifying memo:', error);
    throw error;
  }
}

/**
 * Generate verification certificate
 * @param {Object} verification - Verification result
 * @returns {Object} Certificate data
 */
function generateVerificationCertificate(verification) {
  return {
    certificateId: crypto.randomUUID(),
    verificationResult: verification.verified ? 'PASSED' : 'FAILED',
    documentHash: verification.storedHash,
    verificationHash: verification.currentHash,
    hashesMatch: verification.verified,
    algorithm: 'SHA-256',
    sealedAt: verification.sealedAt,
    verifiedAt: verification.verificationTimestamp,
    status: verification.status,
    message: verification.verified
      ? 'Document integrity verified. This document has not been altered since sealing.'
      : '⚠️ TAMPER DETECTED: Document has been modified after sealing. Do not rely on this version for legal defense.'
  };
}

/**
 * Get verification history for a memo
 * @param {string} memoId - Memo ID
 * @returns {Array} Verification history
 */
async function getVerificationHistory(memoId) {
  const query = `
    SELECT * FROM memo_hash_verifications
    WHERE memo_id = $1
    ORDER BY verification_timestamp DESC
  `;

  const result = await pool.query(query, [memoId]);
  return result.rows;
}

module.exports = {
  generateMemoHash,
  sealMemo,
  verifyMemoIntegrity,
  generateVerificationCertificate,
  getVerificationHistory
};
