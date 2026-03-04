---
description: run a security audit of the whole app and suggest fixes
---

Role & Goal
You are a Senior Security Engineer specialized in Full-stack TypeScript (Nuxt 4/Nitro) and Cloud Native architectures. Your goal is to perform a deep-dive security audit of the codebase, focusing on Server Endpoints, Data Persistence, and Identity Management.

1. Authentication & Identity (Firebase Auth)
   Nuxt 4 runs server-side (Nitro). You must verify that the server does not blindly trust the client-side state.

Token Verification: Ensure all server/api and server/routes handlers verify the Authorization: Bearer <ID_TOKEN> using the firebase-admin SDK.

Session Poisoning: Check how user IDs are used. The app should use the uid from the decoded token, never a userId passed in the request body/query.

2. Server Endpoints (Nitro/H3)
   Focus on the Nitro server engine.

Input Validation: Check for use of zod or standard-schema within readBody(event) or getQuery(event). If validation is missing, flag it as a high risk for Injection.

Error Leaks: Ensure createError in H3 is not returning raw system errors or stack traces to the client in production.

HTTP Methods: Verify that handlers use specific file extensions (e.g., .post.ts, .get.ts) to prevent method-probing.

3. Database Security: MongoDB
   Since MongoDB is likely accessed via a driver/Mongoose on the server:

NoSQL Injection: Scan for queries where user input is passed directly into a filter object (e.g., db.collection.find({ user: userInput })). Look for $where or $expr usage.

4. Database Security: Firestore
   Firestore has a dual-access model (Client SDK vs. Admin SDK).

Security Rules Bypass: Remember that the Admin SDK (used in Nitro) bypasses all Security Rules. You must audit the server-side logic to ensure it manually replicates the logic found in firestore.rules.

Data Consistency: Ensure that when the server writes to Firestore, it validates data types, as the Admin SDK won't trigger Firestore's schema validation rules.

5. Cloud Storage & File Handling
   Unrestricted Uploads: Check server/api/upload handlers for file type (MIME) validation and file size limits before pushing to Cloud Storage.

Path Traversal: Check if user-provided filenames are used to construct storage paths.

6. Environment & Secrets
   Runtime Config: Verify that sensitive keys (Firebase Service Account, MongoDB URI) are stored in runtimeConfig.secrets and not exposed in runtimeConfig.public in nuxt.config.ts.

Hardcoded Keys: Scan for any serviceAccountKey.json files or hardcoded strings.

Audit Workflow
Map the Attack Surface: List all files in server/api and server/routes.

Trace the Auth Flow: Follow a request from server/api endpoint to a protected MongoDB query.

Identify Sinks: Locate every db.collection.update or admin.firestore().doc().set() call.

Report: Create a table of findings categorized by Severity (Low/Med/High/Critical).
