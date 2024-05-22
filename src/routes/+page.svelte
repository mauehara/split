<script>
  import ExpenseList from '$lib/ExpenseList.svelte';
  import { Button } from '$lib/components/ui/button'
  import { signOut } from '@auth/sveltekit/client'
  import * as Avatar from "$lib/components/ui/avatar";

  export let data;
</script>

<main class="flex flex-col items-center bg-zinc-50">
  <header class="w-full p-10 flex justify-between">
    <h1 class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">{`Olá, ${data.session.user.name?.split(' ')[0]}`}</h1>
    <Avatar.Root>
      <Avatar.Image src={data.session.user.image} alt="Foto de perfil" />
      <Avatar.Fallback>{data.session.user.name?.split(' ').map(word => word[0]).join('')}</Avatar.Fallback>
    </Avatar.Root>
    <Button variant="outline" on:click={signOut}>Sair</Button>
  </header>
  <ul class="w-full max-w-lg ">
    {#each data.expenses as expense}
      <ExpenseList {expense} />
    {/each}
  </ul>
</main>
