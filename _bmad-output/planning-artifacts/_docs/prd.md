---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-BMAD Zoniq-2026-02-26.md']
workflowType: 'prd'
classification:
  projectType: SaaS B2B Web App
  domain: Developer Tool / Productivity
  complexity: medium
  projectContext: greenfield
  deployment: Cloud-hosted SaaS
  aiProvider: Chinese Big Model (MVP)
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
---

# Product Requirements Document - BMAD Zoniq

**Author:** David
**Date:** 2026-02-26

---

## Project Classification

| Attribute | Value |
|-----------|-------|
| **Project Type** | SaaS B2B Web App |
| **Domain** | Developer Tool / Productivity |
| **Complexity** | Medium |
| **Project Context** | Greenfield |
| **Deployment** | Cloud-hosted SaaS |
| **AI Provider (MVP)** | Chinese Big Model |

---

## Executive Summary

**Zoniq** is an AI-powered requirements and project management tool for Mendix low-code development teams. It transforms documentation from painful overhead into a speed advantage by instantly converting unstructured notes into clear acceptance criteria, development plans, and automated test scripts.

### Problem

Mendix teams suffer from sparse, unclear user stories that cause:
- **Juniors** struggle with vague requirements, waste time on rework
- **Seniors** become bottlenecks reviewing and clarifying
- **Clients** experience slower delivery, scope creep, lower quality
- **Culture** degrades through miscommunication and repeated clarifications

The root cause: documentation feels like "extra work" without immediate payoff, and teams lack automation-first questioning instincts — they build what they're told rather than asking "should this be automated?"

### Why Now

AI-assisted coding is rising. Requirements quality is becoming the new bottleneck. Teams that don't transform how they capture and refine requirements will fall behind.

### Target Users

| Persona | Role | Pain Point | What Success Looks Like |
|---------|------|------------|-------------------------|
| **Aisha** | Junior Mendix Developer | Vague stories, rework, anxiety about "what do I build?" | AI-generated prep questions, notes → structured stories, fewer "this is wrong" moments |
| **Marcus** | Business Senior / PM | Great verbally, terrible at documentation, creates handoff friction | Speaks into tool, AI structures requirements, looks organized without becoming a "writer" |
| **David** | Technical Senior / Founder | Bottleneck for quality, same feedback repeated, can't scale himself | AI prompts juniors with his questions, trusts the process more, freed for strategy |

### What Makes This Special

**Three-Stage Speed Loop:**
1. **Notes → Acceptance Criteria:** Unstructured notes and client docs become clear, testable criteria instantly
2. **Criteria → Development Plan:** AI generates actionable implementation guidance
3. **Functionality → Test Scripts:** Automated test scripts derived directly from requirements

**Key Differentiators:**

| Differentiator | Why It Matters |
|----------------|----------------|
| **Mendix-native** | Understands Mendix patterns, constraints, and context |
| **Company-aware** | Knows YOUR organization's way of working |
| **Fully customizable** | Adapts to your workflows, not the other way around |
| **Automation-first prompts** | Every prompt asks "should this be automated?" |
| **Senior instincts codified** | Dutch questioning culture embedded in AI |
| **Speed drives adoption** | Teams adopt because it helps them work, not because it's mandated |

---

## Success Criteria

### User Success

**Aisha (Junior Dev):**
- Acceptance criteria generated from notes instantly
- Dev plan appears directly after criteria
- Automated test scripts generated from functionality

**Marcus (PM):**
- Requirements written almost automatically from meetings and sparse notes
- Looks competent without being a "writer"

**David (Technical Senior):**
- Reviews a story and understands it immediately
- Knows exactly what to review
- Functionality looks great, automated tests in place

### Business Success

**3-Month (MVP):**
- Team actively using Zoniq for all stories
- All stories are well-documented
- Automated browser testing implemented for important flows

**12-Month (Growth):**
- Company becomes so good at requirements that we can build whole applications with AI
- Reduce dependency on Mendix manual development

**One Metric That Matters:**
- **Project delivery speed:** Estimated hours vs actual hours per project
- Goal: Get as close to estimates as possible — ideally lower
- *Note:* Currently tracked inconsistently — Zoniq will eventually systematize this tracking

### Technical Success

| Requirement | Target |
|-------------|--------|
| AI generation speed | <10 seconds for 95% of requests |
| Uptime | 90%+ |
| UX | Core tasks completable in <5 clicks without documentation |
| Data security | All data encrypted at rest and in transit |
| Access control | Authenticated users only |

