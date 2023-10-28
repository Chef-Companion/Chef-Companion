# Chef Companion Coding Standards
This document will contain our agreed upon coding standards for development.

## Issues
All contributions must begin with a GitHub Issue, and be tracked on the [Project Board](https://github.com/orgs/Chef-Companion/projects/2/views/1), as well as the [Issue Page](https://github.com/Chef-Companion/Chef-Companion/issues) of the repository. Once an issue exists, a branch can be created to begin development. Every branch must be linked to an issue.

Every issue has the following fields:
- Title & Description
- Assignee
- Labels
- Milestone
- Status
- Linked Pull Requests
- Repository
- Sprint

Descriptions of these fields are below:

### Title & Description
Every issue will have a concise title describing the work, along with a more detailed explanation in the description.

### Assignee
When a developer picks up and works on an issue, they will assign it to themselves, the assignee.

### Labels
Each issue will be categorized with none or more labels indicating the nature of the issue (ex. Documentation, Bug, Front-End, etc.)

### Milestone
The Milestone will be Interim Release, Beta Release, or Final Release, depending on the release with which the issue should be associated.

### Status
There are 5 status labels on our project board which issues can have, which are, described below:

1. **To Do:** This label is for issues which are waiting to be worked on.
2. **In Progress:** This label is for issues currently in progress. Each developer should have very few issues in progress as possible, only taking on extra issues when blocked.
3. **Review:** This label is for issues which are in pull requests, and waiting to be reviewed and merged by other team members.
4. **Verify:** This label is for issues which have either been merged, or do not require a merge, but are still not ready to be classified as Done for some reason, such as needing full team review or discussion.
5. **Done:** This label is for issues which are complete, and will not need to be discussed or worked on further.

### Linked Pulled Requests
Once the developer is ready to put up a pull request, this will contain a link for other developers to review the pull request.

### Repository
As of now, all issues should be in the main [Chef-Companion Repository](https://github.com/Chef-Companion/Chef-Companion). If more repositories are included in the project, this section will be updated.

### Sprint
Each issue will be assigned to a sprint. This is a fluid label, and if issues need to be carried over to the next sprint, this is not a major concern as long as progress is being made.

## Branching & Pull Requests
Once an issue is created, a branch can be created for the issue. The developer will complete the task described in the issue title and description, then put up a pull request. Each pull request will require two approvals to merge into the ```main``` branch.

Some general rules for branching are as follows:
- Never commit directly to ```main```. Instead, create an issue, create a branch linked to the issue, and put up a pull request to merge to main.
- When merging a branch into ```main```, use the ```rebase merge``` option to preserve linear commit history, and avoid extra unnecessary merge commits.
- To avoid merge conflicts, rebase branches on ```main``` often, especially before merging into ```main```. In the case of conflicts, merge ```main``` into the issue branch, but always prefer rebasing the issue branch off of ```main```.
- If multiple developers are working on a branch together, they should make branches off of that branch, and deicde whether they should use pull requests, or commit directly to their shared branch.

Avoid letting issues in review carry over from one sprint to the next. Issues currently in progress should not be a problem, but code should ideally not be blocked on review for more than 24 hours.

## Testing
Unit testing is expected for most code. If it is unit testable, it should be unit tested. Unit tests will be automatically ran on pull requests, but it is a good idea to run tests before submitting a pull request.

Further testing protocols will be documented here as they are added.

## Bugs
Bugs will have the following lifecycle:
1. **Identification:** When bugs are identified, an issue will br created with the "bug" label.
2. **Reproduction:** A test which reproduces the error and exposes the bug will be added to the test suite.
3. **Fix:** The developer will fix the bug, put up a pull request, and merge the fix into the correct branch.

## Actions
Automated Builds and tests will be run for both pull requests and pushes to ```main```, using [GitHub Actions](https://github.com/Chef-Companion/Chef-Companion/actions).

Each Action is described below:

- **Docker Image CI:** This action builds the Docker Image, and will fail if unable to create the image. This ensures that all code changes to ```main``` will successfully result in a build, avoiding many problems.
- **Unit Tests:** This action runs our unit tests, and will fail if any unit tests fail. A failed unit test indicates a failure to include promised functionality, or a regression which breaks previous functionality.
- **Code Linting & Format:** This action ensures that the code follows the agreed upon coding format standards to help with readability and maintainability.

## Lifecycle of an Issue

### Code Issues

All code contributions must be done through the use of [GitHub Issues](https://github.com/Chef-Companion/Chef-Companion/issues). All fields of an issue must be filled out with the most accurate information. All issues will start with the "To Do" status.

When a developer picks up an issue to complete, they will assign it to themselves, and assign it the "In Progress" status label. They will create a branch for the issue, using the naming convention automatically specified by GitHub (ex. ```1-document-coding-standards```). All development of this issue will occur in this branch.

If multiple developers need to work together on the same issue, they will create branches off of the initial issue branch. The procedure for merging here is unspecified, and the developers involved will decide together whether to have pull requests or not, depending on the type of issue being worked on. Regardless, there will be a pull request when merging back into ```main```.

Developers are encouraged to perform building, unit testing, code linting, and general use testing on their own before pushing. [GitHub Actions](https://github.com/Chef-Companion/Chef-Companion/actions) will help enforce this, automatically running checks on all pull requests to ```main```. Pull requests will not be accepted until all actions pass.

Once a developer puts up a Pull Request to ```main```, the issue will be transitioned to the "Review" status label. Two other developers must review and approve the changes to merge them into ```main```.

Once merged, if further discussion is required, the issue will be moved to "Verify". Otherwise, the issue can be moved to "Done".

### Non-Code Issues

Issues which are related to tasks outside the scope of the repository have a slightly different lifecycle. They follow the "To Do" and "In Progress" stages similarly, however **there is no "Review" phase for these issues**. 

The "Review" label is to be used exclusively for pull request reviews. This is to help developers prioritize code review to prevent pushes to ```main``` from falling behind. Non-Code Issues will instead skip to the "Verify" label. Until all team members agree that this issue is "Done", the issue will stay in "Verify".

Once the development team agrees the issue is complete, the issue can be moved to "Done".

## Developer Communication

### Discord
All general communication will occur on Discord. There are several channels with different purposes:
- **#chef**: This channel is to be used for communication with the team we are performing a code review on.
- **#companion**: This channel is to be used for most general communication within the team
- **#docs**: This channel is for posting requirements for assignments, as well as shared document links for quick reference and convenience.
- **#daily-checkin**: This channel is for posting daily status messages, replacing daily standup meetings. Each message follows the format of answering three questions:
  - What have I done since last checkin?
  - What do I plan to do before the next checkin?
  - What am I blocked on?
- **#submissions**: This channel is for ensuring all submissions are in on time. Messages will include due dates, or confirming that a team member has submitted a deliverable

### Meetings
We have established a weekly Sprint schedule to ensure consistent progress of the project. The schedule is oulined below:

- Tuesday, 8:00pm - Sprint Begins
- Wednesday, 11:00am - Group meeting with TA
- Thursday, 6:00pm - Class
- Monday, 6:00pm - Class
- Tuesday, 7:30pm - Group Meeting

During our weekly Group Meeting, we begin by reviewing the previous sprint and completing our status report. We close out the sprint, and perform a retrospective, before establishing goals for and starting the next sprint. We present our status report the next morning to for the TA.