<script lang="ts">
    import { supabase } from '../lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { authStore } from '../lib/authStore';
    import Appbar from '$lib/components/Appbar.svelte';
    import '../app.postcss'
    import { fade } from 'svelte/transition';
    

    let email:string = '';
    let password:string = '';
    let visible: boolean = false;
    let message:string ='Invalid email or password. Please try again.'

    async function signinWithEmail(){
        const { data , error } =await supabase.auth.signInWithPassword({
            email,
            password
        });
        if(error){
          visible = true;
          setTimeout(() => {
            visible = false;
          }, 2000);
        }else{
            const user = {
                id:data?.user?.id || null,
                email:data?.user?.email || null,
                created_at:new Date().toISOString() || null
            }
            let { data: users, error } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', user.id)

            authStore.setUser(user);
            if (!users || !users.length) {
              upsertUser(user);
            }
            
            goto('/dashboard');
        }   
    }
    async function upsertUser(user:any) {
          const { data, error } = await supabase
          .from('users')
          .insert([
          { user_id : user.id, 
            email: user.email,
            created_at: user.created_at,},
          ])
          .select()
       if (error) {
          console.error('Error saving user to database:', error);
         return;
        }
      console.log('User saved to database:', data);
    }

    
</script>

<Appbar></Appbar>
{#if visible}
    <div class="flex justify-center items-center mr-5 mt-7">
      <div class="alert variant-ghost-error" transition:fade|local={{ duration: 200 }} role="alert">
        <div><img alt="alert" src="/warning.png" /></div>
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{message}</span>
      </div>
    </div>  
{/if}
<div class="flex flex-col items-center justify-center mt-52">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl text-gray-900 mb-2">Login.</h2>
      <p class="">Sign in with your account.</p>
      <form class="flex flex-col mt-2" on:submit|preventDefault={signinWithEmail}>
        <input bind:value={email} type="email" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Email address" required>
        <input bind:value={password} type="password" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Password" required>
        <div class="flex items-center justify-between flex-wrap">
          <label for="remember-me" class="text-sm text-gray-900 cursor-pointer">
            <input type="checkbox" id="remember-me" class="mr-2">
            Remember me
          </label>
          <a href="/" class="text-sm text-blue-500 hover:underline mb-0.5">Forgot password?</a>
          <p class="text-gray-900 mt-4"> Don't have an account? <a href="/" class="text-sm text-blue-500 -200 hover:underline mt-4">Signup</a></p>
        </div>
        <button type="submit" class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">Login</button>
      </form>
    </div>
</div>

  