---
stepsCompleted: [1, 2, 3]
inputDocuments: ['_bmad-output/brainstorming/brainstorming-session-2026-02-26.md']
date: 2026-02-26
author: David
---

# Product Brief: BMAD Zoniq

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**Zoniq** is an AI-powered requirements and project management tool designed specifically for Mendix low-code development teams. It transforms how teams capture, refine, and execute user stories by making documentation **faster, not harder**.

The core insight: your team treats documentation as overhead because it doesn't produce immediate value. Zoniq flips this by rewarding documentation effort with AI-generated development plans, test cases, and instant answers to "what do I build?" questions. Speed becomes the carrot that drives quality.

Built for internal use by a Malaysian Mendix consultancy, Zoniq addresses a deeper challenge: cultivating automation-first thinking in a team culture that tends toward "build what you're told" rather than "question and automate." By embedding senior-level questioning instincts into AI prompts, the tool shifts behavior at the source - the requirements stage.

With AI-assisted programming on the rise, requirements quality is becoming the new bottleneck. Zoniq prepares teams for this future by making clarity and automation thinking the foundation of every project.

---

## Core Vision

### Problem Statement

Mendix development teams suffer from sparse, unclear user stories that cause downstream pain across the entire delivery lifecycle:

- **Juniors** struggle with unclear requirements, wasting time and feeling anxious about what to build
- **Seniors** spend excessive time reviewing and clarifying work that should have been clear from the start
- **Clients** experience slower delivery, lower quality, and scope creep from poorly defined requirements
- **Team culture** degrades through miscommunication conflicts and declining morale

The root cause is twofold: documentation is perceived as "extra work" rather than valuable, and teams lack an automation-first questioning mindset. In Malaysian work culture particularly, there's a tendency to "do as told" rather than critically examine whether a requirement should be automated in the first place.

### Problem Impact

| Impact Area | Consequence |
|-------------|-------------|
| **Delivery Speed** | Slower projects from rework and clarification loops |
| **Quality** | Lower quality outputs from unclear requirements |
| **Team Morale** | Conflicts from miscommunication, frustration from repeated clarifications |
| **Client Trust** | Frustrated clients from unclear scope and delayed delivery |
| **Future Readiness** | Unprepared for AI-assisted development where requirements are the bottleneck |

### Why Existing Solutions Fall Short

| Approach | Limitation |
|----------|------------|
| **Generic PM tools (Jira, Trello)** | Don't understand Mendix context; don't prompt automation thinking |
| **Custom Mendix PM platform** | Good UX, but documentation still feels like overhead; no AI assistance |
| **Mandatory fields & templates** | Compliance without understanding; doesn't shift mindset |
| **Training sessions** | Temporary effect; doesn't embed behavior into daily workflow |
| **Peer review gates** | Catches problems late; doesn't prevent them at source |

The gap: no tool makes documentation **rewarding** by producing immediate value. No tool embeds senior-level questioning instincts into the requirements workflow. No tool is built specifically to cultivate automation-first thinking in low-code teams.

### Proposed Solution

**Zoniq** is an AI-powered requirements tool that transforms documentation from overhead into acceleration:

**Core Value Loop:**
1. **Document faster** - AI-assisted story building with smart suggestions and templates
2. **Get immediate value** - AI generates dev plans, test cases, and answers from your stories
3. **Build better** - Clearer requirements mean less rework, faster delivery
4. **Think smarter** - Embedded prompts cultivate automation-first questioning mindset

**Key Capabilities (MVP Focus):**

| Stage | Capability | Value |
|-------|------------|-------|
| **Before Meeting** | AI-generated prep questions | Walk in prepared, ask the right things |
| **During Meeting** | Checklist tracker | Don't miss critical information |
| **After Meeting** | Gap analyzer + story converter | Notes → structured stories, fast |
| **Story Creation** | Smart story builder | Guided forms, not blank pages |
| **Before Approval** | Missing info detector + feasibility check | Catch problems early |
| **Ready Gate** | Completeness score | Quality gate, but earned through speed |

The tool doesn't force documentation - it **rewards** documentation with AI outputs that make development faster. Team adoption happens naturally because the tool helps them work, not because it's mandated.

### Key Differentiators

| Differentiator | Why It Matters |
|----------------|----------------|
| **Mendix-native thinking** | Understands Mendix concepts, patterns, and constraints |
| **Automation-first mindset** | Every prompt asks "should this be automated?" |
| **Senior instincts codified** | Dutch questioning culture embedded in AI prompts |
| **Speed as the carrot** | Adoption driven by productivity, not compliance |
| **Future-ready** | Prepares team for AI-assisted development beyond Mendix |
| **Cultural bridge** | Shifts behavior through tooling, not just training |

---

## Target Users

### Primary Users

#### Persona 1: Aisha - Junior Mendix Developer

**Profile:**
- 2-3 years Mendix development experience
- Competent builder who knows the platform well
- Meets clients directly - often alone, sometimes with senior support
- Proactively asks questions internally (good culture!)
- CS fundamentals but learned "school projects" thinking, not "business process" thinking

