<script>
// @ts-nocheck

  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import ExpenseList from '$lib/ExpenseList.svelte';
  import SimpleMaskMoney, { setMask } from 'simple-mask-money';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { beforeUpdate, onMount } from "svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Drawer from "$lib/components/ui/drawer";

  export let data;
  let amountInput;

  $: balance = data.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  beforeUpdate(() => {
    const input = document.querySelector('input[name="amount"]');
    SimpleMaskMoney.setMask(input, {
      allowNegative: false,
      negativeSignAfter: false,
      prefix: 'R$ ',
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ',',
      thousandsSeparator: '.',
      cursor: 'end'
    });
  });
  
</script>

<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button class="fixed bottom-4 right-4" builders={[builder]}>
      <DollarSign class="w-4 h-4 mr-2" />
      Adicionar
    </Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <form class="mx-auto w-full max-w-sm" method="POST">
      <Drawer.Header>
        <Drawer.Title>Nova despesa</Drawer.Title>
      </Drawer.Header>
      <div class="p-8">
        <Input name="amount" bind:this={amountInput} type="text" inputmode="numeric" placeholder="0" class="text-center placeholder:text-zinc-300 tracking-tight text-4xl font-bold border-none max-w focus-visible:ring-0 focus-visible:ring-offset-0" />
      </div>
      <div class="p-4 pt-8 flex gap-2">
        <div class={"h-12 w-12 rounded-xl flex justify-center items-center bg-green-50"}>
          🥦
        </div>
        <Input type="text" placeholder="Café" class="rounded-xl h-12 placeholder:text-zinc-400 bg-zinc-50 border-none tracking-tight w-max grow" />
      </div>
      <Drawer.Footer>
        <Button type="submit">Adicionar</Button>
        <Drawer.Close asChild let:builder>
          <Button builders={[builder]} variant="outline">Cancelar</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </form>
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
