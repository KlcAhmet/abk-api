export class CustomError {
  message: string;
  name: string;
  stack: string;

  constructor(functionName: string, message?: string, statusCode?: number) {
    console.log(`Custom Error in ${functionName}: ${statusCode} - ${message}`);
  }
}
