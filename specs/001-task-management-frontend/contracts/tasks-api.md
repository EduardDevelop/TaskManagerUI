# External Contract: Tasks API

The frontend consumes the existing task service. The base URL is configurable;
the paths below are relative to that base URL. The example development base URL
is `http://localhost:3000/api`.

## Task representation

```json
{
  "id": "1",
  "title": "Completar prueba técnica",
  "description": "Finalizar el frontend Angular",
  "status": "in_progress",
  "createdAt": "2026-07-30T15:00:00.000Z",
  "updatedAt": "2026-07-30T17:00:00.000Z"
}
```

Allowed status values are `pending`, `in_progress`, and `done`.

## Operations

| Method | Path | Request body | Successful response |
|---|---|---|---|
| GET | `/tasks` | none | JSON array of Task |
| GET | `/tasks/:id` | none | JSON Task |
| POST | `/tasks` | title, optional description, status | JSON created Task |
| PUT | `/tasks/:id` | editable task fields required by service | JSON updated Task |
| DELETE | `/tasks/:id` | none | successful empty or message response |

The frontend must construct `:id` safely and must not send server-generated
`id`, `createdAt`, or `updatedAt` values in create/update bodies.

## Error mapping contract

| Condition | User-facing behavior |
|---|---|
| 400 | Explain that submitted data is invalid and preserve form values |
| 404 | Explain that the task is missing and offer list refresh where relevant |
| 500 or other server failure | Explain that the server failed and offer retry |
| Network failure | Explain that the service cannot be reached |
| Timeout | Explain that the request took too long and offer retry |
| Unknown response | Show a safe generic message without technical traces |

Every request must release its loading state on both success and failure.

## UI contracts

- The task page supplies task data and operation state to presentational surfaces
  through typed inputs.
- The task board receives grouped task data and emits typed edit, delete, and
  status-drop events; it does not access this external contract directly.
- The task filters receive and emit typed search, status, date-range, clear, and
  validation events; they do not access this external contract directly.
- Presentational surfaces emit typed edit, delete, status-drop, keyboard status,
  submit, and cancel events; they do not access this external contract directly.
- A successful mutation returns server-confirmed data before the board changes.
- A failed mutation does not remove a task or permanently change its status.
- Edit, delete, and status-drop confirmations must occur before the corresponding
  PUT or DELETE operation is invoked.
- SweetAlert2 integration is owned by a core alert facade; presentational
  components and API services must not invoke modal APIs directly.
