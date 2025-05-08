## Errors

The {product} APIs use the following error types:

| Error Type                                  | HTTP Code | Description                                                      |
| ------------------------------------------- | --------- | ---------------------------------------------------------------- |
| [NotFoundError](#notfounderror)             | `404`     | Returned when a requested resource could not be found.           |
| [BadRequestError](#badrequesterror)         | `400`     | Returned when the request is malformed or contains invalid data. |
| [UnauthorizedError](#unauthorizederror)     | `401`     | Returned when authentication fails or is missing.                |
| [InternalServerError](#internalservererror) | `500`     | Returned when the server encounters an unexpected condition.     |


### NotFoundError
| Field     | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| `name`    | string | `"NotFoundError"` or `"AccountNotFoundError"`        |
| `message` | string | Describes the missing resource. |

#### Example
```json
{
  "name": "NotFoundError",
  "message": "The requested account with ID 'abc123' was not found."
}
```

### BadRequestError
| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `name`    | string | Always `"BadRequestError"`           |
| `message` | string | Explains why the request is invalid. |

#### Example
```json
{
  "name": "BadRequestError",
  "message": "The 'balance' field must be a positive number."
}
```

### UnauthorizedError
| Field     | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `name`    | string | Always `"UnauthorizedError"`                       |
| `message` | string | States why the request could not be authenticated. |

#### Example
```json
{
  "name": "UnauthorizedError",
  "message": "Authentication token is missing or invalid."
}
```

### InternalServerError
| Field     | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| `name`    | string | Always `"InternalServerError"`                      |
| `message` | string | A generic message about an unexpected server error. |

#### Example
```json
{
  "name": "InternalServerError",
  "message": "An unexpected error occurred. Please try again later."
}
```
