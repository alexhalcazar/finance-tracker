/**
 * Logs out the user by removing the JWT token from storage
 * @returns {void}
 */
export const logout = () => {

  // Remove from localStorage
  localStorage.removeItem('accessToken');
  
  // If storing tokens in sessionStorage, remove from there 
  sessionStorage.removeItem('accessToken');
  
  // If using cookies, you'd need to clear them as well
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  //Clear any other user-related data
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken'); // if applicable
};

/**
 * Checks if user is authenticated by checking for token
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// Save token if necessary 
export const saveToken = () => {
  const token = localStorage.setItem('accessToken');
  return !!token;
};

/**
 * Gets the stored access token
 * @returns {string | null}
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};