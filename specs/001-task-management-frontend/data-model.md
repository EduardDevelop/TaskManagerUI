# Data Model: Task Management Frontend

## Task

Represents one unit of work managed by the user.

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Server-generated stable identifier; read-only in the UI |
| `title` | string | yes | Trimmed before submission; 1-100 meaningful characters |
| `description` | string | no | At most 500 characters; may be absent or empty |
| `status` | TaskStatus | yes | One of `pending`, `in_progress`, `done` |
| `createdAt` | string timestamp | yes | Server-managed; read-only in the UI |
| `updatedAt` | string timestamp | yes | Server-managed; read-only in the UI |

## TaskStatus

| API value | User-facing label | Board column |
|---|---|---|
| `pending` | Pendiente | Pendiente |
| `in_progress` | En progreso | En progreso |
| `done` | Completada | Completada |

The implementation must validate incoming status values before rendering or
sending them. Status labels must be centralized so API values and user-facing
text cannot drift. A task may move to any other valid status column through the
board workflow, but every cross-column move requires confirmation before the
update request is sent.

## CreateTaskRequest

Contains only editable fields:

- `title`: trimmed meaningful text from 1 to 100 characters.
- `description`: optional text of at most 500 characters.
- `status`: a valid `TaskStatus`, defaulting to `pending`.

The request must not contain `id`, `createdAt`, or `updatedAt`.
Before sending a create request, the frontend must compare the normalized title
against the currently loaded task collection. Normalization trims surrounding
space and compares without case sensitivity. If a duplicate exists, the request
is blocked and the form remains open with a recoverable validation message.

## UpdateTaskRequest

Contains the editable task fields needed by the API contract. Full edit submits
`title`, optional `description`, and `status`; a status-only update may submit
the status plus any fields required by the external contract. The implementation
must preserve required server fields and must not manufacture IDs or timestamps.

## TaskFilter

A derived view criterion, not persistent task data:

- `searchTerm`: trimmed, case-insensitive text matched against task title/name.
- `status`: all, pending, in_progress, or done.
- `createdFrom`: optional calendar date; includes tasks created on or after this
  day.
- `createdTo`: optional calendar date; includes tasks created on or before this
  day.

The source task collection remains unchanged. A filtered empty result is
distinct from a globally empty task collection. A range with `createdFrom` after
`createdTo` is invalid, must show an inline recovery message, and must not be
presented as a valid filtered result.

## TaskBoard

A derived view of the authoritative task collection:

- `columns`: exactly three visible columns in the order pending, in_progress,
  done.
- `tasksByStatus`: filtered tasks grouped by current `status` without mutating
  the source collection.
- `dragMove`: a transient action containing task id, source status, target
  status, and original index/position context for restoration.

Dropping a task into the same status or outside a valid column is a no-op.
Dropping into another valid status asks for confirmation first. Cancellation,
API failure, or invalid target status leaves the task in its previous column.
Success replaces the task with the server-confirmed response.

## TaskMutationState

Tracks request feedback without changing domain data:

- `initialLoad`: loading, success, or error with retry.
- `formSubmit`: idle, saving, or error while preserving form values.
- `deleteTaskId`: the task currently being deleted, if any.
- `statusTaskId`: the task currently changing status by board move, if any.
- `alert`: confirmation, success, error, or information modal state managed by
  a reusable alert facade.

Only the affected task action should be disabled for deletion or status changes;
other unrelated list actions remain usable where safe.

## Relationships and invariants

- The task page owns one authoritative `Task[]` collection.
- `TaskFilter` derives a visible collection from `Task[]`.
- `TaskBoard` derives three visible columns from filtered tasks.
- A successful create appends or reloads the server-confirmed task, exits create
  mode, and renders the main task board.
- A successful edit update replaces the matching task with the server response
  only after the user confirms the update.
- A successful status move replaces the matching task with the server response
  only after the user confirms the board drop.
- A successful delete removes the matching task only after confirmation.
- A failed mutation leaves the prior task representation intact.
- A cancelled edit, delete, or status move sends no API request.
- A create request with a duplicate normalized title is blocked before the
  service call when the duplicate is present in the loaded collection.
- If a task is no longer found during edit, delete, or status update, the page
  clears stale selection when applicable and offers a list refresh.
