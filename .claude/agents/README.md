# VaultCPA Subagents

This directory contains specialized AI subagents configured for the VaultCPA project. These agents help with specific development tasks and automatically assist when working on related code.

## Available Subagents

### Tier 1: Core Development (Use Daily)

#### 1. **tax-nexus-expert**
- **Purpose:** Tax compliance and nexus detection specialist
- **Use when:** Working on nexus alerts, state tax rules, P.L. 86-272, compliance logic
- **Tools:** Read, Grep, Glob, Edit
- **Model:** Sonnet
- **Expertise:**
  - State economic nexus thresholds
  - Public Law 86-272 protection rules
  - Multi-state tax law validation
  - Tax doctrine rule systems

**Example usage:**
```
> Use the tax-nexus-expert to review my changes to the sales nexus detector

> Ask the tax-nexus-expert to validate these California threshold amounts

> Have the tax-nexus-expert check if P.L. 86-272 protection is correctly implemented
```

#### 2. **fullstack-reviewer**
- **Purpose:** Code quality reviewer for Next.js/React and Express/Prisma
- **Use when:** After writing or modifying code (proactive use)
- **Tools:** Read, Grep, Glob, Bash
- **Model:** Sonnet
- **Reviews:**
  - TypeScript type safety
  - React component patterns
  - API endpoint design
  - Security vulnerabilities
  - Multi-tenant isolation
  - Performance issues

**Example usage:**
```
> Use the fullstack-reviewer to check my new consultation feature

> Have the fullstack-reviewer review the recent dashboard changes
```

#### 3. **api-integration-specialist**
- **Purpose:** Frontend-backend integration expert
- **Use when:** Creating API endpoints, debugging data flow, integration issues
- **Tools:** Read, Edit, Grep, Glob, Bash
- **Model:** Sonnet
- **Expertise:**
  - RESTful API design
  - Request/response schemas
  - Frontend API consumption
  - Data transformation debugging
  - sessionStorage data flow

**Example usage:**
```
> Use the api-integration-specialist to debug why the alert endpoint returns 500

> Ask the api-integration-specialist to help design the new analytics API

> Have the api-integration-specialist trace the nexus memo data flow
```

---

### Tier 2: Important (Add After Tier 1)

#### 4. **database-expert**
- **Purpose:** PostgreSQL and Prisma specialist
- **Use when:** Schema changes, migrations, query optimization, multi-tenant issues
- **Tools:** Read, Edit, Grep, Glob, Bash
- **Model:** Sonnet
- **Expertise:**
  - Prisma schema design (50+ models)
  - Multi-tenant data isolation
  - Query optimization
  - Migration strategies
  - Database performance

**Example usage:**
```
> Use the database-expert to review my new ClientNexusHistory model

> Ask the database-expert to optimize this slow query

> Have the database-expert check if my migration is safe for production
```

#### 5. **testing-specialist**
- **Purpose:** Testing expert for unit, integration, and E2E tests
- **Use when:** Implementing features, need test coverage
- **Tools:** Read, Edit, Write, Bash, Grep, Glob
- **Model:** Sonnet
- **Expertise:**
  - Jest unit tests (backend/frontend)
  - Supertest integration tests
  - React Testing Library
  - E2E testing with Playwright
  - Test fixtures and mocks

**Example usage:**
```
> Use the testing-specialist to create tests for the nexus detection algorithm

> Ask the testing-specialist to write integration tests for the upload API

> Have the testing-specialist review our test coverage
```

---

### Tier 3: Specialized (Create As Needed)

#### 6. **devops-specialist**
- **Purpose:** Docker, deployment, and infrastructure expert
- **Use when:** Containerization, deployment issues, production problems
- **Tools:** Read, Edit, Bash, Grep, Glob
- **Model:** Haiku (fast)
- **Expertise:**
  - Docker optimization
  - Docker Compose orchestration
  - Database migrations in production
  - CI/CD pipelines
  - Health checks and monitoring
  - Security hardening

**Example usage:**
```
> Use the devops-specialist to optimize our Docker build times

> Ask the devops-specialist to set up a CI/CD pipeline

> Have the devops-specialist debug why the backend container keeps restarting
```

