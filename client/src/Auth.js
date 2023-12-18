export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if a token is present
}

export function clearAuthTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}