### Measurable Outcomes

| Metric | Target | Notes |
|--------|--------|-------|
| Story documentation rate | 100% of stories in Zoniq | All team stories captured |
| Estimation accuracy | Estimated ≈ Actual hours | Track and close the gap |
| Rework reduction | Fewer "this is wrong" feedback cycles | Qualitative but observable |
| Test automation coverage | All critical flows | Browser-based automated testing |

---

## User Journeys

### Journey 1: Aisha — From Client Meeting to Ready Story

**Opening Scene:**
Aisha walks into a client meeting at 9 AM. She's prepared — she reviewed the project in Zoniq, and the AI generated prep questions tailored to the insurance claims workflow. "Ask about: approval thresholds, escalation rules, exception handling, who approves what."

**Rising Action:**
During the meeting, she follows the checklist. The client describes a claims approval feature. She takes rough notes in Zoniq. An alert pops up: "You haven't asked about error handling yet." She asks, catches an edge case she would have missed.

**Climax:**
Back at her desk, she pastes her messy notes into Zoniq. Within seconds, the AI structures them into a proper story with:
- Clear description
- Testable acceptance criteria
- Gap flags: "Missing: what happens when approver is on leave?"

She fills the gaps, clicks "Generate Dev Plan" — a step-by-step implementation guide appears. She clicks "Generate Test Script" — browser automation scaffolding ready. *If AI generation fails, she can retry or manually edit the generated content.*

**Resolution:**
She marks the story "Ready." David reviews it and says "This is clear — nice work." No "what did you mean by..." questions. No rework. She feels confident, not anxious.

---

### Journey 2: Marcus — From Client Call to Developer Handoff

**Opening Scene:**
Marcus just got off a 30-minute call with a client who described a new feature request. His notes are chaotic — bullet points, half-sentences, voice memo transcripts. He dreads writing it up.

**Rising Action:**
He dumps everything into Zoniq. The AI parses his mess and says: "Based on your notes, here's a draft story. You mentioned 'faster approval' — did you mean: A) Reduce clicks, B) Parallel approvers, or C) Auto-approve below threshold?"

Marcus answers the clarification prompts. The story sharpens.

**Climax:**
Zoniq generates the structured story. Marcus reviews — it actually captures what the client meant. He shares it with the dev team.

**Resolution:**
The devs don't ask 10 clarifying questions. They build. Marcus looks organized and competent without being a "writer."

---

### Journey 3: David — The Review That Didn't Suck

**Opening Scene:**
David opens his review queue. Five stories from Aisha and two from other juniors. He used to dread this — vague stories, inefficient implementations, same feedback every time.

**Rising Action:**
He opens the first story. It's clear. Acceptance criteria are testable. Dev plan is attached. Automated test script exists. He reads it once and understands what was built.

**Climax:**
He reviews the implementation. It matches the story. The automated test passes. No "why didn't you ask about X?" feedback needed.

**Resolution:**
He approves in 5 minutes instead of 30. Moves to the next one. Finishes all reviews before lunch. He has time for architecture work. The team is learning — he can see the quality improving week over week.

---

### Journey 4: Admin — Setting Up Zoniq for the Team

**Opening Scene:**
David (wearing his admin hat) needs to set up Zoniq for his team of 6 developers and 2 PMs.

**Rising Action:**
He creates user accounts, assigns roles (Developer, PM, Admin). He configures a new project — links the client context, uploads existing documentation as reference material.

**Climax:**
He customizes the AI prompts for his company's way of working — adds his "automation-first" questions to the default prompt templates.

**Resolution:**
Team logs in. Project is ready. AI already knows the context. Onboarding takes 10 minutes.

---

### Journey Requirements Summary

| Journey | Key Capabilities Required |
|---------|--------------------------|
| Aisha | AI prep questions, meeting checklist, notes → story converter, gap analyzer, dev plan generator, test script generator |
| Marcus | Voice/note input, AI clarification prompts, structured story output |
| David | Review queue, story clarity, attached dev plans & test scripts, approval workflow |
| Admin | User management, role assignment, project setup, custom AI prompt configuration |

---

## SaaS B2B Specific Requirements

### Project-Type Overview

Zoniq is an internal SaaS B2B tool for a single organization (Zoniq company). Built as a multi-user web application with role-based access control, designed to eventually expand to external Mendix consultancies.

### Tenant Model

