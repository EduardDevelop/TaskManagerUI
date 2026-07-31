# Quickstart Validation: Task Management Frontend

This guide validates the feature through the browser and the Angular test suite.
The backend task service must be available at the configured development URL.

## Prerequisites

- Node.js 18 or newer.
- npm installed.
- Backend task service running with the contract in
  [contracts/tasks-api.md](contracts/tasks-api.md).
- Angular Material/CDK and SweetAlert2 installed as defined in `package.json`
  after implementation.

## Install and run

From the repository root:

```powershell
npm install
npm start
```

Open `http://localhost:4200`. Configure the non-sensitive API base URL through
the project's environment/configuration mechanism before starting the app.

## Automated validation

Run unit tests:

```powershell
npm run test:ci
```

Build the application:

```powershell
npm run build
```

## Manual acceptance scenarios

1. **Initial states**: Open the task page with data, no data, and an unavailable
   service. Confirm loading, populated board, empty board, per-column empty,
   error, and retry states are distinct.
2. **Create**: Open the form, submit an empty title, whitespace-only title, a
   100-character title, a 101-character title, a 500-character description,
   and a 501-character description. Confirm invalid cases do not send a
   request. Submit valid data and verify the confirmed task appears in the
   board, the interface returns to the main board, the create form is no longer
   visible, and a SweetAlert2 success message appears. Try creating another task
   with the same title using different case or surrounding spaces and confirm no
   duplicate request is sent.
3. **Edit**: Edit a task with valid and invalid data. Confirm valid edits open a
   SweetAlert2 confirmation before the request, canceling sends no request,
   confirming replaces the visible card with server-confirmed values, and failed
   edits preserve form data with a SweetAlert2 error.
4. **Delete**: Start deletion, cancel it, then confirm it in SweetAlert2.
   Confirm the title is identified, the action shows progress, and the task
   disappears only after success. Simulate failure and verify it remains visible.
5. **Board status**: Drag a task with the mouse from each status column to
   another status column. Confirm SweetAlert2 asks before the request, canceling
   restores the original column, confirming shows localized progress, repeated
   drags are blocked while busy, and a failed update restores the previous
   column. Verify a keyboard-accessible status-change fallback follows the same
   rules.
6. **Search/filter UX**: Search by task name/title, filter by each status,
   select creation-date start and end values with Angular Material calendar
   controls, test an invalid date range, clear filters, and verify the Material
   controls align cleanly on desktop and mobile while filtered empty state
   differs from global empty.
7. **Accessibility/responsive**: Complete the primary flows using keyboard only
   and inspect the page at desktop and mobile widths for labels, focus, readable
   feedback, and no horizontal overflow.

## Expected evidence

- Unit tests cover service methods, request bodies, form boundaries, board
  grouping, drag/drop events, modal confirm/success/error paths, duplicate-title
  blocking, date-range filtering, and status restoration.
- The build completes without TypeScript errors.
- Each manual scenario has visible success, loading, and failure behavior as
  applicable.
- The README documents the final configuration and commands.
