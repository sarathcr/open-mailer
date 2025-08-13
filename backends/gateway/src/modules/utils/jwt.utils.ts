import * as jwt from 'jsonwebtoken';

// Secret key for signing the JWT (ensure it's stored securely in the .env file)
const secretKey = process.env.JWT_SECRET;

// Function to generate JWT token
export function generateJwtToken(
  payload: object,
  expiresIn: string = '30s',
): string {
  const options = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'], // Use the expiresIn passed as a parameter, defaulting to '1m'
  };

  // Create the JWT token with the provided payload
  return jwt.sign(payload, secretKey, options);
}

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
