<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { page } from '$app/stores';
    import { authStore } from '$lib/authStore';
    import { get } from 'svelte/store';
    import { Modal, getModalStore, type ModalSettings,Toast , getToastStore } from '@skeletonlabs/skeleton';
    import { initializeStores } from '@skeletonlabs/skeleton';
	  import Loader from "$lib/components/loader.svelte";
    import { v4 as uuidv4 } from 'uuid';


    initializeStores();
    const toastStore = getToastStore();
    const modalStore = getModalStore();
    let orderDetails: any;
    let orderItems: any[] = [];
    let enrichedOrderItems: any[] = [];
    let isLoading = true;
    let order_id: any;

    $: order_id = $page.params.order_id; // If using SvelteKit dynamic routing

    onMount(async () => {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', order_id)
            .single();

        if (orderError) {
            console.error('Error fetching order:', orderError);
            return;
        }

        orderDetails = order;

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order_id);

        if (itemsError) {
            console.error('Error fetching order items:', itemsError);
            return;
        }
        orderItems = items;

        // Fetch product details for each item
        const fetchProductDetailsPromises = orderItems.map(async (item: any) => {
            const { data: productDetails, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('product_id', item.product_id)
                .single();

            if (productError) {
                console.error('Error fetching product details:', productError);
                return item;
            }

            enrichedOrderItems = [...enrichedOrderItems, { ...item, productDetails }];
        });

        await Promise.all(fetchProductDetailsPromises); // Wait for all promises to resolve
        isLoading = false;
    });

    function downloadOrder(orderDetails:any,enrichedOrderItems:any, format = 'csv') {
    let dataStr = '';
    const delimiter = format === 'csv' ? ',' : '\t'; // Comma for CSV, tab for TXT
    // Add headers for order details and item details
    const headers = [
        'Order ID',
        'Order Date',
        'Order Status',
        'Comments',
        'Product Name',
        'Quantity',
        'Price per Item',
        'Subtotal'
    ];

    // Start with the order details
    let csvContent = headers.join(delimiter) + '\n';

    // Iterate over each item to add its details
    enrichedOrderItems.forEach((item:any) => {
        const itemDetails = [
            orderDetails.order_id,
            orderDetails.created_at, // Consider formatting this date
            orderDetails.status,
            `"${orderDetails.comments}"`, // Wrap in quotes to handle commas
            `"${item.productDetails.name}"`,
            item.quantity,
            item.productDetails.price,
            (item.quantity * item.productDetails.price).toFixed(2) // Subtotal
        ];
        csvContent += itemDetails.join(delimiter) + '\n';
    });

        // Add total sum at the end
        const totalSum = enrichedOrderItems.reduce((total:any, item:any) => {
        return total + (item.quantity * item.productDetails.price);
        }, 0).toFixed(2);

        csvContent += delimiter.repeat(7) + `Total: ${totalSum}`;

         // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `order_${orderDetails.order_id}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    $:totalSum = enrichedOrderItems.reduce((total,item)=>{
        return total + (item.quantity * item.productDetails.price);
    },0).toFixed(2);



    function confirmCheckout():Promise<boolean>{
      return new Promise<boolean>((resolve)=>{
          const modal: ModalSettings = {
            type: 'confirm',
            title:'Please confirm',
            body:'Are you sure you want to checkout?',
            response:(response:boolean)=> resolve(response)
          }
          modalStore.trigger(modal);
      });
    }

    async function finalizeCheckout() {
    const confirmed = await confirmCheckout();
    if (!confirmed) {
      toastStore.trigger({
        message: 'Checkout cancelled!',
        background: 'variant-ghost-error',
      });
      return; // Make sure to return here to stop further execution
    }

    isLoading = true;
    

    const userId = $authStore?.id; // Ensure this correctly fetches the user's ID
   
    if (userId) {
      try {
        const { data: insertResult, error: insertError } = await supabase
              .from('orders')
              .insert({ user_id: userId,status: 'Completed',created_at: new Date(),comments:orderDetails.comments});
        
        if (!insertError) {
                const { data: mostRecentOrder, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

          const order_id = mostRecentOrder?.order_id;
          for(const item of orderItems){
              const { data: insertResult, error: insertError } = await supabase
              .from('order_items')
              .insert({item_id:uuidv4(),order_id: order_id,product_id: item.product_id,quantity: item.quantity,price: item.price});
          }
        }
        toastStore.trigger({
          message: 'Checkout successful!',
          background: 'variant-ghost-success', // Adjust the message and background as needed
        });
      } catch (error) {
        toastStore.trigger({
          message: 'Checkout failed. Please try again.',
          background: 'variant-ghost-error',
        });
      } finally {
        isLoading = false;
      }
    }  else{
      isLoading = false;
    }
  }
</script>

<Modal />
<Toast />
{#if isLoading}
    <div class="h-screen flex justify-center items-center">
        <Loader />
    </div>
{:else}
<section class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
   <div class="card card-hover bg-inherit px-8 py-4"> 
     <div class="mb-8">
      <div class="flex flex-row mb-6 gap-2">
        <h1 class="text-2xl font-bold text-gray-900">Order Summary</h1>
        <button class=" ml-2 mt-1" on:click="{() => downloadOrder(orderDetails,enrichedOrderItems,'csv')}">
            <img src="/logo.png" alt="Download" width="34" height="34" class="hover:animate-pulse">
        </button>
      </div>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 grid grid-cols-2 gap-4">
          <div><strong>Order ID:</strong> {orderDetails.order_id}</div>
          <div><strong>Date:</strong> {orderDetails.created_at}</div>
          <div><strong>Status:</strong> <span class=" badge variant-filled-success">{orderDetails.status}</span></div>
          <div><strong>Comments:</strong> {orderDetails.comments}</div>
        </div>
      </div>
     </div>
  
     <div>
      <h2 class="text-xl font-bold text-gray-900 mb-6">Products in Order</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          {#each enrichedOrderItems as item, index}
          <li class="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-600">
                {item.productDetails.name}
              </div>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {item.quantity} x ${item.productDetails.price}
                </p>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              Subtotal: ${(item.quantity * item.productDetails.price).toFixed(2)}
            </div>
          </li>
          {/each}
        </ul>
        <div class="px-4 py-2 bg-gray-50 text-right">
            <strong class="text-lg font-medium text-gray-900">Total: €{totalSum}</strong>
        </div>
      </div>
     </div>
    <div class="mt-4 text-right">
        <button on:click={finalizeCheckout} class="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-1 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 h-10">
            Re order
          </button>
    </div>
   </div> 
</section>
{/if}
