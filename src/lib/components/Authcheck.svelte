<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/authStore';
  import Error from '$lib/components/Error.svelte';

  let isAuthenticated: boolean = false;

  // Subscription to authStore to check user authentication status
  const unsubscribe = authStore.subscribe(($authStore) => {
    isAuthenticated = $authStore.id !== null;
  });

  onMount(() => {
    return () => {
      unsubscribe();
    };
  });
</script>

{#if isAuthenticated}
<slot />
{:else}
<Error />
{/if}
