
import { writable } from 'svelte/store';

interface User {
    id: string | null;
    email: string | null;
    created_at: string | null;
}

function createUserStore() {
  const { subscribe, set } = writable<User>({ id: null, email: null, created_at: null });

  // Function to initialize the store from localStorage, only runs on the client
  function initialize() {
    if (typeof window !== 'undefined') { // Check if running in a browser
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        set(JSON.parse(storedUser));
      }
    }
  }

    // New function to get the current user's id
  function getUserId() {
       let currentId: string | null = null;
        // Temporarily subscribe to get the current value and unsubscribe immediately
         const unsubscribe = subscribe(user => currentId = user.id);
         unsubscribe(); // Unsubscribe immediately after getting the value
        return currentId;
    }

  return {
    subscribe,
    setUser: (user: User) => {
      if (typeof window !== 'undefined') { // Check if running in a browser
        localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
      }
      set(user);
    },
    clearUser: () => {
      if (typeof window !== 'undefined') { // Check if running in a browser
        localStorage.removeItem('user'); // Clear user from localStorage
      }
      set({ id: null, email: null, created_at: null });
    },
    initialize,
  };
  

}


export const authStore = createUserStore();
authStore.initialize(); // Initialize the store on creation
















