# Tasks: Task Management Frontend

**Input**: Design documents from `/specs/001-task-management-frontend/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included because the feature specification defines service, form, component, mutation, error, and boundary validation scenarios.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after the foundational phase.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the target feature-oriented layout and configurable runtime settings.

- [X] T001 Record the current build and test baseline in `package.json` and `README.md` before migrating task files
- [X] T002 [P] Create development and production API configuration contracts in `src/environments/environment.ts` and `src/environments/environment.production.ts`
- [X] T003 [P] Create the target task feature directories under `src/app/features/tasks/` and shared/core directories under `src/app/shared/` and `src/app/core/`
- [X] T004 Update TypeScript path and application configuration references in `tsconfig.json` and `angular.json` if required by the new source layout

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared domain, HTTP, error, and UI infrastructure required by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define immutable task domain types, request types, supported statuses, labels, and transition constants in `src/app/features/tasks/models/task.model.ts`
- [X] T006 [P] Add task status and request validation helpers in `src/app/features/tasks/utils/task-validation.ts`
- [X] T007 Implement the typed task REST service with configurable base URL, timeout, safe identifier paths, and Observable methods in `src/app/features/tasks/services/task.service.ts`
- [X] T008 [P] Implement typed HTTP error mapping for 400, 404, 500, network, timeout, and unknown failures in `src/app/core/models/application-error.model.ts` and `src/app/core/services/http-error-mapper.service.ts`
- [X] T009 [P] Implement deduplicated success, error, and information notifications in `src/app/core/services/notification.service.ts`
- [X] T010 [P] Implement an accessible reusable loading indicator with busy text in `src/app/shared/components/loading-indicator/loading-indicator.component.ts` and `src/app/shared/components/loading-indicator/loading-indicator.component.html`
- [X] T011 [P] Implement an accessible reusable destructive-action dialog with confirm, cancel, focus, and keyboard behavior in `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts` and `src/app/shared/components/confirm-dialog/confirm-dialog.component.html`
- [X] T012 Configure HTTP, environment-backed API settings, router, and shared providers in `src/app/app.config.ts` and `src/app/app.routes.ts`
- [X] T013 Add request-contract tests for all task service methods and timeout/error propagation in `src/app/features/tasks/services/task.service.spec.ts`
- [X] T014 Add unit tests for status validation, transition rules, and request payload shaping in `src/app/features/tasks/utils/task-validation.spec.ts`

**Checkpoint**: Typed domain and service infrastructure are ready; user stories can now be implemented independently.

---

## Phase 3: User Story 1 - Consultar y entender las tareas (Priority: P1) 🎯 MVP

**Goal**: Load and render tasks with loading, populated, empty, error, and retry states.

**Independent Test**: Stub the task service with a task list, an empty list, and a failure; verify each corresponding view and retry action without create/edit/delete flows.

### Tests for User Story 1

- [X] T015 [P] [US1] Test task list rendering, optional descriptions, human-readable statuses, and empty-state output in `src/app/features/tasks/components/task-list/task-list.component.spec.ts`
- [X] T016 [P] [US1] Test task page initial loading, successful load, empty state, error message, and retry behavior in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement the presentational task card with stable identity, description fallback, status label, and typed action outputs in `src/app/features/tasks/components/task-card/task-card.component.ts` and `src/app/features/tasks/components/task-card/task-card.component.html`
- [X] T018 [US1] Implement the task list with typed task inputs, empty-state guidance, responsive layout, and typed edit/delete/status outputs in `src/app/features/tasks/components/task-list/task-list.component.ts` and `src/app/features/tasks/components/task-list/task-list.component.html`
- [X] T019 [US1] Implement task-page load state, authoritative task collection, retry action, and child event wiring in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T020 [US1] Compose the task-page loading, error, empty, and populated views with accessible labels in `src/app/features/tasks/containers/task-page/task-page.component.html` and `src/app/features/tasks/containers/task-page/task-page.component.css`
- [X] T021 [US1] Point the root route at the task page while preserving the existing public URL in `src/app/app.routes.ts`

**Checkpoint**: US1 is independently demonstrable with all initial list states and retry behavior.

---

## Phase 4: User Story 2 - Crear una tarea válida (Priority: P1)

**Goal**: Create tasks through a reusable validated form with duplicate-submit protection and failure preservation.

**Independent Test**: Open create mode, exercise title/description/status boundaries, submit valid data, and simulate success or failure while verifying the list and form state.

### Tests for User Story 2

- [X] T022 [P] [US2] Test required, trimmed meaningful title, 100-character title, description length, valid status, touched errors, and invalid-submit blocking in `src/app/features/tasks/components/task-form/task-form.component.spec.ts`
- [X] T023 [P] [US2] Test task-page create success, notification, list insertion, form reset, request loading, and failed-create data preservation in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 2

- [X] T024 [US2] Implement the typed Reactive Form for create and edit modes with default pending status and field-level validation in `src/app/features/tasks/components/task-form/task-form.component.ts`
- [X] T025 [US2] Implement labeled title, description, status controls, validation messages, character limits, disabled submit state, and cancel output in `src/app/features/tasks/components/task-form/task-form.component.html`
- [X] T026 [US2] Style the task form for clear validation feedback, keyboard use, and mobile widths in `src/app/features/tasks/components/task-form/task-form.component.css`
- [X] T027 [US2] Add task-page create orchestration, server-confirmed list update, form reset, duplicate-submit guard, and form error preservation in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T028 [US2] Integrate create mode and form submission feedback into the task page template in `src/app/features/tasks/containers/task-page/task-page.component.html`

**Checkpoint**: US1 and US2 work independently after foundation; invalid forms never invoke the service.

---

## Phase 5: User Story 3 - Editar una tarea existente (Priority: P1)

**Goal**: Reuse the validated form to edit server-backed task fields without exposing generated fields.

**Independent Test**: Select a task, verify populated edit mode, submit valid and invalid changes, then simulate success, 404, and generic failure.

### Tests for User Story 3

- [X] T029 [P] [US3] Test edit-mode initialization from an immutable task copy and read-only identifier/timestamp behavior in `src/app/features/tasks/components/task-form/task-form.component.spec.ts`
- [X] T030 [P] [US3] Test task-page edit success, 404 refresh guidance, generic failure preservation, and confirmed response replacement in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 3

- [X] T031 [US3] Add typed edit input patching and immutable form initialization to `src/app/features/tasks/components/task-form/task-form.component.ts`
- [X] T032 [US3] Add edit-mode title/status context and non-editable server-field presentation to `src/app/features/tasks/components/task-form/task-form.component.html`
- [X] T033 [US3] Wire edit selection, update requests, confirmed task replacement, 404 recovery, and failure preservation in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T034 [US3] Add edit action, cancel behavior, and save feedback rendering to `src/app/features/tasks/components/task-page/task-page.component.html`

**Checkpoint**: US3 adds editing without changing the create validation contract or server-owned fields.

---

## Phase 6: User Story 4 - Eliminar una tarea de forma segura (Priority: P1)

**Goal**: Require explicit confirmation and remove a task only after a successful server response.

**Independent Test**: Start and cancel confirmation, confirm deletion, then simulate success, failure, and 404 while verifying visible task integrity.

### Tests for User Story 4

- [X] T035 [P] [US4] Test confirm dialog confirm/cancel outputs, task title, keyboard close, and disabled processing state in `src/app/shared/components/confirm-dialog/confirm-dialog.component.spec.ts`
- [X] T036 [P] [US4] Test task-page delete cancellation, success removal, failure preservation, 404 refresh, and localized busy state in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 4

- [X] T037 [US4] Integrate the reusable confirmation dialog with the selected task title and typed confirm/cancel handlers in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T038 [US4] Implement delete request lifecycle, per-task disabled state, server-confirmed removal, and failure recovery in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T039 [US4] Render confirmation dialog, destructive action labels, progress, and accessible recovery messages in `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T040 [US4] Add responsive destructive-action styling and dialog focus presentation in `src/app/shared/components/confirm-dialog/confirm-dialog.component.css`

