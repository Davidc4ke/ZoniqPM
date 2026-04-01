---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-03-create-stories-epics-6-9', 'step-04-final-validation']
status: complete
inputDocuments:
  - _bmad-output/planning-artifacts/_docs/prd.md
  - _bmad-output/planning-artifacts/_docs/architecture.md
  - _bmad-output/planning-artifacts/_docs/ux-design-specification.md
---

# BMAD Zoniq - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BMAD Zoniq, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Authentication & User Management (FR1-FR6)**
- FR1: Users can log in with email and password
- FR2: Users can log out of the system
- FR3: Admins can create new user accounts
- FR4: Admins can assign roles to users (Admin, PM, Consultant)
- FR5: Admins can deactivate user accounts
- FR6: Users can view their own profile information

**Customer & App Management (FR7-FR9, FR43-FR82)**
- FR7: PMs can create new customers
- FR8: PMs can create new apps linked to customers
- FR9: PMs can create new projects linked to apps
- FR43-FR48: App CRUD, details, version, status, environments
- FR49-FR58: Modules, features, feature details, linked stories
- FR59-FR68: Test coverage, workflows tab, context tab, projects tab
- FR69-FR78: Metrics/logs tab, live logging
- FR79-FR82: AI sidebar for apps

**Story Management (FR13-FR18, FR35-FR42)**
- FR13: Users can create new stories within a project
- FR14: Users can edit story details (title, description, notes)
- FR15: Users can view all stories in a project
- FR16: Users can filter and search stories
- FR17: Users can change story status (Draft, Ready, In Progress, Done)
- FR18: Users can attach files to stories (client docs, screenshots)
- FR35-FR38: Review workflow (mark ready, view queue, approve, request changes)
- FR39-FR42: Kanban board (view, drag-drop, filter, add stories)

**AI Generation - Notes to Acceptance Criteria (FR19-FR23)**
- FR19: Users can input unstructured notes into a story
- FR20: Users can request AI-generated acceptance criteria from notes
- FR21: Users can view AI-generated acceptance criteria
- FR22: Users can edit AI-generated acceptance criteria
- FR23: Users can regenerate acceptance criteria with additional context

**AI Generation - Gap Analysis (FR24-FR26)**
- FR24: Users can request gap analysis on a story
- FR25: Users can view identified gaps and missing information
- FR26: Users can dismiss or address gap suggestions

**AI Generation - Development Plan (FR27-FR30)**
- FR27: Users can request AI-generated development plan from acceptance criteria
- FR28: Users can view AI-generated development plan
- FR29: Users can edit AI-generated development plan
- FR30: Users can regenerate development plan with additional context

**AI Generation - Test Scripts (FR31-FR34)**
- FR31: Users can request AI-generated test scripts from story/acceptance criteria
- FR32: Users can view AI-generated test scripts (Playwright-compatible format)
- FR33: Users can edit AI-generated test scripts
- FR34: Users can copy test scripts to clipboard for local execution

**Project Management (FR83-FR112)**
- FR83-FR87: Project creation, app assignment, overview, team, navigation
- FR88-FR93: Module & feature selection, coverage status
- FR94-FR98: Feature-to-ticket integration, coverage gaps
- FR99-FR103: Project workflows tab, visual diagrams
- FR104-FR109: Project context tab, quick-add, search
- FR110-FR112: AI sidebar for projects

**Context Library (FR113-FR117)**
- FR113: Users can view all context sources (Notes, Summaries, Technical docs)
- FR114: Users can search context by title, type, or keywords
- FR115: Users can filter context by type (Note, Summary, Technical)
- FR116: Users can view linked story counts per context item
- FR117: Users can add new context items

**Floating AI Assistant (FR118-FR121)**
- FR118: Users can access AI assistant via floating action button (FAB) on detail pages
- FR119: FAB displays pulse animation to indicate availability
- FR120: Users can toggle AI chat sidebar open/closed via FAB or keyboard shortcut (Ctrl+K)
- FR121: AI chat provides tab-aware assistance based on current context

**Additional FRs - Context Tab (Story Details)**
- FR-new1: Users can manually create/edit/delete questions
- FR-new2: Users can manually add/edit/remove context sources (Notes, Documents, URLs, Project Files)
- FR-new3: Users can request AI-suggested questions based on story context
- FR-new4: Users can search context sources via AI
- FR-new5: Users can manually create/edit/delete acceptance criteria (Given/When/Then)

**Additional FRs - Implementation Tab (Story Details)**
- FR-new6: Users can manually create/edit/delete implementation sections
- FR-new7: Users can manually create/edit/delete implementation steps within sections
- FR-new8: Users can manually mark steps as complete/pending

**Additional FRs - QA Tab (Story Details)**
- FR-new9: Users can manually create/edit/delete UAT test steps
- FR-new10: Users can request AI-generated UAT test steps from acceptance criteria
- FR-new11: Users can mark UAT steps as complete/incomplete
- FR-new12: Users can view UAT completion progress
- FR-new13: Users can manually create/edit automated test scripts

**Additional FRs - Deployment Tab (Story Details)**
- FR-new14: Users can manually set/edit release information (date, version)
- FR-new15: Users can manually create/edit/delete release tasks
- FR-new16: Users can manually add/edit environments and deployment status
- FR-new17: Users can request AI deployment readiness assessment
- FR-new18: Users can mark tasks as complete/incomplete

**Additional FRs - Activity Tab (Story Details)**
- FR-new19: Users can add/edit/delete comments
- FR-new20: Users can reply to comments (threaded)
- FR-new21: Users can @mention team members in comments
- FR-new22: Users can request AI summary of discussion and action items

**Additional FRs - Project AI Generation**
- FR-new23: Users can request AI-generated modules based on project description
- FR-new24: Users can request AI-generated features within a module
- FR-new25: Users can request AI-generated workflow steps
- FR-new26: Users can request AI-generated context objects for a project
- FR-new27: Users can request AI-suggested questions for a project

**Additional FRs - App AI Generation**
- FR-new28: Users can request AI-generated modules for an app
- FR-new29: Users can request AI-generated features within an app module
- FR-new30: Users can request AI-generated context objects for an app

**Additional FRs - Home Page Dashboard**
- FR-new31: Users can view a dashboard with assigned stories, review queue, and project status
- FR-new32: Users can access a universal AI input field from the home page
- FR-new33: Users can interact with full-page AI chat overlay from hero input
- FR-new34: Users can view team activity feed on the dashboard
- FR-new35: Users can view app environment status at a glance on the dashboard
- FR-new36: Users can use quick create dropdown to create tickets, projects, stories, or documents
- FR-new37: Users can navigate via role-aware topbar navigation
- FR-new38: AI can parse natural language commands ("Open #47", "What's blocked?", "Assign #52 to Aisha")

### Non-Functional Requirements

**Performance (NFR1-NFR3)**
- NFR1: AI generation (acceptance criteria, dev plan, test scripts) completes within 10 seconds
- NFR2: Page load times under 2 seconds for all views
- NFR3: System supports concurrent usage by all team members (up to 20 users) without degradation

**Security (NFR4-NFR9)**
- NFR4: All user data encrypted at rest
- NFR5: All data transmission encrypted via HTTPS/TLS
- NFR6: Passwords stored using secure hashing (bcrypt/argon2)
- NFR7: Session tokens expire after 24 hours of inactivity
- NFR8: Role-based access control enforced on all API endpoints
- NFR9: Client requirement data isolated per project

**Reliability (NFR10-NFR12)**
- NFR10: System uptime target: 90%+ (internal tool, acceptable for MVP)
- NFR11: AI generation failures show clear error messages and retry options
- NFR12: Data backed up daily

**Integration (NFR13-NFR15)**
- NFR13: AI provider API failures handled gracefully with user-facing error messages
- NFR14: AI provider abstraction layer allows swapping providers without frontend changes
- NFR15: API requests to AI provider include appropriate timeouts (30 seconds max)

### Additional Requirements

**Starter Template (from Architecture):**
- Use `create-next-app` with TypeScript, Tailwind, ESLint, App Router, src-dir, Turbopack
- Post-install: shadcn/ui init, @xyflow/react, framer-motion, react-hook-form, zod

**Technology Stack:**
- Next.js 16 with React 19 and TypeScript 5
- Tailwind CSS 4 with shadcn/ui components
- PostgreSQL 16.x with Drizzle ORM 0.36.x
- Clerk 5.x for authentication and RBAC
- Vercel AI SDK 4.x for AI integration
- Server-Sent Events (SSE) for real-time features

**Implementation Patterns:**
- Database naming: snake_case (tables, columns)
- API naming: camelCase (JSON), plural nouns (endpoints)
- Component naming: PascalCase.tsx
- API response format: `{ data, meta? }` or `{ error }`
- Dates: ISO 8601 strings
- IDs: UUID v4 strings

