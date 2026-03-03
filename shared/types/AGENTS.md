This is the types directory.
It includes all of the types used in this Nuxt4 project.

When making a new type it should live here.
Types should be named in PascalCase and be placed in the appropriate directory.
Types should be exported as interfaces rather than types where possible.

There is a TYPES.md file in this directory that documents all of the types in this directory.

- If you add a new type, it must be documented in the TYPES.md file.
- If you remove a type, it must be removed from the TYPES.md file.
- If you update a type, it must be updated in the TYPES.md file.

Whenever you make a change to the types in this app, or if you learn something about types that is worth preserving, you should update this file in the `## Learnings` section in this file.
Good learning additions are type-wide patterns eg:

- For any types that are in the db, always create a front end type (User) and a back end type (UserDoc).
- Backend types can be made with the ToMongoDoc utility type: `type UserDoc = ToMongoDoc<User, 'created' | 'updated'>`
- ToMongoDoc takes two arguments: the type to convert, and a union of the keys to transform into Date objects.
- On the backend, the doc types should have Date objects, on the front end they will be ISO strings.

Don't add:

- type specific details
- temporary notes
- info already in the TYPES.md file

## Learnings

- This app has no MongoDB. The `ToMongoDoc`/`BaseDocument` patterns from the template don't apply here.
- `Podcast` and `Episode` are the primary domain types. Everything else derives from or references them.
- `EpisodeMeta` is client-generated (not from the feed) — it tracks listening progress per episode.
- Use `feedUrl` as the unique identifier for a podcast and `guid` as the unique identifier for an episode.
- The `PodIdx*` types are defined but not yet connected to active endpoints — they're ready for Podcast Index API integration.
