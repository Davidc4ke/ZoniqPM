#!/usr/bin/env pwsh
# ZoniqPM - Import epics/stories into beads
# Run from project root: .\scripts\beads-import.ps1

function Add-Story {
    param([string]$Title, [switch]$Done)
    $output = bd create $Title -p 0 2>&1
    $id = ($output | Select-String 'bd-[a-z0-9]+').Matches.Value | Select-Object -First 1
    if ($Done -and $id) {
        bd close $id "Completed in initial build" | Out-Null
    }
    Write-Host "$( if ($Done) { '[done]' } else { '[open]' } ) $Title $(if ($id) { "($id)" })"
}

Write-Host "`n==> Importing ZoniqPM stories into beads...`n"

# ── Epic 1: Foundation & Authentication (all done) ──────────────────────────
Write-Host "`n[Epic 1] Foundation & Authentication"
Add-Story "1.1: Initialize Next.js Project with Tech Stack" -Done
Add-Story "1.2: Configure Clerk Authentication" -Done
Add-Story "1.3: Implement User Login" -Done
Add-Story "1.4: Implement User Logout" -Done
Add-Story "1.5: Admin User Management - Create Users" -Done
Add-Story "1.6: Admin User Management - Assign Roles" -Done
Add-Story "1.7: Admin User Management - Deactivate Users" -Done
Add-Story "1.8: User Profile View" -Done

# ── Epic 2: Customer & App Management (core done, AI features pending) ───────
Write-Host "`n[Epic 2] Customer & App Management"
Add-Story "2.0: Home Page Dashboard Layout" -Done
Add-Story "2.0.1: Universal AI Input Field" -Done
Add-Story "2.0.2: Dashboard Widgets" -Done
Add-Story "2.1: Customer CRUD Operations" -Done
Add-Story "2.2: App CRUD Operations" -Done
Add-Story "2.3: App Detail Overview Tab" -Done
Add-Story "2.4: App Environments Management" -Done
Add-Story "2.5: Module CRUD Operations" -Done
Add-Story "2.6: Feature CRUD Operations" -Done
Add-Story "2.7: App Test Coverage Tab" -Done
Add-Story "2.8: App Workflows Tab"
Add-Story "2.9: App Context Tab"
Add-Story "2.10: App Projects Tab"
Add-Story "2.11: App Metrics & Logs Tab"
Add-Story "2.12: Floating AI FAB for App Pages" -Done
Add-Story "2.13: AI Chat Sidebar for Apps" -Done
Add-Story "2.14: AI-Generated Modules for Apps"
Add-Story "2.15: AI-Generated Features for App Modules"
Add-Story "2.16: AI-Generated Context for Apps"

# ── Epic 3: Project Management ────────────────────────────────────────────────
Write-Host "`n[Epic 3] Project Management"
Add-Story "3.1: Project CRUD Operations"
Add-Story "3.2: Project Overview Tab"
Add-Story "3.3: Project Module & Feature Selection"
Add-Story "3.4: Project Coverage Status"
Add-Story "3.5: Project Workflows Tab"
Add-Story "3.6: Project Context Tab"
Add-Story "3.7: Floating AI FAB for Project Pages"
Add-Story "3.8: AI Chat Sidebar for Projects"
Add-Story "3.9: AI-Generated Modules for Projects"
Add-Story "3.10: AI-Generated Features for Project Modules"
Add-Story "3.11: AI-Generated Workflow Steps"
Add-Story "3.12: AI-Generated Context for Projects"
Add-Story "3.13: AI-Suggested Questions for Projects"
Add-Story "3.14: Archive Projects"
Add-Story "3.15: View Accessible Projects"
Add-Story "3.16: Assign Consultants to Projects"

# ── Epic 4: Story Management ──────────────────────────────────────────────────
Write-Host "`n[Epic 4] Story Management"
Add-Story "4.1: Story CRUD Operations"
Add-Story "4.2: Story Notes & Attachments"
Add-Story "4.3: Story Status Management"
Add-Story "4.4: Kanban Board View"
Add-Story "4.5: Kanban Drag-and-Drop"
Add-Story "4.6: Kanban Filtering"
Add-Story "4.7: Kanban Quick Add Story"

# ── Epic 5: Context & Requirements ───────────────────────────────────────────
Write-Host "`n[Epic 5] Context & Requirements"
Add-Story "5.1: Story Notes & Context Management"
Add-Story "5.2: Story Questions CRUD"
Add-Story "5.3: Context Source Types"
Add-Story "5.4: AI Gap Analysis"
Add-Story "5.5: Floating AI FAB for Story Pages"
Add-Story "5.6: AI Chat Sidebar for Stories"
Add-Story "5.7: AI Gap Analysis (Extended)"

# ── Epic 6: Implementation Planning ──────────────────────────────────────────
Write-Host "`n[Epic 6] Implementation Planning"
Add-Story "6.1: Implementation Section CRUD"
Add-Story "6.2: Implementation Step CRUD"
Add-Story "6.3: Implementation Step Completion"
Add-Story "6.4: AI-Generated Development Plan"

# ── Epic 7: Quality Assurance ─────────────────────────────────────────────────
Write-Host "`n[Epic 7] Quality Assurance"
Add-Story "7.1: UAT Test Step CRUD"
Add-Story "7.2: UAT Step Completion Tracking"
Add-Story "7.3: AI-Generated UAT Test Steps"
Add-Story "7.4: Automated Test Script CRUD"
Add-Story "7.5: AI-Generated Test Scripts"

# ── Epic 8: Deployment & Activity ────────────────────────────────────────────
Write-Host "`n[Epic 8] Deployment & Activity"
Add-Story "8.1: Release Information Management"
Add-Story "8.2: Release Task Management"
Add-Story "8.3: Environment & Deployment Status"
Add-Story "8.4: AI Deployment Readiness Assessment"
Add-Story "8.5: Story Comments CRUD"
Add-Story "8.6: Threaded Comment Replies"
Add-Story "8.7: @Mentions in Comments"
Add-Story "8.8: AI Discussion Summary"

# ── Epic 9: Monitoring & Operations ──────────────────────────────────────────
Write-Host "`n[Epic 9] Monitoring & Operations"
Add-Story "9.1: Live Log Streaming"
Add-Story "9.2: Log Filtering by Level"
Add-Story "9.3: Log Pause and Resume"
Add-Story "9.4: Log Entry Display"
Add-Story "9.5: App Test Coverage Overview"
Add-Story "9.6: Test Suites by Module"
Add-Story "9.7: Test Execution"
Add-Story "9.8: Test Results Display"
Add-Story "9.9: Coverage Health Indicators"
Add-Story "9.10: Coverage Trends"
Add-Story "9.11: Coverage Report Export"
Add-Story "9.12: Workflow Status & History"

Write-Host "`n==> Done! Run 'bd ready' to see what's next.`n"
