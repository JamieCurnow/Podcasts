This is the components directory.
It includes all of the vue components in this Nuxt4 project.

When making a new component it should live here.
Components should be named in PascalCase and be placed in the appropriate directory.

The directory name will end up prefixing the component name.
For example, if you have a component named `AgentList.vue` in the `Chat` directory, it will be registered as `ChatAgentList` and used as `<ChatAgentList />`.

There is a COMPONENTS.md file in this directory that documents all of the components in this directory.

- If you add a new component, it must be documented in the COMPONENTS.md file.
- If you remove a component, it must be removed from the COMPONENTS.md file.
- If you update a component, it must be updated in the COMPONENTS.md file.

This file is AGENTS.md

Whenever you make a change to the components in this app, or if you learn something about components that is worth preserving, you should update the `## Patterns & Learnings` section in `COMPONENTS.md`.
