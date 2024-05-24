<script lang="ts">
  import ExpenseList from "$lib/ExpenseList.svelte";
  import SimpleMaskMoney from 'simple-mask-money';
  import Loader from "lucide-svelte/icons/loader";
  import { afterUpdate, tick } from "svelte";
  import { enhance } from '$app/forms';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { fade } from 'svelte/transition';
  import * as Drawer from "$lib/components/ui/drawer";

  export let categories;
  export let userEmail;
  export let expense;

  let amountInput;
  let showCategories = false;
  let formSelectedCategory = expense.category || categories[0];
  let formAmountInput: HTMLInputElement | null = null;
  let formNameInput: HTMLInputElement | null = null;
  let formAmount: string | null = null;
  let formAmountMemory = expense.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  let formNameMemory = expense.name;
  let open = false;
  let deleting = false;

  afterUpdate(async () => {
    formAmountInput = document.querySelector('input[name="amount"]');
    formNameInput = document.querySelector('input[name="name"]');

    if (formAmountInput) {
      SimpleMaskMoney.setMask(formAmountInput, {
        allowNegative: false,
        negativeSignAfter: false,
        prefix: 'R$ ',
        fixed: true,
        fractionDigits: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        cursor: 'end',
        afterFormat(e: string) { formAmount = e },
      });
      if (formAmountMemory) {
        await tick();
        formAmountInput.value = formAmountMemory;
      }
      if (formNameInput && formNameMemory) {
        await tick();
        formNameInput.value = formNameMemory;
      }
    }
    if (!open) {
      formAmountMemory = expense.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      formNameMemory = expense.name;
      formAmount = null;
      formSelectedCategory = expense.category || categories[0];
      showCategories = false;
    }
  });

  const handleShowCategories = () => {
    showCategories = true;
    if (formAmount !== "R$ 0,00") { formAmountMemory = formAmount; }
    if (formNameInput) { formNameMemory = formNameInput.value; }
  }

  const handleCategorySelection = (category: any) => {
    if (formNameInput) { formNameInput.value = formNameMemory; }
    
    formSelectedCategory = category;
    showCategories = false;
  }

  const handleDelete = () => {
    deleting = true;

    return async ({ update }: {update: any}) => {
      await update();
      open = false;
      deleting = false;
    };
  }
</script>

<Drawer.Root shouldScaleBackground bind:open direction="top">
  <Drawer.Trigger asChild let:builder>
    <ExpenseList {userEmail} builders={[builder]} {expense} />
  </Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      {#if !showCategories}
      <form in:fade method="POST" style={`display: ${showCategories ? "none" : "block"}`}>
        <div class="p-8 pt-16">
          <Input name="amount" bind:this={amountInput} type="text" inputmode="numeric" class="text-center placeholder:text-zinc-300 tracking-tight text-4xl font-bold border-none max-w focus-visible:ring-0 focus-visible:ring-offset-0" />
        </div>
        <div class="p-4 flex gap-2">
          <input type="hidden" name="categoryId" value={formSelectedCategory.id} />
          <input type="hidden" name="id" value={expense.id} />
          <button on:click={handleShowCategories} class={"text-xl relative h-12 w-12 rounded-xl flex justify-center items-center"} style={`background-color: ${formSelectedCategory.color}`}>
            {formSelectedCategory.icon}
            <div class="-bottom-px right-px absolute bg-white rounded-full p-1">
              <svg class="h-2 w-2 fill-zinc-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" xml:space="preserve">
                <path d="M147.1 219.5c-10.5 18.2-27.8 18.2-38.3 0L14.5 56C4 37.8 12.6 22.9 33.6 22.9h188.7c21.1 0 29.7 14.9 19.1 33.2l-94.3 163.4z"/>
              </svg>
            </div>
          </button>
          <Input 
            required
            name="name" 
            type="text" 
            placeholder="Café" 
            class="text-base rounded-xl h-12 placeholder:text-zinc-400 bg-zinc-50 border-none tracking-tight w-max grow" />
        </div>
        <div class="px-4 pt-4">
          <Button 
            class="w-full" 
            type="submit"
            disabled={deleting}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
      <form class="px-4 pt-2" method="POST" action="?/delete" use:enhance={handleDelete}>
        <input type="hidden" name="id" value={expense.id} />
        <Button 
          class="w-full bg-red-50 text-red-700 border-[1px] border-red-200 hover:bg-red-100" 
          type="submit"
          disabled={deleting}
        >
          {#if deleting}
            <Loader class="w-4 h-4 mr-2 animate-[spin_1.5s_linear_infinite]" />
          {/if}
          Apagar
        </Button>
      </form>  
      <div class="px-4 pt-2 pb-8">
        <Drawer.Close asChild let:builder>
          <Button class="w-full" builders={[builder]} variant="outline">Cancelar</Button>
        </Drawer.Close>
      </div>
      {:else}
        <ul in:fade class="flex gap-2 p-4 py-12 flex-wrap mx-auto w-full max-w-sm">
          {#each categories as category}
            <li>
              <button 
                on:click={() => handleCategorySelection(category)} 
                class="gap-2 text-xl h-20 w-20 rounded-xl flex flex-col justify-center items-center" 
                style={`background-color: ${category.color}`}>
                  {category.icon}
                <span class="text-xs tracking-tight">{category.name}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </Drawer.Content>
</Drawer.Root>