---
description: Document changes to the repo
---

Document the changes to this repo using the git diff against main.

`git diff main...HEAD`

Don't worry about any other branches. Just compare the current branch to main. Unless the user specifically tells you to compare against another branch.

Analyse the files one-by-one, understand what they do and then document them in their relevant .md files.

Add any learnings to the `## Patterns & Learnings` section of the relevant catalog doc. The per-folder AGENTS.md files are for conventions only.

Here are the documentation files:
components: app/components/COMPONENTS.md
stores: app/stores/STORES.md
composables: app/composables/COMPOSABLES.md
pages: app/pages/PAGES.md
server endpoints: server/SERVER_ENDPOINTS.md
server utils: server/utils/SERVER_UTILS.md
types: shared/types/TYPES.md
