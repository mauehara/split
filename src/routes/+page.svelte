<script>
  export let data;
</script>

<ul>
  {#each data.expenses as expense}
    <li>{expense.Name}</li>
  {/each}
</ul>