**Pain Points:**
- Meets client, hears requirement, doesn't ask the "why" or "should this be automated?" questions
- Returns from meeting with sparse notes
- Writes vague stories that don't capture what client actually needs
- Builds what was asked, discovers later it was wrong approach
- Review feedback: "This is inefficient" or "Why didn't you ask about X?"

**What Success Looks Like:**
- Before meeting: AI generates prep questions tailored to the client context
- During meeting: Checklist ensures nothing important is missed
- After meeting: AI converts notes to structured stories, flags gaps
- Feels prepared and confident in client meetings, not just in building
- Fewer "this is wrong" moments at review
- Starts internalizing automation-first thinking through repeated AI prompts

---

#### Persona 2: Marcus - Business Senior / Project Manager

**Profile:**
- Handles client relationships, sales, and project management
- Excellent verbal communicator - great in meetings, builds strong client rapport
- NOT technical - doesn't code, doesn't think in automation terms
- Translates client needs to dev team for new projects and complex requirements
- Sometimes the only bridge between client and developers

**Pain Points:**
- Terrible at writing requirements - knows what client said, can't articulate it clearly
- Meeting notes are sparse or non-existent
- Dev team constantly asks clarifying questions he already "answered" in the meeting
- Feels like documentation is "not his strength" - avoids it
- Creating bottleneck through poor handoffs

**What Success Looks Like:**
- Speaks requirements into tool, AI structures them into proper stories
- AI catches gaps: "You mentioned claims approval but didn't specify thresholds"
- Less back-and-forth with devs asking questions he thought he answered
- Looks competent and organized without having to become a "writer"
- Client requirements captured completely, not lost to memory

---

#### Persona 3: David - Technical Senior / Founder

**Profile:**
- 6 years Mendix + tech consultancy experience
- Only technical senior on a team of 6 juniors
- Dutch background - naturally questions everything
- Automation-first mindset that juniors don't have yet
- Reviews all significant work before deployment

**Pain Points:**
- Reviews work and finds inefficiencies that should have been caught at requirements stage
- Repeatedly gives same feedback - juniors don't internalize automation thinking
- Is the bottleneck for quality - can't scale himself across 6 juniors
- Wants team to think like him without him having to check everything
- Time spent firefighting instead of on architecture and strategy

**What Success Looks Like:**
- AI prompts juniors with the questions HE would ask at the right moment
- Fewer "this is inefficient" discoveries at review stage
- Team starts internalizing automation-first mindset through repeated tool exposure
- Can trust the process more, review less, scale his impact beyond his time
- Freed up for architecture, strategy, and business development

---

### Secondary Users

#### Client Stakeholders

**Profile:** Insurance company employees who request features and receive the delivered work.

**Pain Points:**
- Requirements misunderstood due to poor documentation
- Rework needed when delivered feature doesn't match expectations
- Slower delivery from inefficient development approaches

**How Zoniq Helps:** Better requirements lead to better delivery, fewer surprises, faster projects with higher quality.

---

### User Journey

#### Aisha's Journey: From Client Meeting to "Ready for Development"

| Stage | Current Experience | With Zoniq |
|-------|-------------------|------------|
| **Before Meeting** | No structured prep, glances at project notes | AI generates context-specific prep questions: "For claims workflow, ask: thresholds, escalation rules, exceptions, who approves what" |
| **During Meeting** | Takes sparse notes, forgets to ask key questions | Checklist tracks coverage in real-time. Alert: "You haven't asked about error handling yet" |
| **After Meeting** | Stares at blank story form, writes vague description | Pastes notes, AI structures into story with acceptance criteria, surfaces missing information |
| **Story Refinement** | Peer review finds gaps late in process | AI: "Story is 65% complete. Missing: edge cases, technical constraints, automation assessment" |
| **Ready Gate** | Story marked ready despite gaps | Story must reach quality threshold before "Ready" status is unlocked |
| **Result** | Rework discovered at code review | Clearer requirements, better implementations, less rework |

#### Marcus's Journey: From Client Call to Developer Handoff

| Stage | Current Experience | With Zoniq |
|-------|-------------------|------------|
| **During Call** | Great conversation, terrible notes | Speaks into Zoniq or uses AI to structure rough notes in real-time |
| **After Call** | "I'll write it up later" - never happens well | AI: "Based on your notes, here's a draft story. What did you mean by 'faster approval'?" |
| **Handoff** | Devs ask 10 clarifying questions | Story is clearer, gaps are pre-flagged, minimal back-and-forth |
| **Result** | Feels like a bad communicator, creates friction | Looks organized, competent, and thorough without changing who he is |

#### David's Journey: From Bottleneck to Scaled Impact

| Stage | Current Experience | With Zoniq |
|-------|-------------------|------------|
| **Review** | Finds inefficient implementations, gives same feedback again | Stories were better quality, implementations are better quality |
| **Coaching** | Repeatedly explains automation-first thinking | AI has been prompting juniors with HIS questions |
| **Trust** | Must check everything personally | Can trust process more, review less deeply, focus on architecture |
| **Result** | Bottleneck, burned out | Scaled impact, team growing, less firefighting |
