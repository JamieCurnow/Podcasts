---
trigger: always_on
---

# Styling |

We use Tailwind CSS for styling.

1. **No Custom CSS**: Always prefer Tailwind utility classes. Avoid writing custom CSS in `<style>` blocks unless absolutely necessary for complex animations or third-party overrides.
2. **Componentize Long Classes**: If you find yourself writing extremely long class strings or repeating the same utility classes across multiple elements, it is a sign that those elements should be extracted into a reusable Vue component.
3. **Consistency**: Use the design tokens provided by Nuxt UI (colors, spacing, etc.) via Tailwind classes (e.g., `text-primary`, `bg-gray-50`).

Read the brand/style guide in /APP_INFO.md to influence the look and feel of the UI that you build.
