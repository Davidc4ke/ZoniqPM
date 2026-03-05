
# Tasks at hand
- Update sprintr yaml, to remove story 1.5
- user profile view already handled by clerk no? So why story 1.9? Can you check if 1.9 is still needed or not? Am i missing something?

# Zoniq app improvements
- Have epics in the project management
	- Can be a tab called Planning
	- Planning has a list of epics with the stories
	- Can still keep the modules and features functionality to see which features are relevant?
- Auto generate questions to humans during story creation. Answering these questions could make the story better
- Separate automatic review and manual review tasks
- Agent management
- Issue tracker on ticket level


# BMAD Improvements 
- No clear user actions after a story has been completed. It is sometimes mentioned in the story, but you are not prompted to work on the manual actions after a story has been completed
- On a similar note, no UAT testing
- Manual story creation > implementation > Testing plans > Testing (move back to implementation stage if problems arise + update story if needed)  > reviewing (move back to implementation stage if problems arise + update story if needed )
- At the end of the story, determine if the loop should stop 
- BMAD should create XML/JSON so the output is readable by a user interface
- Sometimes easy to change code outside of agent scopes. Especially when 
- Keep track how many times a review took place
- Too much documents to track features. PRC and Epics both track stories. If i want to change stories, it seems like i need to change both. Creates risk of these files having differences between them and causing context for AI to be ambiguous  
- Create skill to extract all user actions

# Local tool idea
- Feels a bit like studio pro. A local session of your development
- Should show git status, commits
- Should show UAT for user to follow
- Should show release/user actions

# To dos

- 
- Set the clerk credentials in the deployment server
- Create admin in clerk dashboard
  Option A: Clerk Dashboard (Recommended for bootstrap)
  1. Go to https://dashboard.clerk.com
  2. Navigate to your application → Users
  3. Click "Create User"
  4. Create your first admin user manually
  5. Set role metadata to admin in the user's metadata
- Disable public signup in clerk
	- Disable public signup, keep admin-only creation
	  - In Clerk Dashboard → Email/Phone/Auth → Sign-up, disable public signups
	  - This enforces FR3 (admin-only user creation)