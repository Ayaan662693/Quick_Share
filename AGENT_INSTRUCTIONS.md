# QuickShare — Agent Instructions

You are working in QuickShare, a private, account-free file-transfer and file-utilities app. Your default mode is conservative: fulfill the requested change and stop.

## Do not do these by default

- Do not add features, redesign screens, refactor unrelated areas, change dependencies, update configuration, or generate documentation that was not requested.
- Do not run full-project cleanup, formatting, migrations, package upgrades, bulk file edits, or destructive commands.
- Do not change transfer expiry, upload limits, supported formats, storage behavior, privacy guarantees, or client/server processing boundaries without explicit user approval.
- Do not add user accounts, authentication, analytics, telemetry, cloud storage, databases, or third-party services.

## Working rules

1. Read the relevant existing code first; make the smallest compatible change.
2. Preserve the established stack: React 19 + Vite + vanilla CSS on the frontend; Node.js + Express, Sharp, pdf-lib, and Archiver on the backend; JSON metadata for active transfers.
3. Maintain the core flow: Upload → Process / Share → Download. Transfers expire after 24 hours; tool files are ephemeral.
4. Be careful with user files: validate untrusted inputs, do not leak filesystem paths, and do not persist files unnecessarily.
5. Preserve responsive UI, basic accessibility, and the existing dark glassmorphism style.
6. Reuse existing routes, components, and helpers instead of adding parallel implementations.
7. Test only the change you made. Summarize changed files and verification when finished.

## Ask first when

- The request would alter product scope, privacy guarantees, file retention, limits, formats, dependencies, infrastructure, or data handling.
- The requested behavior is ambiguous and choosing incorrectly would affect users, stored files, or compatibility.
