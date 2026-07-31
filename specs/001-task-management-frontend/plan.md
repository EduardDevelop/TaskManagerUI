# Implementation Plan: Task Management Frontend

**Branch**: `001-task-management-frontend` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-management-frontend/spec.md`

## Summary

Deliver the complete task-management experience over the existing REST service:
board-based list, create, edit, delete with confirmation, drag-and-drop status
changes, validation, loading, error, modal feedback, responsive, accessible,
duplicate-title prevention, automatic return to the task board after successful
creation, and polished search/filter states by task name, status, and
creation-date range. The implementation will consolidate the current standalone
Angular components, models, services, and page into the constitution-aligned
`core`/`shared`/`features/tasks` boundaries while preserving the existing
standalone application and route.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.7.2 with Angular 19.1 standalone components

**Primary Dependencies**: Angular forms, router, HttpClient, RxJS 7.8, Karma,
Jasmine, Angular Material 19-compatible components, Angular CDK DragDrop, and
SweetAlert2

**Storage**: External REST API; no frontend-owned persistence

**Testing**: Angular CLI Karma/Jasmine unit tests; HttpClient request tests and
component behavior tests

**Target Platform**: Browser desktop and mobile widths; retain the existing
Angular SSR build configuration without expanding SSR scope

**Project Type**: Angular web application

**Performance Goals**: Initial and mutation feedback must be immediate and
localized; with 50 tasks, client filtering must complete within the 10-second
user outcome defined by SC-005

**Constraints**: No NgRx; no direct HTTP from presentational components; typed
Observables; Reactive Forms; immutable task collections; 10-second request
timeout; API URL supplied by configuration; no secrets in frontend
configuration; Angular Material/CDK are allowed for UI primitives and
drag-and-drop only; SweetAlert2 calls must be isolated behind a typed core alert
service rather than scattered through components

**Scale/Scope**: One task-management screen, a small in-memory task collection,
five required API operations, one three-column task board, client-side search by
task name/title, status filtering, and inclusive creation-date range filtering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **Feature-oriented architecture**: PASS for the target structure. Existing
  `src/app/components`, `models`, `services`, and `pages` are migration inputs;
  implementation tasks must place task-specific board, filter, and alert
  integration code under `features/tasks` or `core` as appropriate.
* **Smart/presentational separation**: PASS. The task page owns orchestration;
  board, card, form, filters, loading, and modal feedback integration remain
  presentational or reusable UI surfaces. Presentational components emit typed
  drag/drop, edit, delete, submit, cancel, and filter events.
* **Exclusive typed API access**: PASS. `TaskService` owns all HTTP operations,
  uses the configured API base URL, and exposes typed Observables.
* **Strong typing and domain validation**: PASS. `Task`, request types, status
  constants, board grouping types, title-normalization helpers, duplicate-title
  checks, and form validators are explicit; `any` is not permitted.
* **RxJS and request lifecycle**: PASS. Use `takeUntilDestroyed`, `finalize`,
  and concurrency guards; do not add nested subscriptions.
* **Simple immutable state**: PASS. Keep one task collection in the page and
  compute filtered results and board columns from it by name, status, and
  creation-date range; do not add a global state library.
* **Errors, feedback, deletion, accessibility, and responsiveness**: PASS.
  Design includes mapped HTTP errors, localized loading, accessible feedback,
  SweetAlert2 confirmation before edit, delete, and status drop, Angular
  Material date/filter controls with labels, keyboard alternatives for status
  changes, mobile layouts, and a post-create transition back to the board.
* **Testability and documentation**: PASS. The design includes HTTP, form,
  component, mutation, and error tests plus README updates.

No gate violations require a complexity exception.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-management-frontend/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── core/
│   │   ├── config/
│   │   ├── models/
│   │   └── services/
│   │       ├── alert.service.ts
│   │       └── http-error-mapper.service.ts
│   ├── shared/
│   │   └── components/
│   │       ├── confirm-dialog/
│   │       ├── loading-indicator/
│   │       └── notification/        # legacy surface to remove or leave unused after SweetAlert2 migration
│   ├── features/
│   │   └── tasks/
│   │       ├── components/
│   │       │   ├── task-card/
│   │       │   ├── task-board/
│   │       │   ├── task-filters/
│   │       │   ├── task-form/
│   │       │   └── task-list/
│   │       ├── containers/
│   │       │   └── task-page/
│   │       ├── models/
│   │       ├── services/
│   │       └── utils/
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.component.ts
├── environments/
│   ├── environment.ts
│   └── environment.production.ts
└── styles.css
tests are colocated with the corresponding source components and services
```

**Structure Decision**: Use one Angular application with a task feature
boundary. Migrate the current `src/app/pages/task-manager`,
`src/app/components`, `src/app/models`, and `src/app/services` code into the
target boundaries without changing the public route. Keep configuration and
cross-cutting error/alert services in `core`, reusable UI in `shared`, and
task-specific models, services, components, and tests in `features/tasks`.

**Current Gap Decision**: The create success handler must not call a guarded
close path while the save request is still marked busy. It must explicitly clear
create mode, reset form-level errors, and render the main board after the server
confirms creation so users do not create repeated duplicate tasks out of
uncertainty.

**Filtering Decision**: Extend the existing task-filter component and
`task-filtering` utility instead of introducing a new filtering service. The
filter model should keep one derived view with `searchTerm`, `status`,
`createdFrom`, and `createdTo`; date comparisons use the server `createdAt`
value and inclusive calendar-day boundaries. Render filters with Angular
Material form-field, input, select, datepicker/date-range controls, button, icon,
and chip primitives to fix alignment, spacing, labels, focus states, and mobile
wrapping.

**Board Decision**: Replace the status selector/list status-change workflow with
a three-column board derived from the authoritative task collection. Use Angular
CDK DragDrop to emit typed moves from one status column to another. A drop to the
same column or outside a valid column is ignored; a valid cross-column drop opens
confirmation before calling the update service. Cancellation or failure restores
the task to the previous column; success uses the server-confirmed task.

**Modal Feedback Decision**: Use SweetAlert2 through a typed
`AlertService`/facade in `src/app/core/services/` for confirm, success, error,
and information dialogs. Components must not call SweetAlert2 directly. Delete,
edit update, and drag/drop status update all require confirmation; successful
create/update/delete/status changes and mapped errors surface through the same
facade.

## Complexity Tracking

No constitution violations or complexity exceptions are proposed.
