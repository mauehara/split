<script>
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import ExpenseList from '$lib/ExpenseList.svelte';
  import { Button } from "$lib/components/ui/button";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Drawer from "$lib/components/ui/drawer";

  export let data;

  $: balance = data.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
</script>

<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button class="fixed bottom-2 right-2" builders={[builder]}>
      <DollarSign class="w-4 h-4 mr-2" />
      Adicionar
    </Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="p-4 pb-0">
        <div class="flex items-center justify-center space-x-2">
          <div class="flex-1 text-center">
            <div class="text-7xl font-bold tracking-tighter">
            </div>
            <div class="text-[0.70rem] uppercase text-muted-foreground">
              Calories/day
            </div>
          </div>
        </div>
        <div class="mt-3 h-[120px]">
        </div>
      </div>
      <Drawer.Footer>
        <Button>Adicionar</Button>
        <Drawer.Close asChild let:builder>
          <Button builders={[builder]} variant="outline">Cancelar</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </div>
  </Drawer.Content>
</Drawer.Root>

<main class="flex flex-col items-center bg-zinc-50">
  <header class="w-full p-10 pb-0 flex justify-between">
    <h1 class="mt-10 mb-0 scroll-m-20 text-md tracking-tight transition-colors first:mt-0">{`Olá, ${data.session.user?.name?.split(' ')[0]}`}</h1>
    <Avatar.Root>
      <Avatar.Image src={data.session.user?.image} alt="Foto de perfil" />
      <Avatar.Fallback>{data.session.user?.name?.split(' ').map(word => word[0]).join('')}</Avatar.Fallback>
    </Avatar.Root>
  </header>
  <div class="p-10 pb-20">
    <p class="tracking-tight text-sm text-center mb-2">Seu saldo</p>
    <div class="flex gap-2 items-center">
      <p class="tracking-tight text-3xl font-bold">
        {balance}
      </p>
      {#if data.balance < 0}
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
      {:else}
        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
      {/if}
    </div>
  </div>
  <ul class="w-full max-w-lg ">
    {#each data.expenses as expense}
      <ExpenseList {expense} userEmail={data.session.user?.email} />
    {/each}
  </ul>
</main>
