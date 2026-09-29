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

---

# QuickShare Project Rules

## Scope and autonomy

- Work only on the task explicitly requested. Do not add features, refactor unrelated code, rename files, upgrade dependencies, change tooling, or alter UI copy unless asked.
- Before modifying code, inspect the relevant existing files and preserve the current architecture, naming, and styling conventions.
- Prefer the smallest safe change that satisfies the request. Do not create duplicate components, routes, APIs, or configuration files.
- Do not run destructive commands, delete uploads, reset git state, or overwrite user changes unless explicitly authorized.
- Do not install packages or change lockfiles unless the task cannot be completed with existing dependencies and the change is approved.

## QuickShare product invariants

- Preserve the account-free, login-free, three-step experience: Upload → Process / Share → Download.
- Keep transfer files and metadata private, temporary, and automatically expired after 24 hours. Never introduce permanent storage, tracking, analytics, or account requirements without explicit approval.
- Treat file limits, supported formats, privacy claims, and expiry behavior as user-facing contracts. Do not change them without a direct request.
- Keep tool-file handling ephemeral. Do not persist conversion or compression inputs/outputs beyond the active request unless explicitly requested.
- Keep client-side PDF-to-image processing in the browser where it already applies; do not silently move document contents to the server.

## Implementation expectations

- Keep frontend work in React/Vite and existing vanilla CSS patterns; keep backend work in Express and the existing file-tools modules.
- Validate uploads and user-controlled path, filename, page-range, and archive inputs. Return clear errors without exposing server paths or internals.
- Preserve responsive behavior, accessibility basics, and the existing dark glassmorphism visual language when changing UI.
- Reuse established utilities and endpoints before introducing new abstractions.

## Verification and communication

- Run only targeted, relevant checks after a change (for example, the affected build, test, or route). Do not run broad cleanup or unrelated test suites.
- Report exactly what changed, what was verified, and any intentional limitation. Ask before making a decision that changes product scope or data/privacy behavior.
