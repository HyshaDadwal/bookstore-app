import { jwtDecode } from "jwt-decode";

/**
 * Get the full user object from the JWT token
 */
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      id: decoded.userId,
      email: decoded.sub,
      role: decoded.role,
    };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

/**
 * Check if the user is currently logged in with a valid token
 */
export const isLoggedIn = () => {
  return getUserFromToken() !== null;
};

/**
 * Get the current user's ID from the token
 */
export const getUserId = () => {
  const user = getUserFromToken();
  return user ? user.id : null;
};

/**
 * Get the current user's role from the token
 */
export const getUserRole = () => {
  const user = getUserFromToken();
  return user ? user.role : null;
};

/**
 * Logout: clear token from localStorage
 */
export const logout = () => {
  localStorage.removeItem("token");
};