**Checkpoint**: US4 prevents accidental data loss and leaves failed deletions visible.

---

## Phase 7: User Story 5 - Cambiar el estado de una tarea (Priority: P1)

**Goal**: Change valid task statuses with localized progress, concurrency protection, and rollback on failure.

**Independent Test**: Change a task through valid statuses, repeat while busy, and simulate failure to verify the previous status remains.

### Tests for User Story 5

- [X] T041 [P] [US5] Test status controls expose only valid labels and emit typed status changes in `src/app/features/tasks/components/task-card/task-card.component.spec.ts`
- [X] T042 [P] [US5] Test status update success, same-task concurrency blocking, failure restoration, and server-confirmed replacement in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 5

- [X] T043 [US5] Add a typed status selector or next-status action with disabled busy state and human-readable labels in `src/app/features/tasks/components/task-card/task-card.component.ts` and `src/app/features/tasks/components/task-card/task-card.component.html`
- [X] T044 [US5] Implement status update orchestration using the update service contract, per-task busy tracking, and previous-status preservation in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T045 [US5] Render status progress and accessible failure feedback without blocking unrelated tasks in `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T046 [US5] Add visual distinction for current status and status-in-progress controls without relying on color alone in `src/app/features/tasks/components/task-card/task-card.component.css`

**Checkpoint**: US5 completes the required task lifecycle while preserving state on failed updates.

---

## Phase 8: User Story 6 - Buscar y filtrar tareas (Priority: P2)

**Goal**: Derive predictable text and status-filtered results without mutating the authoritative task collection.

**Independent Test**: Search and filter a list, clear filters, check filtered-empty messaging, and repeat after create/edit/delete updates.

### Tests for User Story 6

- [X] T047 [P] [US6] Test trimmed case-insensitive title/description search, status filtering, filter clearing, and filtered-empty distinction in `src/app/features/tasks/utils/task-filtering.spec.ts`
- [X] T048 [P] [US6] Test filter event wiring and filtered list updates after task mutations in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

### Implementation for User Story 6

- [X] T049 [P] [US6] Implement immutable search and status-filter derivation helpers in `src/app/features/tasks/utils/task-filtering.ts`
- [X] T050 [US6] Implement typed search, status selection, active-filter indication, and clear action outputs in `src/app/features/tasks/components/task-filters/task-filters.component.ts`
- [X] T051 [US6] Render filter controls, clear action, and accessible labels in `src/app/features/tasks/components/task-filters/task-filters.component.html` and `src/app/features/tasks/components/task-filters/task-filters.component.css`
- [X] T052 [US6] Integrate derived filtered tasks and distinct global/filtered empty states into `src/app/features/tasks/containers/task-page/task-page.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.html`

**Checkpoint**: US6 is optional and can be delivered after all P1 workflows without changing the source task collection.

---

## Phase 9: User Story 7 - Recibir retroalimentación accesible (Priority: P2)

**Goal**: Provide consistent success, error, loading, keyboard, and responsive feedback across all task operations.

**Independent Test**: Simulate loading, success, validation, server, network, timeout, and unknown errors for each main operation and verify accessible recovery.

### Tests for User Story 7

- [X] T053 [P] [US7] Test notification deduplication, message severity, dismissal, and accessible announcement behavior in `src/app/shared/components/notification/notification.component.spec.ts` and `src/app/core/services/notification.service.spec.ts`
- [X] T054 [P] [US7] Test error mapping messages for 400, 404, 500, network, timeout, and unknown failures in `src/app/core/services/http-error-mapper.service.spec.ts`

### Implementation for User Story 7

- [X] T055 [US7] Implement notification presentation with success, error, information, dismissal, and accessible live-region semantics in `src/app/shared/components/notification/notification.component.ts` and `src/app/shared/components/notification/notification.component.html`
- [X] T056 [US7] Connect task-page success and failure outcomes to the notification service without duplicate messages in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T057 [US7] Render global notifications and operation-specific loading/error recovery in `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T058 [US7] Complete responsive desktop/mobile layout, focus states, semantic controls, and non-color status/error cues in `src/app/features/tasks/containers/task-page/task-page.component.css` and `src/styles.css`

