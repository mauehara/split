<script lang="ts">
  import Fuse from 'fuse.js';
  import Plus from "lucide-svelte/icons/plus";
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
  export let allExpenses;

  let amountInput;
  let showCategories = false;
  let formSelectedCategory = categories[0];
  let formAmountInput: HTMLInputElement | null = null;
  let formNameInput: HTMLInputElement | null = null;
  let formAmount: string | null = null;
  let formAmountMemory: string | null = null;
  let formNameMemory: string = "";
  let open = false;
  let adding = false;
  
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
      formAmountMemory = null;
      formAmount = null;
      formNameMemory = "";
      formSelectedCategory = categories[0];
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

  const handleAdd = () => {
    adding = true;

    return async ({ update }: {update: any}) => {
      open = false;
      await update();
      adding = false;
    };
  }

  const handleNameInput = (e: InputEvent) => {
    const query = (e.target as HTMLInputElement).value;
    const options = {
      includeScore: true,
      keys: ['name'],
      minMatchCharLength: 4,
      ignoreLocation: true,
    }
    const fuse = new Fuse(allExpenses, options)
    const result = fuse.search(query)
    if (result.length > 0) {
      const suggestedCategoryId = (result[0].item as any).category;
      formSelectedCategory = categories.find((category: any) => category.id === suggestedCategoryId);
    }
  }
</script>

<Drawer.Root shouldScaleBackground bind:open direction="top">
  <Drawer.Trigger asChild let:builder>
    <Button class="p-0 w-14 h-14 rounded-full fixed bottom-4 right-4 drop-shadow-lg" builders={[builder]}>
      <Plus class="w-6 h-6" />
    </Button>
  </Drawer.Trigger>
  <Drawer.Content>
    {#if !showCategories}
    <form 
      in:fade 
      class="mx-auto w-full max-w-sm" 
      method="POST" 
      action="?/add" 
      style={`display: ${showCategories ? "none" : "block"}`}
      use:enhance={handleAdd}
    >
      <div class="p-8 pt-16">
        <Input name="amount" bind:this={amountInput} type="text" inputmode="numeric" class="text-center placeholder:text-zinc-300 tracking-tight text-4xl font-bold border-none max-w focus-visible:ring-0 focus-visible:ring-offset-0" />
      </div>
      <div class="p-4 flex gap-2">
        <input type="hidden" name="categoryId" value={formSelectedCategory.id} />
        <input type="hidden" name="userEmail" value={userEmail} />
        <button on:click={handleShowCategories} class={"relative h-12 w-12 rounded-xl flex justify-center items-center"} style={`background-color: ${formSelectedCategory.color}`}>
          {formSelectedCategory.icon}
          <div class="-bottom-px right-px absolute bg-white rounded-full p-1">
            <svg class="h-2 w-2 fill-zinc-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" xml:space="preserve">
              <path d="M147.1 219.5c-10.5 18.2-27.8 18.2-38.3 0L14.5 56C4 37.8 12.6 22.9 33.6 22.9h188.7c21.1 0 29.7 14.9 19.1 33.2l-94.3 163.4z"/>
            </svg>
          </div>
        </button>
        <Input
          data-1p-ignore
          required
          name="name" 
          type="text" 
          placeholder="Café" 
          on:input={handleNameInput}
          class="text-base rounded-xl h-12 placeholder:text-zinc-400 bg-zinc-50 border-none tracking-tight w-max grow" />
      </div>
      <Drawer.Footer>
        <Button disabled={adding} type="submit">
          {#if adding}
            <Loader class="w-4 h-4 mr-2 animate-[spin_1.5s_linear_infinite]" />
          {/if}
          Adicionar
        </Button>
        <Drawer.Close asChild let:builder>
          <Button builders={[builder]} variant="outline">Cancelar</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </form>
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
  </Drawer.Content>
</Drawer.Root>