export class TransactionType {
  public readonly value: "income" | "expense" | "transfer";

  private constructor(value: "income" | "expense" | "transfer") {
    this.value = value;
  }

  public static income(): TransactionType {
    return new TransactionType("income");
  }
  public static expense(): TransactionType {
    return new TransactionType("expense");
  }
  public static transfer(): TransactionType {
    return new TransactionType("transfer");
  }

  static _create(value: "income" | "expense" | "transfer") {
    return new TransactionType(value);
  }

  equals(other: TransactionType) {
    return other.value == this.value;
  }
}