| Aspect | Current | Future |
|--------|---------|--------|
| **Tenancy** | Single-tenant (Zoniq company only) | Multi-tenant for external consultancies |
| **Isolation** | N/A (single org) | Organization-level data isolation |

### Permission Model (RBAC)

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage users, configure AI providers, manage technical settings, full system access |
| **PM** | Create/manage projects, apps, customers; full story access within projects |
| **Consultant (Developer)** | View/create/edit stories within assigned projects; use AI generation features |

### Integration List

| Integration | Priority | Purpose |
|-------------|----------|--------|
| **Chinese Big Model** | MVP | Primary AI provider for generation |
| **Claude (Anthropic)** | Post-MVP | Secondary AI provider, eventually replace Big Model |
| **Jira** | Future | Story sync with external project management |
| **External tools** | Future | GitHub, Slack, etc. |

### AI Provider Abstraction

Both AI providers (Big Model, Claude) should use a similar interface to allow easy swapping:
- Same input/output contracts
- Provider-agnostic prompt templates
- Configuration-based provider selection
- API versioning: Major versions allow breaking changes; minor versions remain backward-compatible

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — validate that the three-stage speed loop (notes → criteria → dev plan → test scripts) actually helps the team work faster.

**Resource Requirements:** Small team, internal tool, rapid iteration based on team feedback.

### MVP Feature Set (Phase 1)

**Core Loop (Must Work):**
- Notes/docs → Acceptance Criteria (AI-generated)
- Acceptance Criteria → Development Plan (AI-generated)
- Functionality → Automated Test Scripts (AI-generated)

**Essential Features:**
- Project and story management
- AI integration with Chinese Big Model
- User authentication
- Secure data storage

**Core User Journeys Supported:**
- Aisha: Notes → Story → Dev Plan → Test Script
- Marcus: Chaotic notes → Structured story
- David: Clear review queue with attached plans & scripts

**Must-Have Capabilities:**

| Feature | Priority | Rationale |
|---------|----------|-----------|
| User Authentication & Roles | Critical | Multi-user system foundation |
| Project & Story Management | Critical | Container for all work |
| Notes → Acceptance Criteria | Critical | Core value proposition |
| Gap Analyzer | High | Improves story quality |
| Dev Plan Generator | Critical | Part of three-stage loop |
| Test Script Generator | Critical | Completes the loop |
| Chinese Big Model Integration | Critical | AI engine |

**Deferred to Post-MVP:**
- AI prep questions for meetings
- Meeting checklist tracker
- Custom AI prompt configuration (hardcode initially)
- Estimation vs actual tracking
- Analytics & insights

### Post-MVP Features

**Phase 2 (Growth):**
- AI prep questions & meeting checklist
- Custom AI prompt configuration
- Claude AI integration (provider swap)
- Estimation vs actual hours tracking
- Advanced templates

**Phase 3 (Expansion):**
- Team analytics & insights
- Jira/external tool integrations
- Multi-tenant support for external consultancies
- Productize Zoniq as commercial offering
- Build entire applications with AI from requirements alone
- Reduce/eliminate dependency on manual Mendix development

### Risk Mitigation Strategy

| Risk Type | Risk | Mitigation |
|-----------|------|------------|
| **Technical** | AI output quality may be inconsistent | Iterative prompt refinement; users can edit generated content |
| **Adoption** | Team may resist new tool | Speed as carrot — focus on time saved, not compliance |
| **Resource** | Limited dev capacity | Lean MVP scope, defer non-essential features |

---

## Functional Requirements

### Authentication & User Management

- FR1: Users can log in with email and password
- FR2: Users can log out of the system
- FR3: Admins can create new user accounts
- FR4: Admins can assign roles to users (Admin, PM, Consultant)
- FR5: Admins can deactivate user accounts
- FR6: Users can view their own profile information

### Project & Customer Management

- FR7: PMs can create new customers
- FR8: PMs can create new projects linked to customers
- FR9: PMs can create apps within projects
- FR10: PMs can archive projects
- FR11: Users can view all projects they have access to
- FR12: PMs can assign consultants to projects

### Story Management

- FR13: Users can create new stories within a project
- FR14: Users can edit story details (title, description, notes)
- FR15: Users can view all stories in a project
- FR16: Users can filter and search stories
- FR17: Users can change story status (Draft, Ready, In Progress, Done)
- FR18: Users can attach files to stories (client docs, screenshots)

