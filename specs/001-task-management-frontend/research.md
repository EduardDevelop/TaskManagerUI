# Research: Task Management Frontend

## Decision 1: Keep feature state local to the task page

**Decision**: Use one authoritative task collection in the task container, with
explicit loading, mutation, error, selected-task, form, and filter state.

**Rationale**: The scope is one screen and a small in-memory collection. This
meets the constitution's simplicity rule and avoids introducing a global state
library whose lifecycle and boilerplate would exceed the problem.

**Alternatives considered**:

- A third-party global store: rejected because no cross-feature state or
  demonstrated coordination problem exists.
- A service-owned global task store: rejected because it would duplicate the
  container's orchestration responsibility for this feature size.

## Decision 2: Preserve the existing standalone Angular application and route

**Decision**: Keep the standalone application, root route, SSR build configuration,
and Angular CLI test runner already present. Organize task code under the
constitution-aligned feature boundaries during implementation.

**Rationale**: This minimizes migration risk while fixing the current technical
organization. SSR is retained as existing project configuration but is not
expanded as a feature requirement.

**Alternatives considered**:

- Rebuild the application from scratch: rejected because the repository already
  contains working task models, service, page, and child components.
- Add another application or route: rejected because the feature needs one task
  workflow and the existing root route is sufficient.

## Decision 3: Use the existing REST contract with a typed service boundary

**Decision**: Keep all task HTTP access in `TaskService`, using environment-backed
configuration, typed request/response contracts, and a bounded request timeout.

**Rationale**: This satisfies the constitution's exclusive API-access rule and
isolates the existing backend contract from presentational components.

**Alternatives considered**:

- HTTP calls from the page or form: rejected because it violates separation of
  concerns and makes behavior harder to test.
- Promise-based data access: rejected because the existing application and
  constitution require Observable workflows and cancellation/lifecycle control.

## Decision 4: Confirm server state before mutating the visible list

**Decision**: Apply create, update, delete, and status results only after the
external service confirms success. Restore or retain the previous task state on
failure.

**Rationale**: This avoids inconsistent optimistic UI state and directly covers
the deletion and status failure requirements.

**Alternatives considered**:

- Optimistic deletion or status changes: rejected because failed requests would
  temporarily present unsupported state and require rollback complexity.
- Always reload after every mutation: acceptable as a fallback, but direct use
  of the confirmed response is simpler; reload remains the recovery path when a
  mutation reports that a task no longer exists or when a refresh is needed.

## Decision 5: Use SweetAlert2 through a reusable accessible feedback facade

**Decision**: Provide reusable loading indicators and route all confirmation,
success, information, and error dialogs through a typed core alert facade backed
by SweetAlert2. Use localized task indicators for deletion and board status
updates, and preserve form data on failed submissions.

**Rationale**: The constitution requires visible, accessible feedback without
blocking the whole interface and requires explicit confirmation for deletion.

**Alternatives considered**:

- Browser-native confirmation only: rejected because the requested UX requires
  polished, consistent modal confirmations and success/error feedback.
- Direct `Swal.fire` calls from components: rejected because it scatters modal
  behavior, hurts testability, and conflicts with the smart/presentational
  boundary.
- One global spinner: rejected because it hides which task is busy and blocks
  unrelated actions.

## Decision 6: Treat search and filtering as a second delivery slice

**Decision**: Implement required CRUD and status workflows first; then derive
filtered results from the immutable task collection using trimmed,
case-insensitive task-name text, an explicit status filter, and an inclusive
creation-date range selected with calendar-style controls.

**Rationale**: The specification prioritizes mandatory operations and requires
filters not to mutate or interfere with the source collection.

**Alternatives considered**:

- Server-side search: rejected because the expected dataset is small and no
  server search contract is specified.
- Persisting filtered results as state: rejected because it creates a second
  source of truth and complicates mutation updates.
- Adding a date library: rejected unless native date input parsing proves
  insufficient, because the required filtering only compares calendar-day
  boundaries from existing server timestamps.
- Keeping native inputs and custom CSS only: rejected because the current filter
  layout is visually inconsistent and the requested UX calls for a mature UI
  component library.

## Decision 8: Use Angular Material and CDK for polished filters and board moves

**Decision**: Add Angular Material/CDK packages compatible with Angular 19. Use
Material form fields, inputs, selects, datepicker/date-range controls, buttons,
icons, and chips for filters and high-signal controls. Use Angular CDK DragDrop
for moving cards between the three status columns.

**Rationale**: Angular Material improves visual consistency, labels, spacing,
focus states, and mobile wrapping, while CDK DragDrop provides a tested
primitive for transferring items between lists without hand-rolled pointer
logic.

**Alternatives considered**:

- Hand-built drag/drop and custom date fields: rejected because it increases
  interaction risk and would spend time recreating behavior maintained by the
  Angular ecosystem.
- A heavier external Kanban board library: rejected because the domain needs
  exactly three simple state columns and should keep state local.

## Decision 9: Replace selector-based status changes with board drag/drop

**Decision**: Render tasks in three derived columns: Pendiente, En progreso, and
Completada. A cross-column drop opens a SweetAlert2 confirmation before the PUT
request. Cancellation or failure restores the prior column; success uses the
server-confirmed response. Provide a keyboard-accessible fallback action for
status changes.

**Rationale**: The board makes task state visible and lets users change progress
through the requested mouse drag interaction while preserving the constitution's
requirements for typed updates, confirmation, rollback, and accessibility.

**Alternatives considered**:

- Keep the status selector next to each card: rejected because the requested
  workflow is drag between columns.
- Optimistically persist the new column before confirmation: rejected because it
  can imply a successful update before the user confirms or the server responds.

## Decision 7: Block duplicate task titles before create requests

**Decision**: Normalize titles by trimming surrounding whitespace and comparing
without case sensitivity against the currently loaded collection before sending
a create request. Preserve the backend as the final authority for concurrent
duplicate rejection.

**Rationale**: The user can otherwise create repeated tasks when a successful
create leaves them uncertain. A frontend guard gives immediate feedback and
prevents avoidable duplicate POST requests while still respecting server truth.

**Alternatives considered**:

- Rely only on backend uniqueness: rejected because it allows avoidable duplicate
  attempts and gives slower feedback.
- Compare exact titles only: rejected because whitespace and case differences
  would still create confusing duplicates.

## Resolved Unknowns

No unresolved `NEEDS CLARIFICATION` items remain. The repository establishes the
Angular, TypeScript, RxJS, Karma, and Jasmine versions; the constitution
establishes the architecture and quality constraints; and the feature
specification establishes the user-visible behavior and external task contract.
