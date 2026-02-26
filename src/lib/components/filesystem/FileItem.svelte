<script>
  import { fileSystem } from '../../stores/fileSystemStore';
  import FileTree from './FileTree.svelte';

  export let node;
  export let depth = 0;

  $: isExpanded = $fileSystem.expandedFolders[node.id];
  $: isActive = $fileSystem.activeFileId === node.id;

  function handleClick() {
    if (node.type === 'folder') fileSystem.toggleFolder(node.id);
    else fileSystem.setActiveFile(node.id);
  }

  function deleteItem(e) {
    e.stopPropagation(); // Click parent ko mat bhejo
    if(confirm(`Delete ${node.name}?`)) {
      fileSystem.deleteNode(node.id);
    }
  }

  function renameItem(e) {
    e.stopPropagation();
    const newName = prompt("Rename to:", node.name);
    if(newName) fileSystem.renameNode(node.id, newName);
  }

  function createChild(e) {
    e.stopPropagation();
    const name = prompt("New File Name inside " + node.name);
    if(name) fileSystem.addNode(node.id, name, 'file');
  }

  // Icons Helper
  const getIcon = (n) => n.type === 'folder' ? (isExpanded ? 'ri-folder-open-fill' : 'ri-folder-fill') : 'ri-file-code-line';
  const getColor = (n) => n.type === 'folder' ? '#f9e2af' : '#89b4fa';
</script>

<div 
  class="row {isActive ? 'active' : ''}" 
  style="padding-left: {(depth * 12) + 12}px"
  on:click={handleClick}
>
  <div class="left-content">
    <i class={getIcon(node)} style="color: {getColor(node)}"></i>
    <span class="name">{node.name}</span>
  </div>

  <div class="actions">
    {#if node.type === 'folder'}
       <button on:click={createChild} title="Add File inside"><i class="ri-add-line"></i></button>
    {/if}
    <button on:click={renameItem} title="Rename"><i class="ri-pencil-line"></i></button>
    <button on:click={deleteItem} title="Delete" class="danger"><i class="ri-delete-bin-line"></i></button>
  </div>
</div>

{#if node.type === 'folder' && isExpanded}
  <FileTree nodes={node.children} depth={depth + 1} />
{/if}

<style>
  .row {
    display: flex; align-items: center; justify-content: space-between;
    height: 36px; cursor: pointer; color: #a6adc8; padding-right: 8px;
    border-left: 2px solid transparent;
  }
  .row:hover { background: #313244; color: #fff; }
  .row.active { background: #313244; border-left-color: #89b4fa; color: #fff; }

  .left-content { display: flex; align-items: center; overflow: hidden; }
  i { margin-right: 8px; font-size: 16px; }
  .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; }

  .actions { display: none; gap: 4px; }
  .row:hover .actions { display: flex; } /* Show on Hover */

  .actions button {
    background: none; border: none; color: #a6adc8; cursor: pointer; padding: 2px;
  }
  .actions button:hover { color: #fff; }
  .actions button.danger:hover { color: #f38ba8; }
</style>
