# VaultCPA Skills

This directory contains AI Skills that teach Claude specialized knowledge about VaultCPA's tax platform, coding standards, and operations.

## What are Skills?

Skills are markdown files that Claude automatically uses when you ask relevant questions. Unlike subagents (which run in separate contexts), Skills add knowledge to your current conversation.

**Skills vs Subagents:**
- **Skills** = Knowledge and guidance (auto-triggered by description)
- **Subagents** = Independent AI workers with their own tools (explicitly invoked)

## Available Skills

### 1. **state-tax-thresholds** (Tax Reference)
- **When used:** Validating tax calculations, reviewing nexus logic, checking thresholds
- **Contains:** Current economic nexus thresholds for all 50 states
- **Updates:** Review quarterly (Jan, Apr, Jul, Oct)
- **Last Updated:** January 2026

**Key Data:**
- Sales tax thresholds (CA: $500k, TX: $500k, NY: $500k + 100 txns)
- Income tax nexus rules (P.L. 86-272 protection)
- Franchise tax thresholds (TX: $1,230,000)
- Alert severity guidelines

**Example trigger:**
```
"What's the California economic nexus threshold?"
"Validate these Texas franchise tax calculations"
```

---

### 2. **vaultcpa-coding-standards** (Development Guidelines)
- **When used:** Code reviews, writing features, PR reviews
- **Contains:** Team coding conventions and best practices
- **Used by:** fullstack-reviewer subagent

**Key Standards:**
- Multi-tenant isolation (CRITICAL: organizationId filtering)
- TypeScript standards (no `any` types)
- Next.js App Router patterns
- Prisma query patterns
- API response formats
- Security requirements

**Example trigger:**
```
"Review this code for VaultCPA standards"
"What's the correct API response format?"
```

---

### 3. **database-schema-guide** (Schema Reference)
- **When used:** Working with database models, designing features
- **Contains:** 50+ Prisma models with relationships and patterns
- **Used by:** database-expert subagent

**Key Content:**
- Model categories and relationships
- Common query patterns
- Multi-tenant filtering examples
- Migration best practices
- Index strategy

**Example trigger:**
```
"Where should I store client revenue data?"
"What's the relationship between Client and Alert?"
```

---

### 4. **docker-runbook** (Operations Guide)
- **When used:** Docker operations, deployment, troubleshooting
- **Contains:** Commands, procedures, troubleshooting steps
- **Used by:** devops-specialist subagent

**Key Content:**
- Common Docker commands
- Service health checks
- Database backup/restore
- Deployment procedures
- Troubleshooting scenarios

**Example trigger:**
```
"How do I restart the backend container?"
"Database won't connect - how to fix?"
```

---

## How to Use Skills

### Automatic (Recommended)

Claude detects when to use Skills based on your question:

```
You: "What's the Texas franchise tax threshold?"
Claude: [Automatically uses state-tax-thresholds Skill]
Claude: "The Texas franchise tax threshold is $1,230,000..."
```

### Skills Work with Subagents

Subagents can use Skills when configured in their `skills` field:

```yaml
# .claude/agents/tax-nexus-expert.md
---
name: tax-nexus-expert
skills: state-tax-thresholds  # ← Loads this Skill
---
```

When you invoke the subagent, it has access to that Skill's knowledge.

---

## Skill Structure

Each Skill is a directory with a `SKILL.md` file:

```
skill-name/
├── SKILL.md              # Required - main content
├── reference.md          # Optional - detailed docs
└── examples.md           # Optional - usage examples
```

### SKILL.md Format

```markdown
---
name: skill-name
description: What this Skill does and when to use it. Claude uses this to decide when to apply the Skill.
allowed-tools: Read, Grep, Glob  # Optional - tool restrictions
---

# Skill Content

Instructions and reference material in markdown...
```

---

## Managing Skills

### View Available Skills

```
What Skills are available?
```

Claude lists all Skills with their descriptions.

### Update a Skill

1. Edit the `SKILL.md` file directly
2. Exit and restart Claude Code to reload

### Create a New Skill

1. Create directory: `.claude/skills/my-skill/`
2. Create `SKILL.md` with frontmatter and content
3. Exit and restart Claude Code

---

## Maintenance

### state-tax-thresholds

**Update frequency:** Quarterly
**Sources:**
- State department of revenue websites
- Tax Foundation
- Bloomberg Tax

**Process:**
1. Check for state law changes
2. Update threshold amounts in `SKILL.md`
3. Update "Last Updated" date
4. Test with tax-nexus-expert subagent

### vaultcpa-coding-standards

**Update when:**
- New patterns emerge
- Technology stack changes
- Team adopts new conventions

**Process:**
1. Discuss with team
2. Update relevant sections
3. Commit to version control

### database-schema-guide

**Update when:**
- New models added to Prisma schema
- Relationships change
- Migration patterns updated

**Process:**
1. Run migrations
2. Update Skill to match schema
3. Update query examples

### docker-runbook

**Update when:**
- Docker Compose configuration changes
- New services added
- Deployment procedures change

**Process:**
1. Test new procedures
2. Update commands and examples
3. Validate health checks

---

## Best Practices

1. **Keep descriptions specific** - Use keywords users would naturally say
2. **Update regularly** - Stale Skills are worse than no Skills
3. **Use progressive disclosure** - Put details in separate files
4. **Test with subagents** - Ensure Skills work well with agents
5. **Version control** - Commit Skills to git for team sharing

---

## Quick Reference

| I Need To... | Use This Skill |
|--------------|----------------|
| Check tax thresholds | `state-tax-thresholds` |
| Review code standards | `vaultcpa-coding-standards` |
| Understand database schema | `database-schema-guide` |
| Docker commands/troubleshooting | `docker-runbook` |

---

## Integration with Subagents

Skills enhance subagent capabilities:

```
tax-nexus-expert + state-tax-thresholds
  → Validates thresholds against current law

fullstack-reviewer + vaultcpa-coding-standards
  → Reviews code against team conventions

database-expert + database-schema-guide
  → Provides schema context for queries

devops-specialist + docker-runbook
  → Has operational procedures ready
```

---

## Files Created

```
.claude/skills/
├── README.md                                    # This file
├── state-tax-thresholds/
│   └── SKILL.md                                # Tax thresholds
├── vaultcpa-coding-standards/
│   └── SKILL.md                                # Coding conventions
├── database-schema-guide/
│   └── SKILL.md                                # Schema reference
└── docker-runbook/
    └── SKILL.md                                # Docker operations
```

---

## Need Help?

- 📚 Docs: https://docs.claude.com/en/docs/agents-and-tools/agent-skills
- 🔧 Manage: Edit files directly or ask Claude to help
- 💬 Questions: Ask Claude "How do Skills work?"

**Last Updated:** January 2026
**Project:** VaultCPA Tax & Accounting Platform
