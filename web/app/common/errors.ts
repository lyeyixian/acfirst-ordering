export class NoCartFoundError extends Error {
  constructor(msg: string) {
      super(msg);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, NoCartFoundError.prototype);
  }
}
