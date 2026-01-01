# VaultCPA Subagents Quick Start Guide

## What Just Got Created

7 specialized AI subagents have been configured for your VaultCPA project:

### ✅ Ready to Use Now

1. **tax-nexus-expert** - Tax law & nexus detection specialist
2. **fullstack-reviewer** - Code quality reviewer
3. **api-integration-specialist** - Frontend-backend integration expert
4. **database-expert** - PostgreSQL & Prisma specialist
5. **testing-specialist** - Testing expert (unit, integration, E2E)
6. **devops-specialist** - Docker & deployment expert
7. **pipeline-debugger** - Nexus pipeline debugging specialist

## Quick Start (3 Steps)

### Step 1: Try a Subagent

In your next Claude Code session, try:

```
> Use the fullstack-reviewer to check my recent code changes
```

Claude will automatically invoke the subagent, review your code, and provide feedback.

### Step 2: Use After Major Changes

Get in the habit of using these after development tasks:

**After writing code:**
```
> Use the fullstack-reviewer to check my changes
```

**After modifying nexus logic:**
```
> Use the tax-nexus-expert to validate the threshold amounts
```

**After changing database schema:**
```
> Use the database-expert to review this migration
```

### Step 3: Debug Issues

When something breaks:

**API not working:**
```
> Use the api-integration-specialist to debug this 500 error
```

**Pipeline issues:**
```
> Use the pipeline-debugger to trace why alerts aren't generating
```

**Docker problems:**
```
> Use the devops-specialist to fix the container restart loop
```

## How They Work

### Automatic (Recommended)

Claude will detect when to use these agents based on your task:

- You: "I changed the California nexus threshold to $600k"
- Claude: [Automatically invokes tax-nexus-expert]
- Agent: Reviews change, validates against CA law, provides feedback

### Explicit (When You Need Control)

You tell Claude which agent to use:

```
> Use the [agent-name] to [what you want done]
```

Examples:
- "Use the testing-specialist to create tests for the upload feature"
- "Ask the database-expert if this query will be slow"
- "Have the devops-specialist optimize our Dockerfile"

## Common Workflows

### After Implementing a Feature

```bash
# 1. Review code quality
> Use the fullstack-reviewer to check my new consultation booking feature

# 2. Create tests
> Use the testing-specialist to write tests for this feature

# 3. Deploy
> Use the devops-specialist to deploy this to staging
```

### When Fixing a Bug

```bash
# 1. Understand the issue
> Use the pipeline-debugger to trace why alerts aren't showing

# 2. Fix and review
> Use the fullstack-reviewer to check my fix

# 3. Test
> Use the testing-specialist to create a regression test
```

### When Adding Database Changes

```bash
# 1. Review schema
> Use the database-expert to review my new ClientActivity model

# 2. Check migration safety
> Use the database-expert to validate this migration is safe for production

# 3. Test
> Use the testing-specialist to test the new queries
```

## Tips for Success

1. **Trust the Agents** - They have deep VaultCPA context
2. **Use Proactively** - Don't wait for problems
3. **Be Specific** - Tell agents what you need
4. **Chain Agents** - Complex tasks can use multiple agents
5. **Iterate** - Refine agent prompts over time

## What's Next?

### Immediate Actions

1. ✅ **Subagents created** - They're ready to use now
2. 📖 **Read the README** - See [.claude/agents/README.md](.claude/agents/README.md)
3. 🧪 **Try one** - Pick an agent and test it

### Optional Customization

Want to customize? Run:
```
/agents
```

This opens an interactive interface to:
- View all agents
- Edit agent prompts
- Change tool access
- Create new agents

## Quick Reference Card

| I Need To... | Use This Agent |
|--------------|----------------|
| Validate tax calculations | `tax-nexus-expert` |
| Review my code | `fullstack-reviewer` |
| Debug API issues | `api-integration-specialist` |
| Check database queries | `database-expert` |
| Write tests | `testing-specialist` |
| Fix Docker issues | `devops-specialist` |
| Debug nexus pipeline | `pipeline-debugger` |

## Example Session

```
You: I just implemented a new income tax nexus detector. Can you review it?

Claude: I'll use the tax-nexus-expert to review your implementation.
[Invokes tax-nexus-expert subagent]

Agent: I've reviewed your income tax nexus detector. Here are my findings:

**Tax Law Accuracy:** ✅
- P.L. 86-272 protection correctly applied to tangible goods
- Services properly excluded from protection

**Threshold Validation:** ⚠️
- Texas franchise threshold is $1,230,000 (you have $1,000,000)
- Needs update to match current TX law

**Recommendations:**
1. Update TX_FRANCHISE_THRESHOLD to $1,230,000
2. Add test case for service-only companies
3. Consider state-specific filing thresholds

You: Thanks! Let me fix the threshold and add those tests.

[After making changes]

You: Use the fullstack-reviewer to check my updates.

Claude: [Invokes fullstack-reviewer]

Agent: Changes look good! ✅
- Threshold corrected
- Tests added with good coverage
- No security issues detected

Ready to commit!
```

## Files Created

```
.claude/agents/
├── README.md                          # Full documentation
├── SUBAGENTS_QUICKSTART.md           # This file
├── tax-nexus-expert.md
├── fullstack-reviewer.md
├── api-integration-specialist.md
├── database-expert.md
├── testing-specialist.md
├── devops-specialist.md
└── pipeline-debugger.md
```

## Need Help?

- 📚 Read: [.claude/agents/README.md](.claude/agents/README.md)
- 🔧 Manage: Run `/agents` command
- 📖 Docs: https://code.claude.com/docs
- 💬 Help: Type `/help`

---

**You're all set! Start using subagents in your next Claude Code session.**
