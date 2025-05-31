import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Not Authorized!");
  }

  generateErrors() {
    return [{ message: "Not Authorized" }];
  }
}