**Checkpoint**: US7 makes all delivered stories understandable and recoverable for keyboard and mobile users.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature, document it, and remove migration leftovers.

- [X] T060 [P] Remove or update obsolete task files and imports under `src/app/components/`, `src/app/models/`, `src/app/services/`, and `src/app/pages/` after feature migration is verified
- [X] T064 Review the final source tree against `specs/001-task-management-frontend/plan.md` and confirm no temporary files or debug statements remain in `src/`
- [X] T061 [P] [US2] Add task-page create-success tests that verify the server-confirmed task is added and the UI returns to the list even while the save request is completing in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`
- [X] T062 [P] [US2] Add task-page duplicate-title tests that block a duplicate create request before `TaskService.createTask` and preserve the form after a backend duplicate rejection in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T004 can begin immediately, with T003 and T002 parallel.
- **Foundational (Phase 2)**: Depends on Setup; T005-T014 block all user-story work.
- **P1 stories (Phases 3-7)**: Depend on Foundation. US1 is the MVP base; US2-US5 can be developed in parallel after shared foundation, but each integrates with the task page.
- **P2 stories (Phases 8-9)**: Depend on the relevant P1 task-page integration; US6 depends on the list and mutation update paths, while US7 can begin after shared feedback services exist and completes after mutation flows are wired.
- **Polish (Phase 10)**: Depends on all required P1 stories and any selected P2 stories.

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2; MVP.
- **US2 (P1)**: Depends on US1 task-page composition for visible create flow, plus Phase 2.
- **US3 (P1)**: Depends on US2 shared form implementation and US1 list actions.
- **US4 (P1)**: Depends on US1 list actions and Phase 2 confirmation dialog; independent of form internals.
- **US5 (P1)**: Depends on US1 task card/list actions and Phase 2 status model; independent of form internals.
- **US6 (P2)**: Depends on US1 list and US2-US5 mutation update paths to verify filter persistence.
- **US7 (P2)**: Depends on Phase 2 feedback infrastructure and integrates with US1-US5 operation outcomes.

### Parallel Opportunities

- After Phase 1, T005-T011 can be split by file ownership; T013-T014 can run after their respective foundational implementations.
- Within US1, T015/T016 tests and T017 can proceed in parallel; T018-T020 remain ordered around the page composition.
- Within US2, T022/T023 tests can proceed in parallel with T024-T026 when contracts are stable.
- US4 and US5 can proceed in parallel with each other after US1, because they touch separate card/dialog concerns; their page-spec edits should be coordinated.
- US6 filtering utility work (T047/T049) can proceed in parallel with US7 notification/error work (T053-T055).
- T059 and T060 can proceed in parallel only after feature migration is behaviorally verified; T061-T063 run sequentially as final validation.

### Parallel Example: User Story 1

```text
Task: T015 [US1] Test task list rendering in src/app/features/tasks/components/task-list/task-list.component.spec.ts
Task: T016 [US1] Test task page states in src/app/features/tasks/containers/task-page/task-page.component.spec.ts
Task: T017 [US1] Implement task card in src/app/features/tasks/components/task-card/
```

### Parallel Example: P1 mutation stories

```text
Task: T037 [US4] Integrate confirmation dialog in src/app/features/tasks/containers/task-page/task-page.component.ts
Task: T043 [US5] Add status control in src/app/features/tasks/components/task-card/
Task: T024 [US2] Implement Reactive Form in src/app/features/tasks/components/task-form/
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundational infrastructure.
3. Complete Phase 3 US1.
4. Run T015, T016, `npm test`, and `npm run build`.
5. Stop and validate list loading, populated, empty, error, and retry states.

