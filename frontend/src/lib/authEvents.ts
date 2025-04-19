// Custom event for auth state changes
export const AUTH_STATE_CHANGED = 'authStateChanged';

export const notifyAuthStateChange = () => {
  // Dispatch a custom event
  window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGED));
  
  // Also dispatch storage event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'user',
    newValue: localStorage.getItem('user')
  }));
}; 