## Transaction

> Represents a financial transaction performed under an `Account`.

### Data model

| Attribute | Type   | Required? | Description                  |
|-----------|--------|-----------|------------------------------|
| `id`      | string | Required  | Unique identifier of the transaction  |
| `type`    | string | Required  | The type of transaction. Allowed values: `inward_transfer`, `outward_transfer`, `income`, `expense`             |
|      `amount`     |    number    |      Required     |           The amount undergone in transaction                   |
|      `accountId`     |    string    |      Required     |           The account who performed the transaction                  |
|      `targetAccountId`     |    string    |      Optional     |      Required only for `inward_transfer` and `outward_transfer` transactions. It refers to the target account.            |

### Example

```json
{
    "id": "sample-id",
    "type": "inward_transfer",
    "amount": 100,
    "accountId": "acct-id",
    "targetAccountId": "target-acct-id"
}
```

### Endpoints

Use the following endpoints to interact with the `Transaction` entities.

| Method | Endpoint name                                   | Description                         |
|--------|-------------------------------------------------|-------------------------------------|
| GET    | [Get Transaction](#get-transacition)            | Retrieves a `Transaction`           |
| POST   | [Deposit to Account](#deposit-to-account)       | Creates a income `Transaction`      |
| GET    | [Get All Transactions](#get-all-transactions)   | Retrieves an array of `Transaction` |
| POST   | [Withdraw from Account](#withdraw-from-account) | Creates an expense `Transaction`    |

## Get Transacition

Retrieves transaction by unique identifier

### Endpoint

```text
GET /v1/accounts/{{accountId}}/transactions/{{transactionId}}
```

### Description

This endpoint fetches the details of a transaction associated with a specific account. The transactionId is cross-verified against the provided accountId to ensure ownership and validity.

### Authorization

The [{authorization method}](#authorization) is required for each API request.

{This paragraph is optional.} Calling this endpoint also requires the {permission-name} permission.

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| `accountId`          | string | Required  | Unique identifier of account  |
| `transactionId`          | string | Required  | Unique identifier of the transaction  |


### Request example

```http
POST /v1/accounts/77bd441d-95ed-4cc4-a923-791e2ae73835/transactions/afe1efb3-b96f-4622-bc92-70a61ccd33f5

```

### Response schema

| Status Code | Schema                                         | Description                                              |
| ----------- | ---------------------------------------------- | -------------------------------------------------------- |
| `200`       | [Transaction](#data-model)                     | Transaction retrieved successfully.                      |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | The request is invalid or contains malformed parameters. |
| `404`       | [NotFoundError](./errors.md#notfounderror)     | The transaction or account could not be found.           |

### Response example

```json
{
  "id": "2d53b0d9-8214-4d18-824b-f80cf9de3437",
  "type": "income",
  "amount": 200,
  "accountId": "77bd441d-95ed-4cc4-a923-791e2ae73835"
}
```

## Deposit to Account

Create a deposit transaction

### Endpoint

```text
POST /v1/accounts/{{accountId}}/deposit
```

### Description

This endpoint creates a deposit transaction and adds the specified amount to the account's balance. The account is identified by the accountId path parameter.

### Authorization

The [{authorization method}](#authorization) is required for each API request.

{This paragraph is optional.} Calling this endpoint also requires the {permission-name} permission.

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| `accountId`          | string | Required  | Unique identifier of account  |



#### Header parameters
| Header Parameter | Type   | Required? | Description                                   |
| ---------------- | ------ | --------- | --------------------------------------------- |
| `Content-Type`   | string | Required       | Must be `application/json`                    |

#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| `depositAmount`  | number | Required  | Amount to be deposited by user  |

### Request example

```http
POST /v1/accounts/77bd441d-95ed-4cc4-a923-791e2ae73835/deposit
Content-Type: application/json

{
    "depositAmount": 200
}
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `201`       | [Transaction](#data-model)        | Deposit transaction created successfully. |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | Invalid request body or business rule violation. |
| `404`       | [NotFoundError](./errors.md#notfounderror) | Account not found for the provided accountId. |

### Response example

```json
{
  "id": "2d53b0d9-8214-4d18-824b-f80cf9de3437",
  "type": "income",
  "amount": 200,
  "accountId": "77bd441d-95ed-4cc4-a923-791e2ae73835"
}
```

## Get All Transactions
Retrieves all transactions associated with a specific account.

### Endpoint
```text
GET /v1/accounts/{{accountId}}/transactions
```

### Description
This endpoint returns a list of all transactions (income, expense, etc.) recorded under a given account. The accountId path parameter is used to identify the account.

### Request schema

#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| `accountId`          | string | Required  | Unique identifier of account  |

### Request example

```http
GET /v1/accounts/77bd441d-95ed-4cc4-a923-791e2ae73835/
```

### Response schema

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `200`       | {transactions: [Transaction](#data-model)[]} | Returns all transactions under the specified account |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | Invalid input or request format. |
| `404`       | [NotFoundError](./errors.md#notfounderror) | The specified account was not found. |

### Response Example

```json
{
  "transactions": [
    {
      "id": "2d53b0d9-8214-4d18-824b-f80cf9de3437",
      "type": "income",
      "amount": 200,
      "accountId": "77bd441d-95ed-4cc4-a923-791e2ae73835"
    },
    {
      "id": "cb7f6fea-881a-447b-8c16-9534382fd02e",
      "type": "income",
      "amount": 200,
      "accountId": "77bd441d-95ed-4cc4-a923-791e2ae73835"
    }
  ]
}
```

## Withdraw From Account
Creates an expense transaction

### Endpoint
```
POST /v1/accounts/{{accountId}}/withdraw
```

### Description
This endpoint uses the `accountId` to look up the corresponding account. It then creates a transaction of type `expense` by withdrawing a specified amount. The account's `balance` is validated to ensure it has sufficient funds before the transaction is committed.

### Request Schema
#### Path parameters

| Path parameter | Type   | Required? | Description                  |
|----------------|--------|-----------|------------------------------|
| `accountId`          | string | Required  | Unique identifier of account  |

#### Header parameters
| Header Parameter | Type   | Required? | Description                                   |
| ---------------- | ------ | --------- | --------------------------------------------- |
| `Content-Type`   | string | Required       | Must be `application/json`                    |

#### Request body

| Field  | Type   | Required? | Description                      |
|--------|--------|-----------|----------------------------------|
| `withdrawAmount`  | number | Required  | Amount to be withdrawn by user  |

### Request example
```http
POST /v1/accounts/77bd441d-95ed-4cc4-a923-791e2ae73835/withdraw
Content-Type: application/json

{
    "withdrawAmount": 200,
}
```

### Response schema

| Status Code | Schema                                         | Description                                     |
| ----------- | ---------------------------------------------- | ----------------------------------------------- |
| `201`       | [Transaction](#data-model)                     | The transaction was successfully created.       |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | The request was malformed or validation failed. |
| `404`       | [NotFoundError](./errors.md#notfounderror)     | The specified account was not found.            |

### Response example

```json
{
  "id": "2d53b0d9-8214-4d18-824b-f80cf9de3437",
  "type": "expense",
  "amount": -200,
  "accountId": "77bd441d-95ed-4cc4-a923-791e2ae73835"
}
```

