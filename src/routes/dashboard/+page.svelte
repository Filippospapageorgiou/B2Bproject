<script lang="ts">
    import { onMount } from 'svelte';
    import { Modal, getModalStore, type ModalSettings,Toast , getToastStore } from '@skeletonlabs/skeleton';
    import Loader from "$lib/components/loader.svelte";
    import { productStore } from '$lib/productStore';
    import { cartStore } from '$lib/productStore';
    import { supabase } from '$lib/supabaseClient';
	import Banner from "$lib/components/Banner.svelte";
	import QuantityInput from "$lib/components/QuantityInput.svelte";
    import { initializeStores } from '@skeletonlabs/skeleton';


    initializeStores();
    const toastStore = getToastStore();
    
	
    let isloading:boolean = true;
    let selectedQuantities:{[key:string]:number} = {};

    onMount(async () => {
        // Create a promise that resolves after 2 seconds
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1500));

        const dataPromise = supabase
            .from('products')
            .select('*')
            .then(({ data: products, error }) => {
                if (error) {
                    console.error('Error fetching products:', error);
                } else {
                    productStore.setProducts(products);
                }
            });

        // Wait for both promises to resolve
        await Promise.all([timeoutPromise, dataPromise]);

        // After both promises have resolved, hide the loader
        isloading = false;
    });
    // Retrieve the modal store
    const modalStore = getModalStore();

    // Modified addToCart function with confirmation
    async function addToCart(product:any, quantity:any) {
        const modalSettings: ModalSettings = {
        type: 'confirm', // This now explicitly matches the expected string literal type
        title: 'Add to Cart',
        body: `Are you sure you want to add ${quantity} x ${product.name} to your cart?`,
         response: (confirmed: boolean) => {
             if (confirmed) {
             
             cartStore.addProduct(product, quantity);
             toastStore.trigger({
			 message: 'Product added to cart!',
			 background: 'variant-filled-success'
			});
            } else {
                toastStore.trigger({
			    message: 'Product not added to cart!',
			    background: 'variant-filled-error'
			    });
            }
        }
    };
     // Then, trigger the modal with the defined settings
     modalStore.trigger(modalSettings);
    }
</script>


<Modal/>
<Toast/>



{#if isloading}
       <div class="h-screen flex justify-center items-center">
            <Loader></Loader>
       </div>
{:else}
    <Banner></Banner>
    <div class="flex flex-wrap justify-center mt-10">
        {#each $productStore as product}
            <div class="m-4 w-60 bg-white/30 backdrop-blur-md hover:scale-105 transition-transform duration-200">
                <img class="w-full h-32 object-cover" src={product.image_url} alt={product.name}>
                <div class="p-4">
                    <h2 class="text-lg font-semibold">{product.name}</h2>
                    <p class="text-sm text-gray-700">{product.description}</p>
                    <p class="text-lg font-bold">${product.price}</p>
                    <p>{product.product_id}</p>
                    <QuantityInput on:change={(e) => { selectedQuantities[product.product_id] = e.detail; }} />
                    <button on:click={() => addToCart(product, selectedQuantities[product.product_id] || 1)}
                      class="rounded-lg relative w-28 h-8 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
                        >
                    <span
                      class="text-gray-200 font-semibold ml-1 transform group-hover:translate-x-20 transition-all duration-300"
                      >Add Item</span
                    >
                    <span
                      class="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
                    >
                      <svg
                        class="svg w-8 text-white"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="12" x2="12" y1="5" y2="19"></line>
                        <line x1="5" x2="19" y1="12" y2="12"></line>
                      </svg>
                    </span>
                  </button>
                </div>
            </div>
        {/each}
    </div>    
{/if}

