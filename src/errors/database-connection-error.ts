import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super("Database connection error!");
  }

  generateErrors(): { message: string; field?: string }[] {
    return [{ message: "Database connection error!" }];
  }
}
