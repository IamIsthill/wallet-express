export class NotImplemented extends Error {
  constructor(message = "This is not implemented yet") {
    super(message);
    this.name = "NotImplemented";
  }
}
