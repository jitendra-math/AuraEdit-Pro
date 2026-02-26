<script>
  import FileItem from './FileItem.svelte';

  export let nodes = [];
  export let depth = 0;

  // Reactively sort: Folders first, then Files (A-Z)
  $: sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === b.type) return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    return a.type === 'folder' ? -1 : 1;
  });
</script>

<div class="file-tree-list">
  {#each sortedNodes as node (node.id)}
    <FileItem {node} {depth} />
  {/each}
</div>

<style>
  .file-tree-list {
    display: flex;
    flex-direction: column;
    /* No padding here, indentation is handled inside FileItem via padding-left */
  }
</style>