### Incremental Delivery

1. Add US2 create and validate form boundaries.
2. Add US3 edit using the same form.
3. Add US4 confirmed deletion.
4. Add US5 status lifecycle and failure restoration.
5. Add US7 consistent feedback and accessibility polish.
6. Add US6 optional search and filtering.
7. Complete Phase 10 documentation, migration cleanup, build, tests, and quickstart validation.

Each story must pass its independent test criteria before the next story is considered complete.

## Notes

- Every task uses the required `- [ ] T###` checklist format.
- `[P]` appears only on tasks that can proceed in parallel without incomplete-file dependencies.
- `[US1]` through `[US7]` map directly to the seven stories in `spec.md`.
- Tasks reference concrete repository paths so an implementation agent can execute them without additional design context.

---

## Phase 11: Convergence - Create Return, Unique Titles, and Advanced Filters

**Purpose**: Close the remaining UX and validation gaps introduced by the updated specification: successful create must return to the main list, create must block duplicate titles, and filters must support task name, status, and creation-date range with calendar controls.

**Traceability**: FR-010, FR-025, FR-027, FR-029, FR-030, SC-005, SC-011, US2/AC3, US2/AC6, US6/AC1-US6/AC7.

- [X] T065 [P] [US2] Add duplicate-title normalization and create-guard tests in `src/app/features/tasks/utils/task-validation.spec.ts`
- [X] T066 [P] [US6] Add inclusive creation-date range, one-sided range, invalid range, and filtered-empty utility tests in `src/app/features/tasks/utils/task-filtering.spec.ts`
- [X] T067 [P] [US2] Add task-page create-success tests that verify the server-confirmed task is added and the UI returns to the list even while the save request is completing in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`
- [X] T068 [P] [US2] Add task-page duplicate-title tests that block a duplicate create request before `TaskService.createTask` and preserve the form after a backend duplicate rejection in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`
- [X] T069 [P] [US6] Add task-filter component tests for name input, status selection, calendar start/end controls, active filter summary, invalid-range message, and clear action in `src/app/features/tasks/components/task-filters/task-filters.component.spec.ts`
- [X] T070 [US2] Implement normalized title helpers and duplicate-title detection in `src/app/features/tasks/utils/task-validation.ts`
- [X] T071 [US2] Wire duplicate-title validation into the create flow without sending duplicate POST requests in `src/app/features/tasks/containers/task-page/task-page.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T072 [US2] Fix successful create orchestration so `showForm`, `editingTask`, and `formError` are cleared after server confirmation without being blocked by the `saving` guard in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T073 [US2] Update create success feedback, list-return rendering, and accessible focus or announcement behavior in `src/app/features/tasks/containers/task-page/task-page.component.html` and `src/app/features/tasks/containers/task-page/task-page.component.css`
- [X] T074 [US6] Extend `TaskFilter` and filtering helpers with `createdFrom`, `createdTo`, inclusive calendar-day comparisons, and invalid-range validation in `src/app/features/tasks/utils/task-filtering.ts`
- [X] T075 [US6] Replace the filter surface with user-friendly name, status, calendar start date, calendar end date, active-filter, invalid-range, and clear controls in `src/app/features/tasks/components/task-filters/task-filters.component.ts`, `src/app/features/tasks/components/task-filters/task-filters.component.html`, and `src/app/features/tasks/components/task-filters/task-filters.component.css`
- [X] T076 [US6] Integrate advanced filter state, invalid-range handling, filters-active detection, and filtered-empty messaging into `src/app/features/tasks/containers/task-page/task-page.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T077 [P] Update README create-flow, duplicate-title, and advanced-filter documentation in `README.md`
- [X] T078 Run the targeted Angular tests for validation, filtering, filter component, and task page behavior using the scripts in `package.json`
- [ ] T079 Run the production build and execute the updated manual scenarios from `specs/001-task-management-frontend/quickstart.md`

