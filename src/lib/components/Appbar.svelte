<script lang="ts">
    import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
    import type { DrawerSettings, DrawerStore } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import { authStore } from '$lib/authStore';
    import { goto } from '$app/navigation';
    import { initializeStores } from '@skeletonlabs/skeleton';
    

    initializeStores();
    let dropdownOpen=false;
    const drawerStore = getDrawerStore();

    const drawerSettings: DrawerSettings = {
	      id: 'example-3',
	      bgDrawer: 'bg-gradient-to-tr from-indigo-500/50 via-blue-800/50 to-blue-400/50',
	      width: 'w-[200px] md:w-[280px]',
        shadow: 'shadow-lg',
      };

      function openDrawer() {
        // Open the drawer with the specified settings
        drawerStore.open(drawerSettings);
      }

      function closeDrawer() {
        // Close the drawer with the specified settings
        drawerStore.close();
      }
  


    function logout() {
        authStore.clearUser(); // Clear user data from the store
        unsubscribe(); // Unsubscribe from the authentication store
        goto('/');
    }

    let unsubscribe: () => void;

    onMount(() => {
        unsubscribe = authStore.subscribe(() => {
        });
    });
</script>

<Drawer />
<header class="text-gray-600 body-font shadow-md">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <div class="relative w-full md:w-auto">
        <button on:click={openDrawer} class="flex items-center text-base justify-center hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
          <div class={`absolute ${dropdownOpen ? 'block' : 'hidden'} bg-white shadow-md mt-2 w-full md:w-auto`}>
            <a href="/dashboard" class="block px-4 py-2 text-gray-800 hover:bg-primary-500">Home</a>
            <a href="/dashboard/checkout" class="block px-4 py-2 text-gray-800 hover:bg-primary-500">CheckOut</a>
            <a href="/dashboard/orders" class="block px-4 py-2 text-gray-800 hover:bg-primary-500">Orders</a>
          </div>
        </div>
      <a href="/" class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400  flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <img src="/favicon.png" alt="favicon" class="w-8 h-8 md:w-auto md:h-auto">
          <span class="ml-3 text-xl">B2B Order Hub</span>
        </a>  
      <div class="flex justify-center items-center gap-4">
          <button on:click={logout} class="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-1 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 h-10">
          Log out
        </button>
        <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
         </div>
      </div>  
  </div>
</header>

<Drawer settings={drawerSettings}>
  <div class="flex flex-col p-4 space-y-4">
    <div class="text-white text-2xl hover:text-indigo-300 transition-colors duration-200">
      <a on:click={closeDrawer} href="/dashboard">Home</a>
    </div>
    <div class="border-t border-gray-300"></div>
    <div class="text-white text-2xl hover:text-indigo-300 transition-colors duration-200">
      <a on:click={closeDrawer} href="/dashboard/checkout">CheckOut</a>
    </div>
    <div class="border-t border-gray-300"></div>
    <div class="text-white text-2xl hover:text-indigo-300 transition-colors duration-200">
      <a on:click={closeDrawer} href="/dashboard/orders">Orders</a>
    </div>
  </div>
</Drawer>


  