import { writable } from 'svelte/store';

interface Product {
    product_id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
}

function createProductStore() {
    const { subscribe, set } = writable<Product[]>([]); // Initializes with an empty array
  
    return {
        subscribe,
        setProducts: (products: Product[]) => set(products), // Update the entire list of products
        clearProducts: () => set([]) // Clear the product list
    };
}

export const productStore = createProductStore();

interface CartItem extends Product {
    quantity: number;
  }
  
  function createCartStore() {
    const { subscribe, set, update } = writable<CartItem[]>([]);
  
    return {
      subscribe,
      addProduct(product: Product, quantity: number = 1) {
        update((items) => {
          const productIndex = items.findIndex((item) => item.product_id === product.product_id);
      
          if (productIndex !== -1) {
            // Clone the items array for immutability
            const updatedItems = [...items];
            // Update the quantity of the existing product
            updatedItems[productIndex] = {
              ...updatedItems[productIndex],
              quantity: updatedItems[productIndex].quantity + quantity
            };
            return updatedItems;
          } else {
            // Product does not exist, add as new item
            return [...items, { ...product, quantity }];
          }
        });
      },
      removeProduct: (product: Product, quantity: number = 1) => update((items) => {
        const index = items.findIndex((item) => item.product_id === product.product_id);
        if (index === -1) return items; // If the product isn't in the cart, do nothing
  
        // Create a copy for immutability
        const newItems = items.slice();
        const currentItem = newItems[index];
  
        // Adjust quantity or remove the item if quantity falls to zero or below
        currentItem.quantity -= quantity;
        if (currentItem.quantity <= 0) newItems.splice(index, 1);
  
        return newItems;
      }),

      clearCart: () => set([]),
      updateProductQuantity: (productId:string , newQuantity:number ) => {
        update((items) => {
          const productIndex = items.findIndex((item) => item.product_id === productId);
          if (productIndex !== -1) {
            const updatedItems = [...items];
            updatedItems[productIndex] = {
              ...updatedItems[productIndex],
              quantity: newQuantity
            };
            return updatedItems;
          }
          return items;
        });
      }
    };
}
  
export const cartStore = createCartStore();

interface Orders{
   order_id:string;
   user_id:string;
   status:string;
   created_at:Date;
   comments:string;
}

function createOrderStore(){
    const { subscribe, set } = writable<Orders[]>([]);

    return {
        subscribe,
        setOrders: (orders: Orders[]) => set(orders),
        clearOrders: () => set([])
    };
}

export const orderStore = createOrderStore();


  