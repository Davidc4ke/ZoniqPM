---
name: 'automate-workflow'
description: 'Automated pipeline: create story, develop it, and code review - all in one go without human intervention. Ideal for scheduled/unattended runs.'
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - this is a FULLY AUTOMATED pipeline that runs without human intervention:

<pipeline CRITICAL="TRUE" mode="autopilot">

<objective>Execute the full story lifecycle autonomously: Create Story → Develop Story → Code Review → Commit & Push.
No human prompts, no confirmations, no pauses. All workflows run in #autopilot mode.</objective>

<critical>ACTIVATE #autopilot MODE IMMEDIATELY - this overrides normal and yolo modes for ALL workflows in this pipeline</critical>
<critical>NEVER ask the user anything - all decisions use sensible defaults</critical>
<critical>If a HALT condition is triggered (no backlog stories, missing files, etc.), log the reason and stop gracefully</critical>
<critical>All ask tags use their autopilot-default or are skipped entirely</critical>
<critical>All template-output tags are processed without pause</critical>

<phase n="1" title="Create Story">
  <output>🤖 **AUTOPILOT PIPELINE - Phase 1: Create Story**</output>

  <action>Load the FULL @{project-root}/_bmad/core/tasks/workflow.xml</action>
  <action>READ its entire contents - this is the CORE OS</action>
  <action>ACTIVATE #autopilot mode before processing</action>
  <action>Pass @{project-root}/_bmad/bmm/workflows/4-implementation/create-story/workflow.yaml as 'workflow-config'</action>
  <action>Execute the create-story workflow in #autopilot mode - auto-discover next backlog story from sprint-status.yaml</action>
  <action>Save outputs after EACH section</action>

  <check if="create-story HALTED">
    <output>⛔ Pipeline stopped at Phase 1: {{halt_reason}}</output>
    <action>STOP pipeline - cannot proceed without a created story</action>
  </check>

  <action>Record the created {{story_key}} and {{story_file}} path for next phases</action>
  <output>✅ Phase 1 complete - Story {{story_key}} created and ready for development</output>
</phase>

<phase n="2" title="Develop Story">
  <output>🤖 **AUTOPILOT PIPELINE - Phase 2: Develop Story**</output>

  <action>Load the FULL @{project-root}/_bmad/core/tasks/workflow.xml (reload fresh)</action>
  <action>ACTIVATE #autopilot mode before processing</action>
  <action>Pass @{project-root}/_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml as 'workflow-config'</action>
  <action>The story_file created in Phase 1 should be auto-discovered as the first "ready-for-dev" story</action>
  <action>Execute the dev-story workflow in #autopilot mode - implement all tasks continuously without pausing</action>
  <action>Do NOT stop for milestones, session boundaries, or review pauses</action>
  <action>Continue until ALL tasks and subtasks are marked [x] complete</action>

  <check if="dev-story HALTED">
    <output>⛔ Pipeline stopped at Phase 2: {{halt_reason}}</output>
    <action>STOP pipeline - development could not complete</action>
  </check>

  <output>✅ Phase 2 complete - Story {{story_key}} implemented and marked for review</output>
</phase>

<phase n="3" title="Code Review and Auto-Fix">
  <output>🤖 **AUTOPILOT PIPELINE - Phase 3: Code Review**</output>

  <action>Load the FULL @{project-root}/_bmad/core/tasks/workflow.xml (reload fresh)</action>
  <action>ACTIVATE #autopilot mode before processing</action>
  <action>Pass @{project-root}/_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml as 'workflow-config'</action>
  <action>The story should be auto-discovered from sprint-status as the first story in "review" status</action>
  <action>Execute the code-review workflow in #autopilot mode</action>
  <action>When findings are presented, AUTO-SELECT option 1: Fix all issues automatically</action>
  <action>After fixes, the review workflow will update story status to "done" if all issues resolved</action>

  <check if="code-review sets status to in-progress (issues remain)">
    <output>⚠️ Code review found issues that could not be auto-fixed. Story returned to in-progress.</output>
    <action>Log remaining issues for manual review</action>
  </check>

  <output>✅ Phase 3 complete - Code review finished for {{story_key}}</output>
</phase>

<phase n="4" title="Commit and Push">
  <output>🤖 **AUTOPILOT PIPELINE - Phase 4: Commit & Push**</output>

  <action>Run git status to see all changes</action>
  <action>Stage all relevant files (exclude .env, credentials, secrets)</action>
  <action>Create a commit with message: "feat({{story_key}}): automated story implementation - create, develop, review pipeline"</action>
  <action>Push to current branch with: git push -u origin HEAD</action>

  <output>✅ Phase 4 complete - Changes committed and pushed</output>
</phase>

<completion>
  <output>🤖 **AUTOPILOT PIPELINE COMPLETE**

    **Summary:**
    - Story: {{story_key}}
    - Status: {{final_status}}
    - Phases completed: Create → Develop → Review → Commit

    Pipeline finished autonomously without human intervention.
  </output>
</completion>

</pipeline>
