<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    let quantity = 1;
    const dispatch = createEventDispatcher();
   
    function decrease() {
       if (quantity > 1) {
         quantity--;
         dispatch('change', quantity);
       }
    }
   
    function increase() {
       quantity++;
       dispatch('change', quantity);
    }
   </script>
   
   <div>
       <label for="Quantity" class="sr-only"> Quantity </label>
     
       <div class="flex items-center rounded border border-gray-200">
         <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75" on:click={decrease}>
           &minus;
         </button>
     
         <input
           type="number"
           id="Quantity"
           bind:value={quantity}
           class="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
         />
     
         <button type="button" class="size-10 leading-10 text-gray-600 transition hover:opacity-75" on:click={increase}>
           &plus;
         </button>
       </div>
   </div>
   