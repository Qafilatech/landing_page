import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error occurred:", err); // Log the error for debugging

  // Customize the error response based on the type of error
  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message, details: err.details });
  } else if (err.message === "INVALID_CREDENTIALS") {
    res.status(401).json({ message: "Invalid email or password" });
  } else if (err.message === "EMAIL_ALREADY_EXISTS") {
    res.status(409).json({ message: "Email already exists" });
  } else if (err.message === "UNAUTHORISED") {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    // Default error response for unhandled errors
    res.status(500).json({ message: "Internal Server Error", details: err.message });
  }

  // Important: Call next() to potentially pass the error to the default Express error handler (though we're handling the response here)
  next();
};