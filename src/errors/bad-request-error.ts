import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string | any) {
    super(message);
  }

  generateErrors() {
    return [{ message: this.message }];
  }
}
