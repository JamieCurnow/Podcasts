---
trigger: always_on
---

# Pages |

All pages are created in the /app/pages dir. Nuxt 4 uses page dir structure for routes. Dynamic routes are managed with square brackets in the file name like [uid].vue.

When making a page, think carefully about the structure and layout.
Use flex where possible.

Make use of the <Page> and <Layout> components - they should be used for most pages - they give padding and layout to the page. Use like:

```vue
<template>
  <Page>
    <Layout> </Layout>

    <Layout> </Layout>
  </Page>
</template>
```

Always use typescript and script setup. The script should be:

```
<script setup lang="ts">
```

Always componentise parts of the page. I don't want to see long pages with loads of html I want to see concise page structure with components. Eg:

```vue
<template>
  <!-- wrapper -->
  <Page>
    <!-- header section -->
    <Layout>
      <div class="flex gap-4">
        <!-- logo -->
        <Logo />
        <!-- user card -->
        <UserCard />
      </div>
    </Layout>

    <!-- plants -->
    <Layout>
      <div class="flex flex-col gap-4">
        <PlantCard v-for="plant in plants" :key="plant.id" :plant="plant" />
      </div>
    </Layout>

    <!-- tasks -->
    <Layout>
      <div class="flex flex-col gap-4">
        <TaskContainer>
          <TaskHeader />
          <TaskList>
            <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
          </TaskList>
        </TaskContainer>
      </div>
    </Layout>
  </Page>
</template>
```

Always make sure the page has the correct layout for it's function. Most pages are going to use auth so will want to use the 'authed' layout

```
definePageMeta({ layout: 'authed' })
```

When adding a new page, add it to the PAGES.md at the top level of the pages dir. This includes a description of what the page is for.

Read /app/pages/AGENTS.md for guidance when creating or updating pages.