### AI Generation - Notes to Acceptance Criteria

- FR19: Users can input unstructured notes into a story
- FR20: Users can request AI-generated acceptance criteria from notes
- FR21: Users can view AI-generated acceptance criteria
- FR22: Users can edit AI-generated acceptance criteria
- FR23: Users can regenerate acceptance criteria with additional context

### AI Generation - Gap Analysis

- FR24: Users can request gap analysis on a story
- FR25: Users can view identified gaps and missing information
- FR26: Users can dismiss or address gap suggestions

### AI Generation - Development Plan

- FR27: Users can request AI-generated development plan from acceptance criteria
- FR28: Users can view AI-generated development plan
- FR29: Users can edit AI-generated development plan
- FR30: Users can regenerate development plan with additional context

### AI Generation - Test Scripts

- FR31: Users can request AI-generated test scripts from story/acceptance criteria
- FR32: Users can view AI-generated test scripts (Playwright-compatible format)
- FR33: Users can edit AI-generated test scripts
- FR34: Users can copy test scripts to clipboard for local execution

### Review Workflow

- FR35: Users can mark stories as "Ready for Review"
- FR36: Reviewers can view a queue of stories awaiting review
- FR37: Reviewers can approve stories
- FR38: Reviewers can request changes on stories with comments

### Kanban Board

- FR39: Users can view all stories in a kanban board layout with columns (Backlog, Ready, In Progress, Testing, Review, Done)
- FR40: Users can drag and drop stories between columns to change status
- FR41: Users can filter kanban board by project, assignee, and priority
- FR42: Users can add new stories directly from kanban columns

### App Management

- FR43: Users can view a list of all apps in the system
- FR44: Users can view app details including version, status (online/offline), and description
- FR45: Users can view project cards associated with an app with mini kanban displays
- FR46: Users can view module test coverage with health indicators (Healthy, Needs Tests, Critical)
- FR47: Users can view live logs with filtering by log level (All, Errors, Warnings)
- FR48: System displays AI suggestions for error patterns with auto-ticket creation
- FR49: Users can view environment cards (Development, Test, Acceptance, Production) with deployment status
- FR50: Users can deploy to environments and see deployment status changes

### Project Details

- FR51: Users can view project overview with linked app information
- FR52: Users can view project metrics including story counts and progress
- FR53: Users can view team members assigned to a project
- FR54: Users can navigate between project sections (Overview, Stories, Metrics, Team, Settings)
- FR55: Users can view recent project activity timeline

### Context Library

- FR56: Users can view all context sources (Notes, Summaries, Technical docs)
- FR57: Users can search context by title, type, or keywords
- FR58: Users can filter context by type (Note, Summary, Technical)
- FR59: Users can view linked story counts per context item
- FR60: Users can add new context items

### Floating AI Assistant

- FR61: Users can access AI assistant via floating action button (FAB) on detail pages
- FR62: FAB displays pulse animation to indicate availability
- FR63: Users can toggle AI chat sidebar open/closed via FAB or keyboard shortcut (Ctrl+K)
- FR64: AI chat provides tab-aware assistance based on current context

---

## Non-Functional Requirements

### Performance

| NFR | Requirement |
|-----|-------------|
| NFR1 | AI generation (acceptance criteria, dev plan, test scripts) completes within 10 seconds |
| NFR2 | Page load times under 2 seconds for all views |
| NFR3 | System supports concurrent usage by all team members (up to 20 users) without degradation |

### Security

| NFR | Requirement |
|-----|-------------|
| NFR4 | All user data encrypted at rest |
| NFR5 | All data transmission encrypted via HTTPS/TLS |
| NFR6 | Passwords stored using secure hashing (bcrypt/argon2) |
| NFR7 | Session tokens expire after 24 hours of inactivity |
| NFR8 | Role-based access control enforced on all API endpoints |
| NFR9 | Client requirement data isolated per project |

### Reliability

| NFR | Requirement |
|-----|-------------|
| NFR10 | System uptime target: 90%+ (internal tool, acceptable for MVP) |
| NFR11 | AI generation failures show clear error messages and retry options |
| NFR12 | Data backed up daily |

### Integration

| NFR | Requirement |
|-----|-------------|
| NFR13 | AI provider API failures handled gracefully with user-facing error messages |
| NFR14 | AI provider abstraction layer allows swapping providers without frontend changes |
| NFR15 | API requests to AI provider include appropriate timeouts (30 seconds max) |
