<script lang="ts">
	  import { authStore } from "$lib/authStore";
    import { cartStore } from '$lib/productStore';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { Modal, getModalStore, type ModalSettings,Toast , getToastStore } from '@skeletonlabs/skeleton';
    import { initializeStores } from '@skeletonlabs/skeleton';
	  import Loader from "$lib/components/loader.svelte";
    import { v4 as uuidv4 } from 'uuid';
  
    
    

    initializeStores();
    const toastStore = getToastStore();
    const modalStore = getModalStore();
    let isLoading:boolean = false;
    let comment:string='';
    let isValid:boolean=true;
    

    let sum=0;
    

    function calculateSum(){
        sum = $cartStore.reduce((acc, item) => acc + item.price*item.quantity, 0);
    }

    
    onMount(async () => {
      sum = $cartStore.reduce((acc, item) => acc + item.price*item.quantity, 0);
    });

    async function removeItem(item:any,quantity:number){
        cartStore.removeProduct(item,quantity);
        calculateSum();
    }
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
    
   if(isValid){
    const userId = $authStore?.id; // Ensure this correctly fetches the user's ID
    const cartItems = $cartStore;
   
    if (userId && cartItems.length > 0) {
      try {
        const { data: insertResult, error: insertError } = await supabase
              .from('orders')
              .insert({ user_id: userId,status: 'Completed',created_at: new Date(),comments:comment});
        
        if (!insertError) {
                const { data: mostRecentOrder, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

          const order_id = mostRecentOrder?.order_id;
          for(const item of cartItems){
              const { data: insertResult, error: insertError } = await supabase
              .from('order_items')
              .insert({item_id:uuidv4(),order_id: order_id,product_id: item.product_id,quantity: item.quantity,price: item.price});
          }
        }
        cartStore.clearCart();
        calculateSum();
        toastStore.trigger({
          message: 'Checkout successful!',
          background: 'variant-ghost-success', // Adjust the message and background as needed
        });
        comment="Leave a comment for your order"
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
   }else{
    isLoading = false;
    toastStore.trigger({
        message: 'Quantitys of products not Valid!!',
        background: 'variant-ghost-error',
      });
   }
  }

  function updateItemQuantity(item:any,quantity:number){
    if(quantity>0 && quantity%1===0){
      isValid = true;
      cartStore.updateProductQuantity(item,quantity);
      calculateSum();
    }else{
      isValid = false;
      toastStore.trigger({
        message: 'Quantity must be valid!!',
        background: 'variant-ghost-warning',
      });
    }
  }
    
</script>

<Modal />
<Toast />

 {#if isLoading}
    <div class="h-screen flex justify-center items-center">
      <Loader></Loader>
    </div>
  {:else}
    <section class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div class="mx-auto max-w-3xl">
          <header class="text-center">
            <h1 class="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
          </header>
      
          <div class="mt-8">
            <ul class="space-y-4">
              {#each $cartStore as item}
              <li class="flex items-center gap-4">
                <img src={item.image_url} alt="" class="h-24 w-36 rounded object-cover" />
      
                <div>
                  <h2 class="text-sm text-gray-900">{item.name}</h2>
      
                  <dl class="mt-0.5 space-y-px text-[10x] text-gray-600  text-bold">
                    <div>
                      <dt class="inline">Product ID:</dt>
                      <dd class="inline">{item.product_id}</dd>
                    </div>
      
                    <div>
                      <dt class="inline">Description:</dt>
                      <dd class="inline">{item.description}</dd>
                    </div>
      
                    <div>
                      <dt class="inline">Price:</dt>
                      <dd class="inline">{item.price}</dd>
                    </div>
      
                    <div>
                      <dt class="inline">Quantity:</dt>
                      <input type="number" class="input variant-ringed-warning w-20 h-6" bind:value={item.quantity} on:change={() => updateItemQuantity(item, Number(item.quantity))}/>
                    </div>
                  </dl>
                </div>
                <button on:click={() => removeItem(item,item.quantity)}
                  class=" ml-4 inline-flex items-center px-2 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
                  >
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                   >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    ></path>
                  </svg>
              
                  Delete
                </button>
              </li>
              {/each}
            </ul>
          </div>
          <div class="mt-6 flex border-gray-100 pt-8">
            <textarea bind:value={comment} class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" rows="2" placeholder="Leave a comment for your order"></textarea>
          </div>
            <div class="mt-1 flex justify-end border-t border-gray-100 pt-8">
                <div class="w-screen max-w-lg space-y-4">
                    <dl class="space-y-0.5 text-sm text-gray-700">
                      <div class="flex justify-between text-xl">
                        <dt>Total</dt>
                        <dd>{sum.toFixed(2)}€</dd>
                      </div>
                      <div class="flex justify-end">
                        <button on:click={finalizeCheckout} class="rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600">
                            Checkout
                        </button>
                    </div>
            </div>
          </div>
        </div>
      </section>
{/if}
