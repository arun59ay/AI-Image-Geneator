export class AppError extends Error {
  constructor(message, name = 'AppError') {
    super(message);
    this.name = name;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 'ValidationError');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 'UnauthorizedError');
  }
}

export class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 'ForbiddenError');
  }
}