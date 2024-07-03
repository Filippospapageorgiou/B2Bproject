<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { orderStore } from '$lib/productStore';
    import Loader from "$lib/components/loader.svelte";
	import { goto } from '$app/navigation';
    import { authStore } from '$lib/authStore';
    import { Paginator } from '@skeletonlabs/skeleton';

    let isLoading:boolean = true;

    
    let paginationSettings = {
        page: 0,
        limit: 2,
        size: 0, 
        amounts: [5,10, 20]
    };
    

    onMount(async ()=>{
        const timeoutPromise = new Promise(resolve => setTimeout(resolve,1000));

        const dataPromise = supabase
            .from('orders')
            .select('*')
            .eq('user_id', $authStore.id)
            .order('created_at', { ascending: false })
            .then(({ data: orders, error }) => {
                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    orderStore.setOrders(orders);
                    paginationSettings.size = orders.length;
                }
            });
        await Promise.all([timeoutPromise, dataPromise]);
        isLoading = false;
    })
    let orders = $orderStore;
    let order_id:any;

    function handleViewOrder(order:any){
        order_id = order.order_id;
        goto(`/dashboard/${order_id}`);
    }


    
</script>


{#if isLoading}
    <div class="h-screen flex justify-center items-center">
        <Loader></Loader>
    </div>
{:else}
<section class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900">Your Orders</h1>
    <div class="mt-4 flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="table-container">
                    <table class="table table-hover">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                                <th scope="col" class="relative px-6 py-3"><span class="sr-only">View</span></th>
                            </tr>
                        </thead>
                        {#each orders.slice(paginationSettings.page * paginationSettings.limit, (paginationSettings.page + 1) * paginationSettings.limit) as order}
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order?.order_id}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order?.created_at).toLocaleDateString()}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{order?.status}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order?.comments}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button class="text-indigo-600 hover:text-indigo-900" on:click={() => handleViewOrder(order)}>View</button>
                                </td>
                            </tr>
                        </tbody>
                        {/each}
                    </table>
                </div>
                <Paginator bind:settings={paginationSettings} showFirstLastButtons="{false}" showPreviousNextButtons="{true}" />
            </div>
        </div>
    </div>
</section>
{/if}