**UX Requirements:**
- Desktop-first (1024px+ viewports for MVP)
- WCAG 2.1 Level AA accessibility
- Primary color: Warm Orange (#FF6B35)
- Dark color: Dark Brown (#2D1810)
- Font: Manrope (single font family)
- Base spacing unit: 8px

### FR Coverage Map

FR1-FR6: Epic 1 - Authentication & User Management
FR7-FR9: Epic 2 - Customer & App CRUD basics
FR10-FR12: Epic 3 - Project Archive, Access, Team Assignment
FR13-FR18: Epic 4 - Story CRUD operations
FR19-FR23: Epic 5 - AI Notes to Acceptance Criteria
FR24-FR26: Epic 5 - AI Gap Analysis
FR27-FR30: Epic 6 - AI Development Plan Generation
FR31-FR34: Epic 7 - AI Test Script Generation
FR35-FR38: Epic 4 - Review Workflow
FR39-FR42: Epic 4 - Kanban Board
FR43-FR58: Epic 2 - App Modules & Features
FR59-FR68: Epic 2 + 9 - Test Coverage & Workflows
FR69-FR78: Epic 9 - Metrics & Live Logs
FR79-FR82: Epic 2 - App AI Sidebar
FR83-FR112: Epic 3 - Project Management
FR113-FR117: Epic 5 - Context Library
FR118-FR121: Epics 2, 3, 5 - Floating AI FAB
FR-new1-FR-new5: Epic 5 - Context Tab Manual + AI
FR-new6-FR-new8: Epic 6 - Implementation Manual CRUD
FR-new9-FR-new13: Epic 7 - QA Manual + AI
FR-new14-FR-new18: Epic 8 - Deployment Manual + AI
FR-new19-FR-new22: Epic 8 - Activity Manual + AI
FR-new23-FR-new27: Epic 3 - Project AI Generation
FR-new28-FR-new30: Epic 2 - App AI Generation
FR-new31-FR-new38: Epic 2 - Home Page Dashboard

## Epic List

### Epic 1: Foundation & Authentication
**Goal:** Users can securely access Zoniq with role-based permissions. Development environment is initialized with the complete tech stack.
**FRs covered:** FR1-FR6, Starter Template (Architecture)

### Epic 2: Customer & App Management
**Goal:** PMs can create and manage the organizational hierarchy (Customers → Apps → Modules → Features) with AI-assisted generation via FAB/sidebar. Users can access a dashboard with AI-powered universal input, widgets for assigned work, and quick navigation.
**FRs covered:** FR7-FR9, FR43-FR68, FR79-FR82, FR118-FR121 (App pages), FR-new28-FR-new38

### Epic 3: Project Management
**Goal:** Users can create projects linked to apps, select/generate modules/features, track progress with workflows, and manage context - with AI assistance via FAB/sidebar.
**FRs covered:** FR10-FR12, FR83-FR112, FR118-FR121 (Project pages), FR-new23-FR-new27

### Epic 4: Story Management
**Goal:** Users can create, edit, and organize stories with status tracking, review workflow, and kanban visualization.
**FRs covered:** FR13-FR18, FR35-FR42

### Epic 5: Context & Requirements
**Goal:** Users can capture context (questions, notes, documents) and define acceptance criteria - manually or with AI via FAB/sidebar.
**FRs covered:** FR19-FR26, FR113-FR117, FR118-FR121 (Story pages), FR-new1-FR-new5

### Epic 6: Implementation Planning
**Goal:** Users can create structured implementation plans with sections and steps - manually or AI-generated.
**FRs covered:** FR27-FR30, FR-new6-FR-new8

### Epic 7: Quality Assurance
**Goal:** Users can create UAT test steps and automated Playwright scripts - manually or AI-generated.
**FRs covered:** FR31-FR34, FR-new9-FR-new13

### Epic 8: Deployment & Activity
**Goal:** Users can track releases, deployment status, and manage story activity/comments with AI assistance.
**FRs covered:** FR-new14-FR-new22

### Epic 9: Monitoring & Operations
**Goal:** Users can view live logs, monitor test coverage, track environment status, and monitor system health.
**FRs covered:** FR69-FR78

## Epic 1: Foundation & Authentication

**Goal:** Users can securely access Zoniq with role-based permissions. Development environment is initialized with the complete tech stack ready for development.

### Story 1.1: Initialize Next.js Project with Tech Stack

As a developer,
I want a Next.js 16 project initialized with TypeScript, Tailwind, shadcn/ui, and core dependencies,
So that I have a consistent foundation for building the application.

**Acceptance Criteria:**

**Given** a new project repository
**When** the developer runs the initialization script
**Then** a Next.js 16 project is created with React 19 and TypeScript 5
**And** Tailwind CSS 4 is configured with the project design tokens (Primary: #FF6B35, Dark: #2D1810)
**And** shadcn/ui is initialized with the Manrope font family
**And** @xyflow/react, framer-motion, react-hook-form, and zod are installed
**And** ESLint and Prettier are configured
**And** the project structure follows src-dir convention with App Router

### Story 1.2: Configure Clerk Authentication

As a developer,
I want Clerk authentication integrated with the Next.js application,
So that users can securely log in and out of the system.

**Acceptance Criteria:**

**Given** the initialized Next.js project
**When** Clerk 5.x is installed and configured
**Then** ClerkProvider wraps the application in the root layout
**And** environment variables for Clerk publishable key and secret key are documented
**And** middleware.ts is configured to protect routes
**And** public routes (login, signup, forgot-password) are accessible without authentication
**And** protected routes require valid session

### Story 1.3: Implement User Login

As a user,
I want to log in with my email and password,
So that I can access my Zoniq workspace securely. (FR1)

**Acceptance Criteria:**

**Given** a registered user with valid credentials
**When** the user navigates to the login page and enters email and password
**Then** the user is authenticated via Clerk
**And** the user is redirected to the home/dashboard page
**And** the user session is established

**Given** a user enters invalid credentials
**When** the user attempts to log in
**Then** an appropriate error message is displayed
**And** the user remains on the login page

**Given** an authenticated user
**When** the user navigates to the login page
**Then** the user is redirected to the dashboard

### Story 1.4: Implement User Logout

As a user,
I want to log out of the system,
So that my session is terminated and my data remains secure. (FR2)

**Acceptance Criteria:**

**Given** an authenticated user
**When** the user clicks the logout button in the navigation
**Then** the Clerk session is terminated
**And** the user is redirected to the login page
**And** all protected routes become inaccessible

**Given** a logged-out user
**When** the user attempts to access a protected route
**Then** the user is redirected to the login page

### Story 1.5: Admin User Management - Create Users

As an admin,
I want to create new user accounts,
So that team members can access the system. (FR3)

**Acceptance Criteria:**

**Given** an admin user on the user management page
**When** the admin clicks "Add User" and fills in required details (email, name, role)
**Then** a new user account is created in Clerk
**And** an invitation email is sent to the new user
**And** the new user appears in the user list

**Given** an admin creating a new user
**When** the email already exists in the system
**Then** an error message is displayed indicating the email is already registered

**Given** a non-admin user
**When** the user attempts to access the user management page
**Then** access is denied with appropriate message

### Story 1.6: Admin User Management - Assign Roles

As an admin,
I want to assign roles (Admin, PM, Consultant) to users,
So that users have appropriate permissions. (FR4)

**Acceptance Criteria:**

**Given** an admin user viewing the user list
**When** the admin selects a user and changes their role
**Then** the user's role is updated in Clerk metadata
**And** the change is reflected immediately in the UI
**And** the user's permissions are updated on next request

**Given** an admin assigning roles
**When** the admin attempts to remove the last admin role
**Then** an error is displayed preventing the action
**And** at least one admin must always exist in the system

### Story 1.7: Admin User Management - Deactivate Users

As an admin,
I want to deactivate user accounts,
So that former team members cannot access the system. (FR5)

**Acceptance Criteria:**

**Given** an admin user viewing the user list
**When** the admin deactivates a user account
**Then** the user's status changes to "inactive"
**And** the user's session is immediately terminated
**And** the user cannot log in again

**Given** an admin deactivating users
**When** the admin attempts to deactivate their own account
**Then** an error is displayed preventing self-deactivation

**Given** a deactivated user attempting to log in
**When** credentials are entered
**Then** an appropriate error message is displayed
**And** the user cannot access the system

### Story 1.8: User Profile View

As a user,
I want to view my own profile information,
So that I can verify my account details. (FR6)

**Acceptance Criteria:**

**Given** an authenticated user
**When** the user navigates to the profile page
**Then** the user's profile information is displayed (name, email, role)
**And** the user can see their assigned role and permissions summary

**Given** a user viewing their profile
**When** the user wants to edit profile information
**Then** editable fields (name) are available
**And** email and role are displayed as read-only

## Epic 2: Customer & App Management

**Goal:** PMs can create and manage the organizational hierarchy (Customers → Apps → Modules → Features) with AI-assisted generation via FAB/sidebar. Users can access a dashboard with AI-powered universal input, widgets for assigned work, and quick navigation.

### Story 2.0: Home Page Dashboard Layout

As a user,
I want to see a dashboard layout with navigation and quick actions when I log in,
So that I can quickly understand my work and navigate to relevant areas. (FR-new31, FR-new36, FR-new37)

**Acceptance Criteria:**

**Given** an authenticated user
**When** the user navigates to the home page
**Then** a dashboard layout is displayed with a responsive grid of widgets

**Given** a user viewing the dashboard
**When** the user views the topbar
**Then** role-aware navigation items are displayed (Dashboard, Kanban, Projects, Apps, Masterdata, Accounts)
**And** navigation items are shown/hidden based on user role

**Given** a user viewing the topbar
**When** the user clicks the Create dropdown
**Then** quick create options are displayed: New Ticket, New Project, New Story, New Document

**Given** a user on the dashboard
**When** the user clicks a quick create option
**Then** the appropriate creation form opens (modal or navigation)

**Given** a user viewing the topbar
**When** the user clicks the profile avatar
**Then** a dropdown shows profile options (View Profile, Settings, Sign Out)

### Story 2.0.1: Universal AI Input Field

As a user,
I want to access a universal AI input field on the home page that expands into a full-page chat,
So that I can interact with AI using natural language commands. (FR-new32, FR-new33, FR-new38)

**Acceptance Criteria:**

**Given** a user on the home page
**When** the page loads
**Then** a hero input field is displayed prominently with an AI icon and placeholder text

**Given** a user viewing the hero input
**When** the user types a query and clicks "Ask"
**Then** the page transforms into a full-page AI chat overlay
**And** the user's query is sent to the AI

**Given** a user in the AI chat overlay
**When** the user types a natural language command (e.g., "Open #47", "What's blocked?", "Assign #52 to Aisha")
**Then** the AI parses the command and performs the appropriate action
**And** responses include actionable suggestions with buttons

**Given** a user in the AI chat overlay
**When** the user clicks "Back to Dashboard" or presses Escape
**Then** the chat overlay closes and the dashboard is restored

**Given** a user in the AI chat overlay
**When** the AI generates a response
**Then** the response is streamed token-by-token with a typing indicator

**Given** an AI command to open a story (e.g., "Open #47")
**When** the AI processes the command
**Then** the user is navigated to the story detail page

**Given** an AI command asking about blocked items (e.g., "What's blocked?")
**When** the AI processes the command
**Then** a list of blocked stories is displayed with reasons and durations

### Story 2.0.2: Dashboard Widgets

As a user,
I want to see widgets on the dashboard showing my work, project status, and team activity,
So that I can quickly understand the current state of work. (FR-new31, FR-new34, FR-new35)

**Acceptance Criteria:**

**Assigned Stories Widget:**
**Given** a user on the dashboard
**When** the Assigned Stories widget loads
**Then** stories assigned to the current user are displayed with title, project, status, and priority
**And** each story card shows the assignee avatar and priority indicator
**And** clicking a story card navigates to the story detail page

**Review Queue Widget:**
**Given** a user with stories awaiting review
**When** the Review Queue widget loads
**Then** stories in "Ready" or "In Review" status are displayed
**And** a count badge shows the total number of items in the queue

**Projects Status Widget:**
**Given** a user on the dashboard
**When** the Projects widget loads
**Then** active projects are displayed with progress percentage and progress bar
**And** a mini-kanban view shows story counts by status (Backlog, Active, Testing, Review, Done)
**And** clicking a project navigates to the project detail page

**Apps Status Widget:**
**Given** a user on the dashboard
**When** the Apps widget loads
**Then** apps are displayed with environment status indicators (Dev, Test, Acc, Prod)
**And** warning counts are shown for apps with issues
**And** clicking an app navigates to the app detail page

**Team Activity Widget:**
**Given** a user on the dashboard
**When** the Team Activity widget loads
**Then** recent team activity is displayed in a horizontal scrollable feed
**And** each activity item shows user avatar, action description, and timestamp
**And** activities include: story status changes, story creation, story completion, AI generation actions

### Story 2.1: Customer CRUD Operations

As a PM,
I want to create, view, edit, and delete customers,
So that I can organize apps by client organization. (FR7)

**Acceptance Criteria:**

**Given** a PM user on the home page
**When** the user clicks "Add Customer" and fills in required details (name, description)
**Then** a new customer record is created in the database
**And** the customer appears in the customer list
**And** the customer is assigned to the current user's organization

**Given** a user viewing the customer list
**When** the user clicks on a customer
**Then** the customer detail page is displayed with all customer information
**And** linked apps are shown

**Given** a PM user viewing a customer
**When** the user edits customer details and saves
**Then** the customer record is updated
**And** changes are reflected immediately

**Given** a PM user viewing a customer with no linked apps
**When** the user deletes the customer
**Then** the customer is soft-deleted from the database
**And** the customer no longer appears in the list

**Given** a PM user attempting to delete a customer with linked apps
**When** the user clicks delete
**Then** an error is displayed preventing deletion
**And** the user is informed that apps must be removed first

### Story 2.2: App CRUD Operations

As a PM,
I want to create, view, edit, and delete apps linked to customers,
So that I can track Mendix applications per client. (FR8, FR43-FR48)

**Acceptance Criteria:**

**Given** a PM user on a customer detail page
**When** the user clicks "Add App" and fills in required details (name, description, Mendix App ID)
**Then** a new app record is created and linked to the customer
**And** the app appears in the customer's app list

**Given** a user viewing the apps list
**When** the user clicks on an app
**Then** the app detail page is displayed with overview tab active
**And** app details include name, description, version, status, Mendix App ID

**Given** a PM user viewing an app
**When** the user edits app details (name, description, version, status) and saves
**Then** the app record is updated
**And** changes are reflected immediately

**Given** a PM user viewing an app with no linked projects
**When** the user deletes the app
**Then** the app is soft-deleted from the database
**And** the app no longer appears in the customer's app list

**Given** a PM user attempting to delete an app with linked projects
**When** the user clicks delete
**Then** an error is displayed preventing deletion
**And** the user is informed that projects must be removed first

### Story 2.3: App Detail Overview Tab

As a user,
I want to view an app's overview with details, version, status, and description,
So that I can quickly understand the app's current state. (FR43-FR48)

**Acceptance Criteria:**

**Given** a user navigating to an app detail page
**When** the page loads
**Then** the overview tab is displayed by default
**And** the following information is shown: app name, description, current version, status, Mendix App ID, linked customer

**Given** a user on the app overview tab
**When** the user views the status
**Then** status is displayed with a color-coded badge (Active, Inactive, In Development)

**Given** a user on the app overview tab
**When** the user views the modules section
**Then** a summary of modules count is displayed
**And** a quick link to modules tab is available

### Story 2.4: App Environments Management

As a PM,
I want to configure and view app environments (Dev, Test, Acc, Prod),
So that I can track deployment status across environments. (FR48)

**Acceptance Criteria:**

**Given** a PM user on an app detail page
**When** the user navigates to the environments section
**Then** a list of configured environments is displayed with name, URL, and status

**Given** a PM user managing environments
**When** the user clicks "Add Environment" and provides details (name, URL)
**Then** a new environment is created for the app
**And** the environment appears in the list

**Given** a PM user viewing environments
**When** the user edits an environment's details
**Then** the environment is updated
**And** changes are reflected immediately

**Given** a PM user viewing environments
**When** the user removes an environment
**Then** the environment is deleted from the app
**And** it no longer appears in the list

### Story 2.5: Module CRUD Operations

As a PM,
I want to create, view, edit, and delete modules within an app,
So that I can organize app functionality into logical units. (FR49-FR51)

**Acceptance Criteria:**

**Given** a PM user on an app detail page
**When** the user navigates to the modules tab and clicks "Add Module"
**Then** a modal opens to create a new module with name and description fields

**Given** a PM user creating a module
**When** the user fills in name and description and saves
**Then** a new module record is created and linked to the app
**And** the module appears in the modules list

**Given** a user viewing the modules tab
**When** the user clicks on a module
**Then** the module detail panel shows name, description, and linked features

**Given** a PM user viewing a module
**When** the user edits the module name or description and saves
**Then** the module record is updated
**And** changes are reflected immediately

**Given** a PM user viewing a module with no linked features or stories
**When** the user deletes the module
**Then** the module is soft-deleted
**And** the module no longer appears in the list

### Story 2.6: Feature CRUD Operations

As a PM,
I want to create, view, edit, and delete features within a module,
So that I can track granular functionality and link to stories. (FR52-FR58)

**Acceptance Criteria:**

**Given** a PM user on a module detail view
**When** the user clicks "Add Feature"
**Then** a modal opens to create a new feature with name and description fields

**Given** a PM user creating a feature
**When** the user fills in name and description and saves
**Then** a new feature record is created and linked to the module
**And** the feature appears in the module's feature list

**Given** a user viewing a module's features
**When** the user clicks on a feature
**Then** the feature detail panel shows name, description, and linked stories

**Given** a PM user viewing a feature
**When** the user edits the feature name or description and saves
**Then** the feature record is updated
**And** changes are reflected immediately

**Given** a PM user viewing a feature with no linked stories
**When** the user deletes the feature
**Then** the feature is soft-deleted
**And** the feature no longer appears in the list

**Given** a user viewing a feature
**When** the user views linked stories
**Then** a list of stories referencing this feature is displayed
**And** each story shows title, status, and project

### Story 2.7: App Test Coverage Tab

As a user,
I want to view test coverage status for an app's modules and features,
So that I can understand what's tested and what needs attention. (FR59-FR68)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Test Coverage tab
**Then** a summary of test coverage is displayed per module

**Given** a user viewing test coverage
**When** the user expands a module
**Then** feature-level coverage is displayed
**And** each feature shows test count and coverage percentage

**Given** a user viewing test coverage
**When** the user clicks on a feature
**Then** linked test scripts and UAT steps are displayed
**And** pass/fail status is shown for each

### Story 2.8: App Workflows Tab

As a user,
I want to view visual workflow diagrams for an app,
So that I can understand business processes at a glance. (FR59-FR68)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Workflows tab
**Then** a list of workflows associated with the app is displayed

**Given** a user viewing the workflows tab
**When** the user clicks on a workflow
**Then** a visual workflow diagram is rendered using React Flow
**And** nodes and connections are displayed according to workflow definition

**Given** a user viewing a workflow diagram
**When** the user clicks on a node
**Then** node details are displayed in a side panel
**And** relevant linked stories are shown

### Story 2.9: App Context Tab

As a user,
I want to view and manage context items (notes, documents) linked to an app,
So that I can access relevant information while working. (FR59-FR68)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Context tab
**Then** a list of context items linked to the app is displayed

**Given** a user viewing the context tab
**When** the user searches or filters context items
**Then** the list is filtered based on the search query or filter criteria

**Given** a user on the context tab
**When** the user clicks "Add Context"
**Then** a modal opens to create a new context item (Note, Document, URL)
**And** the new context is linked to the app

### Story 2.10: App Projects Tab

As a user,
I want to view all projects linked to an app,
So that I can see implementation history and active work. (FR59-FR68)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Projects tab
**Then** a list of all projects linked to the app is displayed

**Given** a user viewing the projects tab
**When** the user views the project list
**Then** each project shows name, status, start date, and story count

**Given** a user viewing the projects tab
**When** the user clicks on a project
**Then** the user is navigated to the project detail page

**Given** a user on the projects tab
**When** the user filters by status (Active, Completed, On Hold)
**Then** the list shows only projects matching the filter

### Story 2.11: App Metrics & Logs Tab

As a user,
I want to view metrics and access live logging for an app,
So that I can monitor performance and troubleshoot issues. (FR69-FR78)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Metrics tab
**Then** key metrics are displayed (story count, test coverage %, active sprints)

**Given** a user viewing metrics
**When** the user clicks on the Logs section
**Then** recent log entries are displayed in chronological order
**And** logs can be filtered by level (Info, Warning, Error)

**Given** a user viewing logs
**When** the user enables "Live Mode"
**Then** logs are streamed in real-time via Server-Sent Events
**And** new log entries appear automatically

**Given** a user in live log mode
**When** the user disables live mode
**Then** streaming stops and the current log view is preserved

### Story 2.12: Floating AI FAB for App Pages

As a user,
I want to access AI assistance via a floating action button on app pages,
So that I can get contextual help without leaving my work. (FR118-FR121)

**Acceptance Criteria:**

**Given** a user on any app detail page
**When** the page loads
**Then** a floating action button (FAB) is displayed in the bottom-right corner
**And** the FAB displays a pulse animation to indicate availability

**Given** a user viewing the FAB
**When** the user clicks the FAB
**Then** the AI chat sidebar opens from the right side
**And** the sidebar context is set to the current app

**Given** a user with the AI sidebar open
**When** the user clicks the FAB again or presses Escape
**Then** the AI chat sidebar closes

**Given** a user on an app page
**When** the user presses Ctrl+K
**Then** the AI chat sidebar toggles open/closed

### Story 2.13: AI Chat Sidebar for Apps

As a user,
I want to interact with an AI chat sidebar that understands app context,
So that I can ask questions and get AI assistance relevant to the current app. (FR79-FR82)

**Acceptance Criteria:**

**Given** a user with the AI sidebar open on an app page
**When** the user types a question and submits
**Then** the AI responds with context-aware answers about the current app
**And** the response includes relevant information from app modules, features, and linked projects

**Given** a user interacting with the AI sidebar
**When** the AI generates a response
**Then** the response is streamed token-by-token for perceived performance
**And** a typing indicator is shown during generation

**Given** a user on different tabs (Overview, Modules, Workflows)
**When** the user asks a question
**Then** the AI context includes the current tab's content
**And** responses are tailored to the current view

**Given** a user with the AI sidebar open
**When** an error occurs during AI generation
**Then** a clear error message is displayed
**And** a retry option is available

### Story 2.14: AI-Generated Modules for Apps

As a PM,
I want to request AI-generated module suggestions for an app,
So that I can quickly bootstrap the module structure. (FR-new28)

**Acceptance Criteria:**

**Given** a PM user on an app's modules tab
**When** the user clicks "AI Generate Modules"
**Then** the AI sidebar opens with a prompt for module generation

**Given** a PM user requesting AI modules
**When** the AI generates module suggestions
**Then** a list of proposed modules with names and descriptions is displayed

**Given** a PM user viewing AI-generated modules
**When** the user clicks "Add All" or selects specific modules
**Then** the selected modules are created and linked to the app
**And** the modules appear in the modules list

**Given** a PM user not satisfied with suggestions
**When** the user clicks "Regenerate"
**Then** new module suggestions are generated based on app context

### Story 2.15: AI-Generated Features for App Modules

As a PM,
I want to request AI-generated feature suggestions within a module,
So that I can quickly define features based on module purpose. (FR-new29)

**Acceptance Criteria:**

**Given** a PM user viewing a module
**When** the user clicks "AI Generate Features"
**Then** the AI generates feature suggestions based on module and app context

**Given** a PM user viewing AI-generated features
**When** the features are displayed
**Then** each feature shows name and description
**And** features can be individually selected for creation

**Given** a PM user selecting AI features
**When** the user confirms selection
**Then** selected features are created and linked to the module
**And** the features appear in the module's feature list

### Story 2.16: AI-Generated Context for Apps

As a PM,
I want to request AI-generated context objects for an app,
So that I can quickly populate relevant documentation links. (FR-new30)

**Acceptance Criteria:**

**Given** a PM user on an app's context tab
**When** the user clicks "AI Suggest Context"
**Then** the AI analyzes the app and suggests relevant context items

**Given** a PM user viewing AI-suggested context
**When** suggestions are displayed
**Then** each suggestion includes type (Note, URL, Document reference) and content

**Given** a PM user selecting AI suggestions
**When** the user confirms selection
**Then** selected context items are created and linked to the app
**And** the items appear in the context list

## Epic 3: Project Management

**Goal:** Users can create projects linked to apps, select/generate modules/features, track progress with workflows, and manage context - with AI assistance via FAB/sidebar.

### Story 3.1: Project CRUD Operations

As a PM,
I want to create, view, edit, and delete projects linked to apps,
So that I can track implementation work per app. (FR83-FR87)

**Acceptance Criteria:**

**Given** a PM user on an app detail page
**When** the user clicks "Add Project" and fills in required details (name, description, start date)
**Then** a new project record is created and linked to the app
**And** the project appears in the app's project list

**Given** a user viewing projects
**When** the user clicks on a project
**Then** the project detail page is displayed with overview tab active

**Given** a PM user viewing a project
**When** the user edits project details (name, description, status, dates) and saves
**Then** the project record is updated
**And** changes are reflected immediately

**Given** a PM user viewing a project with no linked stories
**When** the user deletes the project
**Then** the project is soft-deleted
**And** the project no longer appears in the app's project list

**Given** a PM user attempting to delete a project with linked stories
**When** the user clicks delete
**Then** an error is displayed preventing deletion
**And** the user is informed that stories must be removed first

### Story 3.2: Project Overview Tab

As a user,
I want to view a project overview with details, team, and progress summary,
So that I can quickly understand the project state. (FR83-FR87)

**Acceptance Criteria:**

**Given** a user navigating to a project detail page
**When** the page loads
**Then** the overview tab is displayed by default
**And** the following information is shown: project name, description, status, start/end dates, linked app

**Given** a user on the project overview tab
**When** the user views the progress section
**Then** story counts by status are displayed (Draft, Ready, In Progress, Done)
**And** a progress bar shows completion percentage

**Given** a user on the project overview tab
**When** the user views the team section
**Then** assigned team members are listed with their roles

### Story 3.3: Project Module & Feature Selection

As a PM,
I want to select which modules and features from the parent app are in scope for a project,
So that I can define what the project will deliver. (FR88-FR93)

**Acceptance Criteria:**

**Given** a PM user on a project detail page
**When** the user navigates to the Modules tab
**Then** all modules from the parent app are listed with selection checkboxes

**Given** a PM user viewing modules
**When** the user selects or deselects modules
**Then** the project scope is updated accordingly
**And** selected modules show their features

**Given** a PM user viewing a selected module
**When** the user selects or deselects features within the module
**Then** only selected features are included in project scope

**Given** a user viewing the modules tab
**When** the scope changes
**Then** coverage statistics are recalculated

### Story 3.4: Project Coverage Status

As a user,
I want to view feature-to-ticket coverage status for a project,
So that I can see which features have stories and which have gaps. (FR94-FR98)

**Acceptance Criteria:**

**Given** a user on a project detail page
**When** the user navigates to the Coverage tab
**Then** a summary of coverage is displayed showing features with/without linked stories

**Given** a user viewing coverage
**When** the user views the gaps section
**Then** features without linked stories are highlighted
**And** a count of uncovered features is shown

**Given** a user viewing a feature gap
**When** the user clicks "Create Story"
**Then** a new story is pre-linked to that feature

### Story 3.5: Project Workflows Tab

As a user,
I want to view visual workflow diagrams for a project with progress indicators,
So that I can understand which workflow steps are complete. (FR99-FR103)

**Acceptance Criteria:**

**Given** a user on a project detail page
**When** the user navigates to the Workflows tab
**Then** visual workflow diagrams are displayed using React Flow

**Given** a user viewing workflows
**When** the workflow renders
**Then** nodes show completion status with color indicators (complete, in-progress, pending)

**Given** a user viewing a workflow node
**When** the user clicks on the node
**Then** linked stories for that workflow step are displayed
**And** completion status is shown

### Story 3.6: Project Context Tab

As a user,
I want to view and manage context items linked to a project,
So that I can access project-specific documentation. (FR104-FR109)

**Acceptance Criteria:**

**Given** a user on a project detail page
**When** the user navigates to the Context tab
**Then** a list of context items linked to the project is displayed

**Given** a user viewing the context tab
**When** the user searches or filters context items
**Then** the list is filtered based on the search query or filter criteria

**Given** a user on the context tab
**When** the user clicks "Add Context"
**Then** a modal opens to create a new context item (Note, Document, URL)
**And** the new context is linked to the project

**Given** a user on the context tab
**When** the user clicks "Quick Add"
**Then** a quick-add form appears inline for rapid context entry

### Story 3.7: Floating AI FAB for Project Pages

As a user,
I want to access AI assistance via a floating action button on project pages,
So that I can get contextual help without leaving my work. (FR118-FR121)

**Acceptance Criteria:**

**Given** a user on any project detail page
**When** the page loads
**Then** a floating action button (FAB) is displayed in the bottom-right corner
**And** the FAB displays a pulse animation to indicate availability

**Given** a user viewing the FAB
**When** the user clicks the FAB
**Then** the AI chat sidebar opens from the right side
**And** the sidebar context is set to the current project

**Given** a user with the AI sidebar open
**When** the user clicks the FAB again or presses Escape
**Then** the AI chat sidebar closes

**Given** a user on a project page
**When** the user presses Ctrl+K
**Then** the AI chat sidebar toggles open/closed

### Story 3.8: AI Chat Sidebar for Projects

As a user,
I want to interact with an AI chat sidebar that understands project context,
So that I can ask questions about the project. (FR110-FR112)

**Acceptance Criteria:**

**Given** a user with the AI sidebar open on a project page
**When** the user types a question and submits
**Then** the AI responds with context-aware answers about the current project
**And** the response includes relevant information from project modules, features, stories, and workflows

**Given** a user interacting with the AI sidebar
**When** the AI generates a response
**Then** the response is streamed token-by-token for perceived performance
**And** a typing indicator is shown during generation

**Given** a user on different tabs (Overview, Modules, Workflows, Context)
**When** the user asks a question
**Then** the AI context includes the current tab's content
**And** responses are tailored to the current view

**Given** a user with the AI sidebar open
**When** an error occurs during AI generation
**Then** a clear error message is displayed
**And** a retry option is available

### Story 3.9: AI-Generated Modules for Projects

As a PM,
I want to request AI-generated module suggestions for a project,
So that I can quickly define the project scope. (FR-new23)

**Acceptance Criteria:**

**Given** a PM user on a project's modules tab
**When** the user clicks "AI Generate Modules"
**Then** the AI sidebar opens with a prompt for module generation based on project description

**Given** a PM user requesting AI modules
**When** the AI generates module suggestions
**Then** a list of proposed modules with names and descriptions is displayed

**Given** a PM user viewing AI-generated modules
**When** the user clicks "Add All" or selects specific modules
**Then** the selected modules are added to project scope
**And** the modules appear in the project's module list

**Given** a PM user not satisfied with suggestions
**When** the user clicks "Regenerate"
**Then** new module suggestions are generated based on project context

### Story 3.10: AI-Generated Features for Project Modules

As a PM,
I want to request AI-generated feature suggestions within a project module,
So that I can quickly populate features. (FR-new24)

**Acceptance Criteria:**

**Given** a PM user viewing a project module
**When** the user clicks "AI Generate Features"
**Then** the AI generates feature suggestions based on module, project, and app context

**Given** a PM user viewing AI-generated features
**When** the features are displayed
**Then** each feature shows name and description
**And** features can be individually selected for addition

**Given** a PM user selecting AI features
**When** the user confirms selection
**Then** selected features are added to the project module scope
**And** the features appear in the module's feature list

### Story 3.11: AI-Generated Workflow Steps

As a PM,
I want to request AI-generated workflow steps for a project,
So that I can quickly define the project workflow. (FR-new25)

**Acceptance Criteria:**

**Given** a PM user on a project's workflows tab
**When** the user clicks "AI Generate Workflow"
**Then** the AI generates workflow step suggestions based on project scope

**Given** a PM user viewing AI-generated workflow steps
**When** the steps are displayed
**Then** each step shows name, description, and suggested order

**Given** a PM user selecting AI workflow steps
**When** the user confirms selection
**Then** a new workflow is created with the generated steps
**And** the workflow is linked to the project

### Story 3.12: AI-Generated Context for Projects

As a PM,
I want to request AI-generated context objects for a project,
So that I can quickly populate project documentation. (FR-new26)

**Acceptance Criteria:**

**Given** a PM user on a project's context tab
**When** the user clicks "AI Suggest Context"
**Then** the AI analyzes the project and suggests relevant context items

**Given** a PM user viewing AI-suggested context
**When** suggestions are displayed
**Then** each suggestion includes type (Note, URL, Document reference) and content

**Given** a PM user selecting AI suggestions
**When** the user confirms selection
**Then** selected context items are created and linked to the project
**And** the items appear in the context list

### Story 3.13: AI-Suggested Questions for Projects

As a PM,
I want to request AI-suggested questions for a project,
So that I can identify important clarifications needed. (FR-new27)

**Acceptance Criteria:**

**Given** a PM user on a project detail page
**When** the user clicks "AI Suggest Questions"
**Then** the AI analyzes the project and generates relevant questions

**Given** a PM user viewing AI-suggested questions
**When** the questions are displayed
**Then** each question addresses potential ambiguity or missing information
**And** questions are categorized by topic (scope, timeline, dependencies)

**Given** a PM user selecting a suggested question
**When** the user clicks "Add to Context"
**Then** the question is added as a context item for the project

### Story 3.14: Archive Projects

As a PM,
I want to archive projects that are no longer active,
So that I can keep the project list focused on active work without losing historical data. (FR10)

**Acceptance Criteria:**

**Given** a PM user viewing a project detail page
**When** the user clicks "Archive Project"
**Then** a confirmation dialog appears asking for confirmation

**Given** a PM user confirming archive action
**When** the user confirms
**Then** the project status changes to "Archived"
**And** the project is hidden from default project lists
**And** the project data is preserved for historical reference

**Given** a PM user viewing archived projects
**When** the user applies the "Archived" filter
**Then** archived projects are displayed with an "Archived" badge

**Given** a PM user viewing an archived project
**When** the user clicks "Restore Project"
**Then** the project status changes back to "Active"
**And** the project reappears in default project lists

**Given** a PM user attempting to archive a project with active stories
**When** the user clicks "Archive Project"
**Then** a warning is displayed indicating there are active stories
**And** the user can choose to proceed or cancel

### Story 3.15: View Accessible Projects

As a user,
I want to view all projects I have access to,
So that I can see relevant projects based on my role and assignments. (FR11)

**Acceptance Criteria:**

**Given** an authenticated user on the projects list page
**When** the page loads
**Then** only projects the user has access to are displayed

**Given** a user viewing the projects list
**When** access is determined
**Then** access includes:
- Projects where the user is a team member
- Projects within the user's organization (for org-level roles)
- Projects explicitly shared with the user

**Given** a user on the projects list
**When** the user views project cards
**Then** each project shows name, status, linked app, and user's role

**Given** a user filtering projects
**When** the user applies filters (status, app, role)
**Then** the list updates to show only matching accessible projects

**Given** an admin user viewing projects
**When** the admin views the projects list
**Then** all projects in the organization are displayed

**Given** a consultant user viewing projects
**When** the consultant views the projects list
**Then** only projects they are assigned to are displayed

### Story 3.16: Assign Consultants to Projects

As a PM,
I want to assign consultants to projects,
So that team members can access and contribute to project work. (FR12)

**Acceptance Criteria:**

**Given** a PM user on a project detail page
**When** the user navigates to the Team section
**Then** a list of current team members is displayed with their roles

**Given** a PM user viewing the team section
**When** the user clicks "Add Team Member"
**Then** a modal opens with a list of available consultants

**Given** a PM user adding a team member
**When** the user selects a consultant and confirms
**Then** the consultant is added to the project team
**And** the consultant now has access to the project

**Given** a PM user viewing team members
**When** the user removes a consultant from the project
**Then** the consultant is removed from the team list
**And** the consultant loses access to the project

**Given** a PM user attempting to remove the last PM from a project
**When** the user clicks remove
**Then** an error is displayed preventing the action
**And** at least one PM must remain assigned to each project

**Given** a consultant added to a project
**When** the assignment is saved
**Then** the consultant receives a notification about the new assignment

## Epic 4: Story Management

**Goal:** Users can create, edit, and organize stories with status tracking, review workflow, and kanban visualization.

### Story 4.1: Story CRUD Operations

As a user,
I want to create, view, edit, and delete stories within a project,
So that I can track work items. (FR13-FR16)

**Acceptance Criteria:**

**Given** a user on a project detail page
**When** the user clicks "Add Story" and fills in required details (title, description)
**Then** a new story record is created and linked to the project
**And** the story appears in the project's story list with status "Refinement"

**Given** a user viewing the story list
**When** the user clicks on a story
**Then** the story detail page is displayed with all story information

**Given** a user editing a story
**When** the user modifies title, description, or notes and saves
**Then** the story record is updated
**And** changes are reflected immediately

**Given** a user viewing a story
**When** the user deletes the story
**Then** the story is soft-deleted
**And** the story no longer appears in lists

**Given** a user on the story list
**When** the user searches by title or description
**Then** the list is filtered to matching stories (FR16)

### Story 4.2: Story Notes & Attachments

As a user,
I want to add unstructured notes and attach files to stories,
So that I can capture client requirements and reference materials. (FR18)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user adds notes to the story
**Then** the notes are saved and displayed in the story detail

**Given** a user with notes on a story
**When** the user edits the notes
**Then** the notes are updated
**And** changes are reflected immediately

**Given** a user on a story detail page
**When** the user attaches a file (client doc, screenshot, etc.)
**Then** the file is uploaded and linked to the story
**And** the attachment appears in the story's attachments section

**Given** a user viewing attachments
**When** the user clicks on an attachment
**Then** the file opens in a new tab or downloads

**Given** a user with attachments
**When** the user removes an attachment
**Then** the file is unlinked from the story
**And** the attachment no longer appears

### Story 4.3: Story Status Management

As a user,
I want to change story status through the workflow (Refinement → To Do → In Progress → Reviewing → Testing → Pending Release → Released),
So that I can track story progress. (FR17)

**Acceptance Criteria:**

**Given** a user viewing a story
**When** the user views the status field
**Then** available statuses are displayed: Refinement, To Do, In Progress, Reviewing, Testing, Pending Release, Released

**Given** a user changing story status
**When** the user selects a new status
**Then** the story status is updated
**And** the status change is reflected in all views (detail, list, kanban)

**Given** a user moving status to "In Progress"
**When** the status is changed
**Then** the story can be assigned to a user
**And** a start timestamp is recorded

**Given** a user moving status to "Released"
**When** the status is changed
**Then** a release timestamp is recorded
**And** the story is marked as complete

### Story 4.4: Kanban Board View

As a user,
I want to view stories in a kanban board organized by status columns,
So that I can visualize workflow progress. (FR39)

**Acceptance Criteria:**

**Given** a user on a project detail page
**When** the user navigates to the Kanban tab
**Then** stories are displayed in columns by status (Refinement, To Do, In Progress, Reviewing, Testing, Pending Release, Released)

**Given** a user viewing the kanban board
**When** the board renders
**Then** each column shows story cards with title, status, and assignee
**And** story counts per column are displayed

**Given** a user on the kanban board
**When** the user clicks on a story card
**Then** the story detail panel opens (slide-over or modal)
**And** the user can view and edit story details

### Story 4.5: Kanban Drag-and-Drop

As a user,
I want to drag and drop stories between status columns on the kanban board,
So that I can update story status visually. (FR40)

**Acceptance Criteria:**

**Given** a user viewing the kanban board
**When** the user drags a story card to a different status column
**Then** the story status is updated to the new column's status
**And** the card animates to the new position

**Given** a user dragging a story
**When** the drop completes
**Then** the change is persisted to the database
**And** other users see the updated status in real-time

**Given** an invalid status transition
**When** the user attempts to drag
**Then** the drop is prevented or a warning is shown
**And** valid transitions are enforced (e.g., can't skip from Refinement directly to Released)

### Story 4.6: Kanban Filtering

As a user,
I want to filter the kanban board by module, feature, or assignee,
So that I can focus on relevant stories. (FR41)

**Acceptance Criteria:**

**Given** a user on the kanban board
**When** the user opens the filter panel
**Then** filter options are displayed: Module, Feature, Assignee

**Given** a user applying filters
**When** the user selects filter values
**Then** the kanban board shows only stories matching all selected filters
**And** story counts per column are recalculated

**Given** a user with active filters
**When** the user clears filters
**Then** all stories are displayed again
**And** filter indicators are removed

### Story 4.7: Kanban Quick Add Story

As a user,
I want to add a new story directly from the kanban board,
So that I can create stories without leaving the board view. (FR42)

**Acceptance Criteria:**

**Given** a user on the kanban board
**When** the user clicks the "+" button on a column header
**Then** a quick-add form appears
**And** the new story is pre-assigned to that column's status

**Given** a user in the quick-add form
**When** the user enters a title and saves
**Then** a new story is created with the column's status
**And** the story card appears in the column immediately

**Given** a user in the quick-add form
**When** the user clicks "Add & Open"
**Then** the story is created and the story detail page opens

## Epic 5: Context & Requirements

**Goal:** Users can capture context (questions, notes, documents) and define acceptance criteria - manually or with AI via FAB/sidebar.

**FRs covered:** FR19-FR26, FR113-FR117, FR118-FR121 (Story pages), FR-new1-FR-new5

**Proposed Stories:**

### Story 5.1: Story Notes & Context Management

As a user,
I want to add notes and documents to a story,
 so that I can capture unstructured information. (FR19, FR-new1)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user navigates to the Context tab
**Then** the Context tab is displayed showing questions and context sources

**And** each question shows a linked answer count

**And** an existing questions can be edited inline

**And** inline editing is supported with markdown preview

**And** questions can be reordered via drag-and-drop

**And** a "Delete question" option is available with confirmation

**And** context sources can be filtered by type (Note, Summary, Technical)

 using the filter bar

**Given** a user viewing the context library
**When** the user searches or filters context
**Then** the list updates based on search criteria
**And** the filter preserves the current tab selection

**Given** a user viewing context details
**When** the user adds a new context item (Note, Summary, Document)
**Then** a modal opens to add a new context item
**And** the new context item appears in the list

### Story 5.2: Story Questions CRUD
 as a user,
I want to create, view, edit, and delete questions on the story,
 so that I can keep questions organized and linked to the story's context.

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user clicks "Add Question"
**Then** a modal opens to create a new question
 **And** the question is linked to the story

**Given** a user creating a question
**When** the user fills in question text and saves
**Then** a new question record is created
**And** the question appears in the story's questions list

**Given** a user viewing questions
**When** the user edits a question
**Then** the question is updated
**And** changes are reflected immediately

**Given** a user viewing questions
**When** the user deletes a question
**Then** the question is removed from the list
**Given** an empty question
**When** the user attempts to delete without questions
**Then** a warning is shown preventing deletion

**And** the delete action is disabled until questions exist

### Story 5.3: Context Source Types
As a user,
I want to manually create and edit context sources for a story,
 so that I can link relevant documents and URLs. (FR-new4)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user adds a new context source
**Then** a modal opens with options for Note, Summary, Document, and URL

**And** the new context source is created and linked to the story

**Given** a user viewing context sources
**When** the user edits a source
**Then** the source is updated
**And** the updated context appears in the list

**Given** a user viewing context sources
**When** the user removes a context source
**Then** the source is unlinked from the story
**And** the context source no longer appears in the list

### Story 5.4: AI Gap Analysis

As a user,
I want to request gap analysis on a story,
so that I can identify missing or ambiguous information. (FR24-FR26)

**Acceptance Criteria:**

**Given** a user viewing a story with acceptance criteria
**When** the user clicks "Analyze Gaps"
**Then** the gap analysis is performed
**And** identified gaps are displayed with suggestions

**Given** a user viewing gap analysis results
**When** the user dismisses a suggestion
**Then** the suggestion is removed from the list
**Given** a user viewing gap suggestions
**When** the user addresses a specific gap
**Then** the addressed gap can be added to the story's acceptance criteria
**Given** a user with acceptance criteria
**When** the user clicks "Regenerate"
**Then** acceptance criteria are regenerated with additional context

**Given** a user with acceptance criteria
**When** the user edits the acceptance criteria
**Then** the acceptance criteria are updated
**And** changes are reflected immediately

**Given** a user viewing acceptance criteria
**When** the user views the gap analysis history
**Then** a history of gap analyses is available in the story's context tab

### Story 5.5: Floating AI FAB for Story Pages

As a user,
I want to access AI assistance via a floating action button on story pages,
 so that I can get contextual help without leaving my work. (FR118-FR121)

**Acceptance Criteria:**

**Given** a user on any story detail page
**When** the page loads
**Then** a floating action button (FAB) is displayed in the bottom-right corner
**And** the FAB displays a pulse animation to indicate availability

**Given** a user viewing the FAB
**When** the user clicks the FAB
**Then** the AI chat sidebar opens from the right side
**And** the sidebar context is set to the current story

**Given** a user with the AI sidebar open
**When** the user clicks the FAB again or presses Escape
**Then** the AI chat sidebar closes

**Given** a user on a story page
**When** the user presses Ctrl+K
**Then** the AI chat sidebar togg open/closed

### Story 5.6: AI Chat Sidebar for Stories
As a user,
I want to interact with an AI chat sidebar that understands story context,
            so that I can ask questions and get AI assistance relevant to the story. (FR79-FR82)

**Acceptance Criteria:**

**Given** a user with the AI sidebar open on an story page
**When** the user types a question and submits
**Then** the AI responds with context-aware answers about the current story
**And** the response includes relevant information from acceptance criteria, modules, features, and linked stories

**Given** a user interacting with the AI sidebar
**When** the AI generates a response
**Then** the response is streamed token-by-token for perceived performance
**And** a typing indicator is shown during generation

**Given** a user on different tabs (Context, Acceptance Criteria, Overview)
**When** the user asks a question
**Then** the AI context includes the current tab's content
**And** responses are tailored to the current view

**Given** a user with the AI sidebar open
**When** an error occurs during AI generation
**Then** a clear error message is displayed
**And** a retry option is available

### Story 5.7: AI Gap Analysis

As a user,
I want to request gap analysis on a story,
so that I can identify missing or ambiguous information. (FR24-FR26)

**Acceptance Criteria:**

**Given** a user viewing a story with acceptance criteria
**When** the user clicks "Analyze Gaps"
**Then** a gap analysis is performed
**And** identified gaps are displayed with suggestions

**Given** a user viewing gap suggestions
**When** the user dismisses a suggestion
**Then** the suggestion is removed from the list
**Given** a user viewing gap suggestions
**When** the user addresses a specific gap
**Then** the gap is added to the story notes or context
**And** the gap analysis can be re-run with additional context

**Given** a user viewing gap results
**When** the user marks gaps as addressed
**Then** the story notes and context are updated accordingly

## Epic 6: Implementation Planning

**Goal:** Users can create structured implementation plans with sections and steps - manually or AI-generated.

**FRs covered:** FR27-FR30, FR-new6-FR-new8

### Story 6.1: Implementation Section CRUD

As a user,
I want to create, edit, and delete implementation sections within a story,
So that I can organize the development plan into logical parts. (FR-new6)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user navigates to the Implementation tab
**Then** a list of implementation sections is displayed

**Given** a user on the Implementation tab
**When** the user clicks "Add Section"
**Then** a new section is created with a default title
**And** the section appears in the list

**Given** a user viewing an implementation section
**When** the user edits the section title or description and saves
**Then** the section is updated
**And** changes are reflected immediately

**Given** a user viewing an implementation section
**When** the user deletes the section
**Then** the section and all its steps are removed
**And** the section no longer appears in the list

### Story 6.2: Implementation Step CRUD

As a user,
I want to create, edit, and delete implementation steps within sections,
So that I can break down the work into actionable tasks. (FR-new7)

**Acceptance Criteria:**

**Given** a user viewing an implementation section
**When** the user clicks "Add Step"
**Then** a new step is created within the section

**Given** a user creating an implementation step
**When** the user fills in step details (title, description, code hints) and saves
**Then** the step is created and linked to the section
**And** the step appears in the section's step list

**Given** a user viewing implementation steps
**When** the user reorders steps via drag-and-drop
**Then** the step order is updated
**And** the new order is persisted

**Given** a user viewing an implementation step
**When** the user edits the step and saves
**Then** the step is updated
**And** changes are reflected immediately

**Given** a user viewing an implementation step
**When** the user deletes the step
**Then** the step is removed from the section

### Story 6.3: Implementation Step Completion

As a user,
I want to mark implementation steps as complete or pending,
So that I can track development progress. (FR-new8)

**Acceptance Criteria:**

**Given** a user viewing implementation steps
**When** the user marks a step as complete
**Then** the step displays a completion indicator (checkmark)
**And** a completion timestamp is recorded

**Given** a user viewing a completed step
**When** the user marks it as pending
**Then** the completion indicator is removed
**And** the completion timestamp is cleared

**Given** a user on the Implementation tab
**When** viewing the section header
**Then** completion progress is displayed (e.g., "3/5 steps complete")

**Given** a user on the story detail page
**When** viewing the implementation summary
**Then** overall completion percentage is displayed

### Story 6.4: AI-Generated Development Plan

As a user,
I want to request an AI-generated development plan from acceptance criteria,
So that I can quickly create structured implementation guidance. (FR27-FR30)

**Acceptance Criteria:**

**Given** a user on a story with acceptance criteria
**When** the user clicks "Generate Development Plan"
**Then** the AI generates a structured implementation plan
**And** the plan includes sections and steps based on acceptance criteria

**Given** a user viewing an AI-generated development plan
**When** the plan is displayed
**Then** each section has a clear title and description
**And** each step includes actionable guidance
**And** steps are ordered logically

**Given** a user viewing an AI-generated development plan
**When** the user edits the plan (sections or steps)
**Then** changes are saved
**And** the plan reflects manual adjustments (FR29)

**Given** a user not satisfied with the generated plan
**When** the user clicks "Regenerate" with additional context
**Then** a new plan is generated incorporating the additional context (FR30)

**Given** an AI generation request
**When** an error occurs
**Then** a clear error message is displayed
**And** a retry option is available

## Epic 7: Quality Assurance

**Goal:** Users can create UAT test steps and automated Playwright scripts - manually or AI-generated.

**FRs covered:** FR31-FR34, FR-new9-FR-new13

### Story 7.1: UAT Test Step CRUD

As a user,
I want to create, edit, and delete UAT test steps,
So that I can define manual test procedures for the story. (FR-new9)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user navigates to the QA tab
**Then** a list of UAT test steps is displayed

**Given** a user on the QA tab
**When** the user clicks "Add Test Step"
**Then** a new test step is created with fields for action and expected result

**Given** a user creating a test step
**When** the user fills in step details (step number, action, expected result) and saves
**Then** the test step is created and linked to the story
**And** the step appears in the test steps list

**Given** a user viewing test steps
**When** the user reorders steps
**Then** the step order is updated

**Given** a user viewing a test step
**When** the user edits the step and saves
**Then** the step is updated
**And** changes are reflected immediately

**Given** a user viewing a test step
**When** the user deletes the step
**Then** the step is removed from the list

### Story 7.2: UAT Step Completion Tracking

As a user,
I want to mark UAT test steps as complete or incomplete,
So that I can track testing progress. (FR-new11, FR-new12)

**Acceptance Criteria:**

**Given** a user viewing UAT test steps
**When** the user marks a step as complete
**Then** the step displays a completion indicator (pass/fail status)
**And** a completion timestamp is recorded

**Given** a user viewing a completed step
**When** the user marks it as incomplete
**Then** the completion indicator is cleared
**And** the timestamp is cleared

**Given** a user on the QA tab
**When** viewing the test steps section
**Then** UAT completion progress is displayed (e.g., "4/6 steps passed") (FR-new12)

**Given** a user on the story detail page
**When** viewing the QA summary
**Then** overall test completion status is displayed

### Story 7.3: AI-Generated UAT Test Steps

As a user,
I want to request AI-generated UAT test steps from acceptance criteria,
So that I can quickly create comprehensive test coverage. (FR-new10)

**Acceptance Criteria:**

**Given** a user on a story with acceptance criteria
**When** the user clicks "Generate UAT Steps"
**Then** the AI generates test steps based on the acceptance criteria

**Given** a user viewing AI-generated test steps
**When** the steps are displayed
**Then** each step has a clear action and expected result
**And** steps cover all acceptance criteria scenarios

**Given** a user viewing AI-generated test steps
**When** the user edits or adds steps
**Then** manual changes are preserved

**Given** an AI generation error
**When** the error occurs
**Then** a clear error message is displayed
**And** a retry option is available

### Story 7.4: Automated Test Script CRUD

As a user,
I want to manually create and edit automated test scripts,
So that I can define Playwright-compatible tests for the story. (FR-new13)

**Acceptance Criteria:**

**Given** a user on the QA tab
**When** the user navigates to the Automated Tests section
**Then** a list of automated test scripts is displayed

**Given** a user on the Automated Tests section
**When** the user clicks "Add Script"
**Then** a code editor opens for creating a new test script

**Given** a user creating a test script
**When** the user writes or pastes Playwright-compatible code and saves
**Then** the script is saved and linked to the story

**Given** a user viewing a test script
**When** the user edits the script and saves
**Then** the script is updated

**Given** a user viewing a test script
**When** the user deletes the script
**Then** the script is removed from the list

### Story 7.5: AI-Generated Test Scripts

As a user,
I want to request AI-generated test scripts from the story and acceptance criteria,
So that I can quickly create automated browser tests. (FR31-FR34)

**Acceptance Criteria:**

**Given** a user on a story with acceptance criteria
**When** the user clicks "Generate Test Script"
**Then** the AI generates a Playwright-compatible test script (FR31, FR32)

**Given** a user viewing an AI-generated test script
**When** the script is displayed
**Then** the script follows Playwright best practices
**And** the script covers the acceptance criteria scenarios

**Given** a user viewing an AI-generated test script
**When** the user edits the script
**Then** changes are saved (FR33)

**Given** a user viewing a test script
**When** the user clicks "Copy to Clipboard"
**Then** the script is copied for local execution (FR34)
**And** a success message confirms the copy action

**Given** an AI generation error
**When** the error occurs
**Then** a clear error message is displayed
**And** a retry option is available

## Epic 8: Deployment & Activity

**Goal:** Users can track releases, deployment status, and manage story activity/comments with AI assistance.

**FRs covered:** FR-new14-FR-new22

### Story 8.1: Release Information Management

As a user,
I want to set and edit release information for a story,
So that I can track when and where the story was released. (FR-new14)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user navigates to the Deployment tab
**Then** release information fields are displayed

**Given** a user on the Deployment tab
**When** the user sets release date and version and saves
**Then** the release information is stored
**And** the information is displayed in the Deployment tab

**Given** a user viewing release information
**When** the user edits the release date or version and saves
**Then** the release information is updated

### Story 8.2: Release Task Management

As a user,
I want to create and manage release tasks,
So that I can track pre-deployment and post-deployment activities. (FR-new15, FR-new18)

**Acceptance Criteria:**

**Given** a user on the Deployment tab
**When** the user clicks "Add Release Task"
**Then** a new task is created with title and description fields

**Given** a user creating a release task
**When** the user fills in task details and saves
**Then** the task is created and linked to the story

**Given** a user viewing release tasks
**When** the user marks a task as complete
**Then** the task displays a completion indicator (FR-new18)
**And** a completion timestamp is recorded

**Given** a user viewing a completed task
**When** the user marks it as incomplete
**Then** the completion indicator is cleared

**Given** a user viewing a release task
**When** the user edits or deletes the task
**Then** changes are applied accordingly

### Story 8.3: Environment & Deployment Status

As a user,
I want to add environments and track deployment status,
So that I can monitor where the story has been deployed. (FR-new16)

**Acceptance Criteria:**

**Given** a user on the Deployment tab
**When** the user views the Environments section
**Then** a list of environments is displayed (Dev, Test, Acc, Prod)

**Given** a user managing environments
**When** the user adds an environment with name and URL
**Then** the environment is created and linked to the story

**Given** a user viewing environments
**When** the user sets deployment status for an environment (Not Deployed, Deployed, Failed)
**Then** the status is saved and displayed with a color indicator

**Given** a user viewing an environment
**When** the user edits or removes the environment
**Then** changes are applied accordingly

### Story 8.4: AI Deployment Readiness Assessment

As a user,
I want to request an AI deployment readiness assessment,
So that I can verify all prerequisites are met before release. (FR-new17)

**Acceptance Criteria:**

**Given** a user on the Deployment tab
**When** the user clicks "Assess Readiness"
**Then** the AI analyzes the story for deployment readiness

**Given** an AI readiness assessment
**When** the assessment completes
**Then** a checklist of readiness criteria is displayed
**And** each criterion shows pass/fail status (e.g., "Acceptance criteria defined", "Tests passing", "Documentation complete")

**Given** a user viewing readiness results
**When** items are not ready
**Then** specific recommendations are provided to address gaps

**Given** an AI assessment error
**When** the error occurs
**Then** a clear error message is displayed
**And** a retry option is available

### Story 8.5: Story Comments CRUD

As a user,
I want to add, edit, and delete comments on a story,
So that I can discuss the story with team members. (FR-new19)

**Acceptance Criteria:**

**Given** a user on a story detail page
**When** the user navigates to the Activity tab
**Then** a list of comments is displayed in chronological order

**Given** a user on the Activity tab
**When** the user types a comment and submits
**Then** the comment is created and linked to the story
**And** the comment appears in the activity list

**Given** a user viewing their own comment
**When** the user edits the comment and saves
**Then** the comment is updated
**And** an "edited" indicator is shown

**Given** a user viewing their own comment
**When** the user deletes the comment
**Then** the comment is removed
**And** a deletion placeholder may be shown

### Story 8.6: Threaded Comment Replies

As a user,
I want to reply to comments in threads,
So that discussions can be organized by topic. (FR-new20)

**Acceptance Criteria:**

**Given** a user viewing a comment
**When** the user clicks "Reply"
**Then** a reply input appears under the comment

**Given** a user replying to a comment
**When** the user submits the reply
**Then** the reply is created as a child of the parent comment
**And** the reply appears indented under the parent

**Given** a user viewing a comment with replies
**When** the thread expands
**Then** all replies are visible in chronological order

**Given** a user viewing a threaded discussion
**When** replies exceed a threshold
**Then** a "Show more replies" option is available

### Story 8.7: @Mentions in Comments

As a user,
I want to @mention team members in comments,
So that I can notify specific people about relevant discussions. (FR-new21)

**Acceptance Criteria:**

**Given** a user writing a comment
**When** the user types "@"
**Then** a dropdown appears with team member suggestions

**Given** a user viewing the mention dropdown
**When** the user selects a team member
**Then** the mention is inserted into the comment
**And** the mentioned user receives a notification

**Given** a user viewing a comment with @mentions
**When** the comment renders
**Then** mentioned users are highlighted with a distinct style

### Story 8.8: AI Discussion Summary

As a user,
I want to request an AI summary of discussion and action items,
So that I can quickly understand the conversation outcomes. (FR-new22)

**Acceptance Criteria:**

**Given** a user on the Activity tab with existing comments
**When** the user clicks "Summarize Discussion"
**Then** the AI generates a summary of the discussion

**Given** an AI-generated summary
**When** the summary is displayed
**Then** key points are listed
**And** action items are extracted and highlighted
**And** mentioned decisions are summarized

**Given** a user viewing the summary
**When** the user clicks "Copy Action Items"
**Then** action items are copied to clipboard

**Given** an AI summary error
**When** the error occurs
**Then** a clear error message is displayed
**And** a retry option is available

## Epic 9: Monitoring & Operations

**Goal:** Users can view live logs, monitor test coverage, track environment status, and monitor system health.

**FRs covered:** FR69-FR78

### Story 9.1: Live Log Streaming

As a user,
I want to view live application logs in real-time,
So that I can monitor application behavior as it happens. (FR75)

**Acceptance Criteria:**

**Given** a user on the app Metrics/Logs tab
**When** the user navigates to the Logs section
**Then** recent log entries are displayed in chronological order

**Given** a user viewing logs
**When** the user enables "Live Mode"
**Then** logs are streamed in real-time via Server-Sent Events
**And** new log entries appear automatically at the top

**Given** a user in live log mode
**When** new logs arrive
**Then** entries are visually distinguished as new (e.g., highlight animation)

**Given** a user in live log mode
**When** the user disables live mode
**Then** streaming stops and the current log view is preserved

### Story 9.2: Log Filtering by Level

As a user,
I want to filter logs by severity level,
So that I can focus on relevant log entries. (FR76)

**Acceptance Criteria:**

**Given** a user viewing logs
**When** the user opens the filter dropdown
**Then** filter options are displayed: All, Info, Warning, Error

**Given** a user applying a level filter
**When** the user selects a specific level (e.g., Error)
**Then** only logs matching that level are displayed

**Given** a user with an active filter
**When** new logs stream in live mode
**Then** only logs matching the filter are displayed

**Given** a user viewing filtered logs
**When** the user clears the filter
**Then** all logs are displayed again

### Story 9.3: Log Pause and Resume

As a user,
I want to pause and resume the log stream,
So that I can examine specific log entries without missing any. (FR77)

**Acceptance Criteria:**

**Given** a user in live log mode
**When** the user clicks "Pause"
**Then** streaming pauses
**And** the current log view is frozen
**And** a pause indicator is displayed

**Given** a user with paused logs
**When** the user clicks "Resume"
**Then** streaming continues
**And** logs that arrived during pause may be shown or buffered

**Given** a user with paused logs in live mode
**When** new logs arrive while paused
**Then** a count of missed logs is displayed
**And** the user can choose to load them on resume

### Story 9.4: Log Entry Display

As a user,
I want to see timestamps and severity badges on log entries,
So that I can quickly identify when and how important each entry is. (FR78)

**Acceptance Criteria:**

**Given** a user viewing logs
**When** a log entry is displayed
**Then** the timestamp is shown in a readable format (ISO 8601 or localized)

**Given** a user viewing logs
**When** a log entry is displayed
**Then** a severity badge is shown with color coding:
- Info: Blue/neutral
- Warning: Yellow/orange
- Error: Red

**Given** a user viewing a log entry
**When** the user hovers over the timestamp
**Then** the full ISO 8601 timestamp is displayed

### Story 9.5: App Test Coverage Overview

As a user,
I want to view overall test coverage percentage per app,
So that I can understand testing health at a glance. (FR59)

**Acceptance Criteria:**

**Given** a user on an app detail page
**When** the user navigates to the Test Coverage tab
**Then** an overall test coverage percentage is displayed prominently

**Given** a user viewing test coverage
**When** the coverage percentage is calculated
**Then** it reflects the ratio of tested features/modules to total

**Given** a user viewing test coverage
**When** coverage is below a threshold
**Then** a visual warning indicator is displayed

### Story 9.6: Test Suites by Module

As a user,
I want to view test suites organized by module,
So that I can see coverage breakdown per functional area. (FR60)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** the test suites section loads
**Then** test suites are grouped by module

**Given** a user viewing test suites by module
**When** the user expands a module
**Then** individual test suites within that module are displayed

**Given** a user viewing a test suite
**When** the suite details are shown
**Then** test count and pass/fail status are displayed

### Story 9.7: Test Execution

As a user,
I want to run all tests or module-specific test suites,
So that I can verify functionality on demand. (FR61)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** the user clicks "Run All Tests"
**Then** all test suites are queued for execution
**And** a progress indicator is shown

**Given** a user viewing a specific module
**When** the user clicks "Run Module Tests"
**Then** only tests for that module are executed

**Given** a test execution in progress
**When** tests complete
**Then** results are displayed with pass/fail counts
**And** the coverage percentage is updated

### Story 9.8: Test Results Display

As a user,
I want to view test results (passed/failed/pending) per module,
So that I can identify problematic areas. (FR62)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** test results are available
**Then** each module displays pass/fail/pending counts

**Given** a user viewing test results
**When** a test has failed
**Then** the failure is highlighted with red indicator
**And** error details are accessible via click

**Given** a user viewing a pending test
**When** the test status is pending
**Then** a pending indicator is shown

### Story 9.9: Coverage Health Indicators

As a user,
I want to see coverage health indicators (Excellent, Good, Critical),
So that I can quickly assess testing status. (FR63)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** the coverage percentage is displayed
**Then** a health indicator badge is shown:
- Excellent (≥80%): Green
- Good (50-79%): Yellow
- Critical (<50%): Red

**Given** a user viewing a health indicator
**When** the user hovers over the badge
**Then** a tooltip explains the threshold criteria

### Story 9.10: Coverage Trends

As a user,
I want to view coverage trends (increasing/decreasing/stable),
So that I can understand if testing is improving over time. (FR64)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** historical coverage data exists
**Then** a trend indicator is displayed

**Given** a user viewing coverage trends
**When** comparing current to previous period
**Then** the trend shows:
- Increasing: Up arrow, green
- Decreasing: Down arrow, red
- Stable: Flat line, neutral

**Given** a user viewing the trend
**When** the user clicks the trend indicator
**Then** a mini chart showing coverage history is displayed

### Story 9.11: Coverage Report Export

As a user,
I want to export coverage reports,
So that I can share testing status with stakeholders. (FR65)

**Acceptance Criteria:**

**Given** a user on the Test Coverage tab
**When** the user clicks "Export Report"
**Then** export format options are displayed (PDF, CSV)

**Given** a user exporting to PDF
**When** the export completes
**Then** a PDF file is downloaded with coverage summary and details

**Given** a user exporting to CSV
**When** the export completes
**Then** a CSV file is downloaded with module/test data

### Story 9.12: Workflow Status & History

As a user,
I want to view workflow status and execution history,
So that I can track process completion. (FR66-FR68)

**Acceptance Criteria:**

**Given** a user on an app or project Workflows tab
**When** the workflows list loads
**Then** each workflow displays current status (Running, Completed, Failed, Pending)

**Given** a user viewing workflows
**When** the user clicks on a workflow
**Then** execution history is displayed with timestamps

**Given** a user viewing workflow history
**When** historical executions are shown
**Then** each execution displays start time, end time, and status
