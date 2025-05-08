## Account

The Account is used to access the accounts of the user in the system

### Data model

| Attribute     | Type                                               | Required? | Description                                      |
|---------------|----------------------------------------------------|-----------|--------------------------------------------------|
| `id`          | `string`                                           | Yes       | Unique identifier of the account                 |
| `name`        | `string`                                           | Yes       | Name of the account                              |
| `balance`     | `number`                                           | Yes       | The current balance of the account               |
| `transactions`| `string[]` or [`Transaction[]`](#transaction-model) | Yes       | List of transaction IDs or full transaction data |

### Example
#### With Transaction IDs
#### With Full Transactions
```text
{Provide an example of the data representation in the format that your project use.}
```

### Endpoints

Use the following endpoints to interact with the {resource name} entities.

| Method | Endpoint name                            | Description             |
|--------|------------------------------------------|-------------------------|
| POST   | [Create Account](#create-account)        | Creates an `Account`.   |
| GET    | [Get Account](#get-account)              | Retrieves an `Account`. |
| DELETE | [Delete Account](#delete-account)        | Deletes an `Account`.   |
| PATCH  | [Update Account](#update-account)        | Updates an `Account`    |

## Create Account

Creates an account

### Endpoint

```http
POST /v1/accounts
```

### Description

This creates an account in the system. Ensure that the balance is greater than zero upon creation

### Authorization

The [{authorization method}](#authorization) is required for each API request.

{This paragraph is optional.} Calling this endpoint also requires the {permission-name} permission.

### Request schema

#### Header parameters
| Header Parameter | Type   | Required? | Description                                   |
| ---------------- | ------ | --------- | --------------------------------------------- |
| `Content-Type`   | string | Required       | Must be `application/json`                    |


#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| `name`   | string | Required  | Name of the account  |
| `balance` | number | Required  | Starting balance of the account               |

### Request example

```json
{
  "name": "Emergency Fund",
  "balance": 1000.0
}
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `201`       | [Account](#data-model)        | Resource was successfully created |
| `404`       | [BadRequestError](./errors.md#badrequesterror) | There is an error in the payload |

### Response example

```json
{
    "id": "340d9968-e399-4d40-ab71-ec0934d46e65",
    "name": "Emergency Fund",
    "balance": "1000",
    "transactions": []
}
```

## Delete Account

Deletes an account by `accountId`

### Endpoint

```text
DELETE /v1/accounts/{{accountId}}
```

### Description

This deletes an account using the `accountId`

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| accountId           | string | Required  | Unique identifier of the account  |


### Request example

```text
DELETE /v1/accounts/340d9968-e399-4d40-ab71-ec0934d46e65
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `204`       | `No Schema`       | Resource was successfully removed |
| `404`       | [NotFoundError](./errors.md#notfounderror)| No resource was found matching the provided ID|
| `400`       | [BadRequestError](./errors.md#badrequesterror) | The provided ID is invalid or malformed |

## Get Account

Retrieves an account by `accountId`

### Endpoint

```text
GET /v1/accounts/{{accountId}}
```

### Description
Fetches a specific account using its unique identifier.

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| accountId           | string | Required  | Unique identifier of the account  |


### Request example

```text

GET /v1/accounts/340d9968-e399-4d40-ab71-ec0934d46e65
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `200`       | [Account](#data-model)       | Resource was successfully retrieved |
| `404`       | [NotFoundError](./errors.md#notfounderror)| No resource was found matching the provided ID|
| `400`       | [BadRequestError](./errors.md#badrequesterror) | The provided ID is invalid or malformed |

### Response example

Returns an `Account` object.
See [Account Data Model](#data-model) for the structure,and [With Transaction Ids](#with-transaction-ids) for example.



## Update Account

Updates an account by `accountId`

### Endpoint

```text
PATCH /v1/accounts/{{accountId}}
```

### Description
Fetches a specific account using its unique identifier.

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| accountId           | string | Required  | Unique identifier of the account  |


### Request example

```text

GET /v1/accounts/340d9968-e399-4d40-ab71-ec0934d46e65
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `200`       | [Account](#data-model)       | Resource was successfully retrieved |
| `404`       | [NotFoundError](./errors.md#notfounderror)| No resource was found matching the provided ID|
| `400`       | [BadRequestError](./errors.md#badrequesterror) | The provided ID is invalid or malformed |

### Response example

Returns an `Account` object.
See [Account Data Model](#data-model) for the structure,and [With Transaction Ids](#with-transaction-ids) for example.