---

## Phase 12: Convergence - Material Board Drag-and-Drop and SweetAlert2 UX

**Purpose**: Replace selector-based status changes with a three-column drag-and-drop task board, improve filter UX with Angular Material, and route confirmations, successes, and errors through SweetAlert2.

**Traceability**: FR-002, FR-010, FR-014, FR-015, FR-019, FR-025, FR-031, FR-032, FR-033, SC-001, SC-012, SC-013, SC-014, US1/AC2-US1/AC4, US3/AC2-US3/AC4, US4/AC1-US4/AC5, US5/AC1-US5/AC7, US6/AC8, US7/AC2-US7/AC5.

- [X] T080 Add Angular Material/CDK and SweetAlert2 dependencies and generated lockfile updates in `package.json` and `package-lock.json`
- [X] T081 Configure Angular Material animations, theme, typography, icon/font assets as needed, and global Material-compatible styles in `src/app/app.config.ts`, `angular.json`, and `src/styles.css`
- [X] T082 [P] Add typed SweetAlert2 alert facade tests for confirm, success, error, cancellation, and dismiss outcomes in `src/app/core/services/alert.service.spec.ts`
- [X] T083 Implement a typed SweetAlert2 alert facade with no direct modal calls from presentational components in `src/app/core/services/alert.service.ts`
- [X] T084 [P] [US1] Add task-board rendering tests for three status columns, per-column empty states, card counts, and filtered board input in `src/app/features/tasks/components/task-board/task-board.component.spec.ts`
- [X] T085 [P] [US5] Add task-board drag/drop tests for valid cross-column drops, same-column no-ops, invalid drop targets, busy disabled state, and typed move output in `src/app/features/tasks/components/task-board/task-board.component.spec.ts`
- [X] T086 [P] [US5] Add task-page status move tests for SweetAlert2 confirm, cancel restoration, update success, update failure restoration, and keyboard fallback in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`
- [X] T087 [P] [US3] Add task-page edit-update confirmation tests that cancel before PUT, confirm before PUT, preserve invalid forms, and show SweetAlert2 success/error outcomes in `src/app/features/tasks/containers/task-page/task-page.component.spec.ts`
- [X] T088 [P] [US6] Update task-filter tests for Angular Material name, status, date range, invalid range, active chip summary, clear action, and responsive layout hooks in `src/app/features/tasks/components/task-filters/task-filters.component.spec.ts`
- [X] T089 [US1] Implement a presentational three-column task board with Pendiente, En progreso, and Completada columns in `src/app/features/tasks/components/task-board/task-board.component.ts`, `src/app/features/tasks/components/task-board/task-board.component.html`, and `src/app/features/tasks/components/task-board/task-board.component.css`
- [X] T090 [US5] Add Angular CDK DragDrop directives, connected drop lists, drag handles, previews/placeholders, no-op guards, and typed status move outputs to `src/app/features/tasks/components/task-board/task-board.component.ts` and `src/app/features/tasks/components/task-board/task-board.component.html`
- [X] T091 [US5] Remove selector-based status mutation controls from task cards and keep card actions focused on edit, delete, drag handle, and keyboard status fallback in `src/app/features/tasks/components/task-card/task-card.component.ts`, `src/app/features/tasks/components/task-card/task-card.component.html`, and `src/app/features/tasks/components/task-card/task-card.component.css`
- [X] T092 [US1] Replace task-list rendering with task-board rendering and grouped visible tasks in `src/app/features/tasks/containers/task-page/task-page.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T093 [US5] Wire drag/drop status moves through SweetAlert2 confirmation, task update service, localized busy state, server-confirmed replacement, cancellation restoration, and failure restoration in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T094 [US5] Implement the keyboard-accessible status-change fallback with the same confirmation, update, success, cancellation, and error behavior in `src/app/features/tasks/components/task-card/task-card.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T095 [US3] Require SweetAlert2 confirmation before edit updates and route edit update success and error feedback through the alert facade in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T096 [US4] Replace the reusable confirm-dialog delete flow with SweetAlert2 confirmation while preserving delete busy state, server-confirmed removal, cancellation no-op, 404 refresh, and failure recovery in `src/app/features/tasks/containers/task-page/task-page.component.ts` and `src/app/features/tasks/containers/task-page/task-page.component.html`
- [X] T097 [US2] Route create success, duplicate-title errors, backend validation errors, network errors, and post-create board return feedback through the SweetAlert2 alert facade in `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T098 [US6] Refactor filters to Angular Material form-field, input, select, datepicker/date-range, button, icon, and chip controls in `src/app/features/tasks/components/task-filters/task-filters.component.ts`, `src/app/features/tasks/components/task-filters/task-filters.component.html`, and `src/app/features/tasks/components/task-filters/task-filters.component.css`
- [X] T099 [US6] Polish responsive Material filter and board layout spacing, alignment, focus states, drop target states, and mobile wrapping in `src/app/features/tasks/components/task-filters/task-filters.component.css`, `src/app/features/tasks/components/task-board/task-board.component.css`, `src/app/features/tasks/containers/task-page/task-page.component.css`, and `src/styles.css`
- [X] T100 [P] Remove or disconnect obsolete notification and custom confirm dialog usage after SweetAlert2 migration in `src/app/shared/components/notification/`, `src/app/shared/components/confirm-dialog/`, `src/app/core/services/notification.service.ts`, and `src/app/features/tasks/containers/task-page/task-page.component.ts`
- [X] T101 [P] Update README dependency, Material setup, SweetAlert2 feedback, board drag/drop, keyboard fallback, and validation documentation in `README.md`
- [X] T102 Run targeted Angular tests for alert facade, task board, task card, task filters, task page drag/drop, edit confirmation, delete confirmation, and create feedback using the scripts in `package.json`
- [ ] T103 Run the production build and execute the updated manual scenarios from `specs/001-task-management-frontend/quickstart.md`
