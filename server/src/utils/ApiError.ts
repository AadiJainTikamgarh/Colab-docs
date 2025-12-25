class ApiError extends Error {
  public data: any;
  public success: boolean;
  constructor(
    public statusCode: number,
    message: string = "Something went wrong",
    public errors: any = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
