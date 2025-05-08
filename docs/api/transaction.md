## Transaction

> The `Transaction` is used to create transaction under the `Account`.

### Data model

| Attribute | Type   | Required? | Description                  |
|-----------|--------|-----------|------------------------------|
| `id`      | string | Required  | Unique identifier of the transaction  |
| `type`    | string | Required  | The type of transaction. Values are: `inward_transfer`, `outward_transfer`, `income`, `expense`             |
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

| Method | Endpoint name                                  | Description                         |
|--------|------------------------------------------------|-------------------------------------|
| GET    | [Get Transaction](#get-transacition)           | Retrieves a `Transaction`           |
| POST   | [Deposit to Account](#deposit-to-account)      | Creates a `Transaction`             |
| GET    | [Get All Transactions](#get-all-transactions)  | Retrieves an array of `Transaction` |

## Get Transacition

Retrieves transaction by unique identifier

### Endpoint

```text
GET /v1/accounts/{{accountId}}/transactions/{{transactionId}}
```

### Description

This retrieves the transaction under an account. The provided identifier will be used for cross verification

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

| Status code | Schema                                  | Description          |
|-------------|-----------------------------------------|----------------------|
| `200`       | [Transaction](#data-model)        | {Describe the result where the request succeeds.} |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | {Describe the result where the request fails with the specified error code.} |
| `404`       | [NotFoundError](./errors.md#notfounderror) | {Describe the result where the request fails with the specified error code.} |

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

This creates a deposit transaction to an account based on the unique identifier provided.

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
| `201`       | [Transaction](#data-model)        | {Describe the result where the request succeeds.} |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | {Describe the result where the request fails with the specified error code.} |
| `404`       | [NotFoundError](./errors.md#notfounderror) | {Describe the result where the request fails with the specified error code.} |

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
Retrieve all transaction on the account

### Endpoint
```text
GET /v1/accounts/{{accountId}}/transactions
```

### Description
This endpoints retrieves all the transactions under an account

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
| `200`       | [Transaction](#data-model)        | This returns a JSON "transactions: Transaction[]" |
| `400`       | [BadRequestError](./errors.md#badrequesterror) | {Describe the result where the request fails with the specified error code.} |
| `404`       | [NotFoundError](./errors.md#notfounderror) | {Describe the result where the request fails with the specified error code.} |

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
