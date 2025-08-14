import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromUtils = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (err) {
    return true; // Assume expired if decode fails
  }
};

export const getUserRole = (token) => {
  try {
    debugger;
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (err) {
    return null;
  }
};

export const getUserEmail = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.email || null;
  } catch (err) {
    return null;
  }
};
export const getUserId = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.UserId || decoded.id || null; // adjust field name based on your backend
  } catch (err) {
    return null;
  }
};