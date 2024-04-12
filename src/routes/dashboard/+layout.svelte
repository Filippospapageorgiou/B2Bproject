<script lang="ts">
    import Authcheck from "$lib/components/Authcheck.svelte";
    import Appbar from "$lib/components/Appbar.svelte";
</script>

<Appbar></Appbar>
<Authcheck>
    <main>
        <slot />
    </main>
</Authcheck>
