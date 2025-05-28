// decodeToken.js
import {jwtDecode} from 'jwt-decode';
// Function to decode JWT
const decodeToken = (token) => {
  if (!token) {
    console.error("No token provided");
    return null;
  }
  try {
    // Decoding the token without verifying it
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};
export default decodeToken; 