#### 7. **pipeline-debugger**
- **Purpose:** Nexus memo pipeline debugging specialist
- **Use when:** Data flow issues, mapping errors, alert generation problems
- **Tools:** Read, Bash, Grep, Glob
- **Model:** Haiku (fast)
- **Expertise:**
  - Upload → Validation → Alerts → Memos pipeline
  - sessionStorage debugging
  - Column mapping issues
  - State normalization
  - Alert generation logic

**Example usage:**
```
> Use the pipeline-debugger to figure out why no alerts are generated

> Ask the pipeline-debugger to trace why column mappings are incorrect

> Have the pipeline-debugger investigate the state normalization failure
```

---

## How to Use Subagents

### Automatic Invocation

Claude will automatically use these subagents when appropriate based on your task. For example:

- Modifying nexus detection code → Automatically invokes `tax-nexus-expert`
- After completing a feature → Automatically invokes `fullstack-reviewer`
- Docker issues → Automatically invokes `devops-specialist`

### Explicit Invocation

You can explicitly request a specific subagent:

```bash
# Direct invocation
> Use the tax-nexus-expert to review this code

# Ask for help
> Ask the api-integration-specialist to debug this API issue

# Request specific action
> Have the testing-specialist create unit tests for this function
```

### Best Practices

1. **Use proactively:** Don't wait for problems—invoke reviewers after major changes
2. **Be specific:** Tell the agent what you want reviewed or fixed
3. **Trust the expertise:** These agents are specialized for their domains
4. **Chain agents:** Use multiple agents in sequence for complex tasks

**Example of chaining:**
```
> First use the fullstack-reviewer to check my code, then use the testing-specialist to create tests for it
```

## Quick Reference

| Task | Use This Agent |
|------|----------------|
| Reviewing tax nexus logic | `tax-nexus-expert` |
| Code review after changes | `fullstack-reviewer` |
| API integration issues | `api-integration-specialist` |
| Database schema changes | `database-expert` |
| Creating tests | `testing-specialist` |
| Docker/deployment issues | `devops-specialist` |
| Nexus pipeline debugging | `pipeline-debugger` |

## Managing Subagents

### View all subagents
```bash
/agents
```

### Edit a subagent
1. Run `/agents`
2. Select the subagent to edit
3. Modify the configuration
4. Save changes

### Create a new subagent
1. Run `/agents`
2. Select "Create New Agent"
3. Choose project-level (recommended)
4. Define the subagent with Claude's help

## File Structure

```
.claude/agents/
├── README.md                          # This file
├── tax-nexus-expert.md               # Tier 1
├── fullstack-reviewer.md             # Tier 1
├── api-integration-specialist.md     # Tier 1
├── database-expert.md                # Tier 2
├── testing-specialist.md             # Tier 2
├── devops-specialist.md              # Tier 3
└── pipeline-debugger.md              # Tier 3
```

## Subagent Configuration Format

Each subagent file has this structure:

```markdown
---
name: agent-name
description: When Claude should use this agent
tools: Read, Edit, Bash, Grep, Glob
model: sonnet
---

System prompt with detailed instructions for the agent...
```

## Tips for Effective Use

1. **Start with Tier 1 agents** - These cover 80% of daily development needs
2. **Invoke after major changes** - Use reviewers proactively, not just when things break
3. **Combine agents** - Complex tasks may need multiple specialists
4. **Trust the output** - These agents have deep context on VaultCPA patterns
5. **Iterate** - Refine agent prompts based on your team's needs

## Contributing

These subagents are project-specific and stored in version control. When you improve an agent:

1. Test the changes thoroughly
2. Update the description if behavior changes
3. Commit to git so the team benefits
4. Share improvements with the team

## Support

If you have questions about using these subagents:
- Check the [Claude Code documentation](https://code.claude.com/docs)
- Use `/help` for built-in help
- Review individual agent files for specific capabilities

---

**Last Updated:** January 2026
**Project:** VaultCPA Tax & Accounting Platform
**Team:** Development Team
