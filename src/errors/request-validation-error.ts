import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Invalid request!");
  }

  generateErrors() {
    return this.errors.map((error) => {
      console.log(this.errors);
      return {
        message: error.msg,
        field: error.type === "field" ? error.path : "",
      };
    });
  }
}
