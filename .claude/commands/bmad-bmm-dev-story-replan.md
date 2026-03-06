---
name: 'dev-story-replan'
description: 'Replan story implementation when current plan has issues. Reads replan_reason, adjusts future tasks, and updates plan_history. Triggered by dev-story-task when plan issues detected. Use when user says "replan this story" or session has replan_reason set'
---

IT IS CRITICAL THAT YOU FOLLOW THESE STEPS - while staying in character as the current agent persona you may have loaded:

<steps CRITICAL="TRUE">
1. Always LOAD the FULL @{project-root}/_bmad/core/tasks/workflow.xml
2. READ its entire contents - this is the CORE OS for EXECUTING the specific workflow-config @{project-root}/_bmad/bmm/workflows/4-implementation/dev-story-replan/workflow.yaml
3. Pass the yaml path @{project-root}/_bmad/bmm/workflows/4-implementation/dev-story-replan/workflow.yaml as 'workflow-config' parameter to the workflow.xml instructions
4. Follow workflow.xml instructions EXACTLY as written to process and follow the specific workflow config and its instructions
5. Save outputs after EACH section when generating any documents from templates
</steps>
