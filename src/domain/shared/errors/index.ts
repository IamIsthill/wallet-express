export class DomainError extends Error {
    constructor(message: string){
        super(message)
        this.name = 'DomainError'
    }
}


  export class InvalidAmountError extends DomainError {
    constructor() {
      super('Amount must be greater than zero')
      this.name = 'InvalidAmountError'
    }
  }
  
  export class NegativeBalanceError extends DomainError {
    constructor() {
      super('Balance cannot be less than zero')
      this.name = 'NegativeBalanceError'
    }
  }
  
  export class InsufficientFundsError extends DomainError {
    constructor() {
      super('Insufficient funds')
      this.name = 'InsufficientFundsError'
    }
  }
  export class InvalidTransferTargetError extends DomainError {
    constructor() {
      super('Transferring to the same account is not allowed')
      this.name = 'InvalidTransferTargetError'
    }
  }
  
  export class MissingTargetAccountError extends DomainError {
    constructor() {
      super('Target transfer account id must be set for transfer transactions')
      this.name = 'MissingTargetAccountError'
    }
  }
  
  export class TransactionNotFoundError extends DomainError {
    constructor(transactionId: string) {
      super(`Transaction with ID '${transactionId}' not found`)
      this.name = 'TransactionNotFoundError'
    }
  }

  export class TargetAccountNotAllowedError extends DomainError {
    constructor() {
      super('Only transfer transactions can have a targetAccountId')
      this.name = 'TargetAccountNotAllowedError'
    }
  }
  
  
  