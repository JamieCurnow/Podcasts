---
trigger: always_on
---

# Code style |

## Nuxt 4 path aliases

- `~/` resolves to the `app/` directory (e.g. `~/composables/foo` = `app/composables/foo.ts`)
- `~~/` resolves to the project root (e.g. `~~/shared/types/User` = `shared/types/User.ts`)

Do NOT write `~/app/composables/foo` — that would resolve to `app/app/composables/foo` which does not exist.

---

Always follow the prettier config for general code style rules.

{
"bracketSpacing": true,
"printWidth": 110,
"semi": false,
"singleQuote": true,
"tabWidth": 2,
"trailingComma": "none",
"arrowParens": "always",
"endOfLine": "lf"
}

---

When creating functions, always use objects as parameters instead of individual arguments. This makes it easier to add new parameters in the future without breaking existing code, and also makes it easier to pass in optional parameters, and easier to read from the outside.

Eg: Do NOT:
const updateUser = (firstName: string, lastName: string) => {}

DO:
const updateUser = (opts: { firstName: string, lastName: string }) => {
const { firstName, lastName } = opts
}

---

When creating functions, where possible, rely on type inference rather than explicitly defining the return type of the function.
Eg: Do NOT:
const getUser = (): User => {
return user
}
DO:
const getUser = () => {
return user
}

---

Where `if` functions can be put on one line, do so. Especially if the line exits the function.
Eg: Do NOT:
if (email) {
query.email = email
}
DO:
if (email) query.email = email

---

When console logging a variable, use object rather than string to denote what the variable is.
Eg: Do NOT:
console.log('user: ', user)
console.log('task: ', task)
DO:
console.log({ user, task })

---

Try wherever possible to keep each logical line of typescript on one line. Split out complex lines into seperate variables if needed to make it more readable.
EG:
DONT:

```ts
const task = await db.tasks.findOneAndUpdate(
  {
    _id: new ObjectId(taskId),
    userId
  },
  {
    $set: {
      ...input,
      updated: now
    }
  },
  {
    returnDocument: 'after'
  }
)
```

DO:

```ts
const task = await db.tasks.findOneAndUpdate(
  { _id: new ObjectId(taskId), userId },
  { $set: { ...input, updated: now } },
  { returnDocument: 'after' }
)
```

---
