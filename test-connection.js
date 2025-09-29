// VaultCPA Database Connection Test
// This script tests the database connection and basic functionality

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'vaultcpa',
  user: 'vaultcpa_user',
  password: 'vaultcpa_secure_password_2024',
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to VaultCPA Database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Test 1: Check database version
    console.log('\n📊 Database Information:');
    const versionResult = await client.query('SELECT version()');
    console.log(`PostgreSQL Version: ${versionResult.rows[0].version.split(',')[0]}`);

    // Test 2: Count tables
    const tableCountResult = await client.query(`
      SELECT COUNT(*) as total_tables 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`Total Tables: ${tableCountResult.rows[0].total_tables}`);

    // Test 3: Check sample organizations
    console.log('\n🏢 Sample Organizations:');
    const orgResult = await client.query('SELECT name, slug, subscription_tier FROM organizations');
    orgResult.rows.forEach(org => {
      console.log(`  - ${org.name} (${org.slug}) - ${org.subscription_tier}`);
    });

    // Test 4: Check extensions
    console.log('\n🔧 Installed Extensions:');
    const extResult = await client.query(`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgcrypto')
    `);
    extResult.rows.forEach(ext => {
      console.log(`  - ${ext.extname} v${ext.extversion}`);
    });

    // Test 5: Check indexes
    console.log('\n📈 Database Indexes:');
    const indexResult = await client.query(`
      SELECT COUNT(*) as total_indexes 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    console.log(`Total Indexes: ${indexResult.rows[0].total_indexes}`);

    // Test 6: Check views
    console.log('\n👁️ Database Views:');
    const viewResult = await client.query(`
      SELECT COUNT(*) as total_views 
      FROM information_schema.views 
      WHERE table_schema = 'public'
    `);
    console.log(`Total Views: ${viewResult.rows[0].total_views}`);

    // Test 7: Check triggers
    console.log('\n⚡ Database Triggers:');
    const triggerResult = await client.query(`
      SELECT COUNT(*) as total_triggers 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
    `);
    console.log(`Total Triggers: ${triggerResult.rows[0].total_triggers}`);

    console.log('\n🎉 All tests passed! VaultCPA Database is ready for use.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed.');
  }
}

// Run the test
testConnection();

