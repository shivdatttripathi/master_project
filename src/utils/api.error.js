// class ApiError {
//   constructor(
//     statusCode,
//     message = "somthing went wrong",
//     error = [],
//     stack = ""
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.message = message;
//     this.success = false;
//     this.errors = error;
//   }
// }
// export { ApiError };

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = this.errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
