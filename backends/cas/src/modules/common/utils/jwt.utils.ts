import * as jwt from 'jsonwebtoken';

// Secret key for signing the JWT (ensure it's stored securely in the .env file)
const secretKey = process.env.JWT_SECRET;

// Function to verify JWT token
export function verifyJwtToken(token: string) {
  try {
    // Verify the token and return the decoded payload
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error(`Invalid or expired token: ${error.message || error}`);
  }
}
