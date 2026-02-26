<script>
  import { fileSystem } from '../../stores/fileSystemStore';
  import FileTree from './FileTree.svelte'; // Circular import handled by Svelte

  export let node;
  export let depth = 0;

  // Reactively check if this folder is expanded
  $: isExpanded = $fileSystem.expandedFolders[node.id];
  
  // Reactively check if this file is currently active
  $: isActive = $fileSystem.activeFileId === node.id;

  function handleClick() {
    if (node.type === 'folder') {
      fileSystem.toggleFolder(node.id);
    } else {
      fileSystem.setActiveFile(node.id);
      // Mobile: Auto-close sidebar on file select (Optional UX choice)
      // ui.closeSidebar(); 
    }
  }

  function getIcon(name, type, open) {
    if (type === 'folder') {
      return open ? 'ri-folder-open-fill' : 'ri-folder-fill';
    }
    // File Icons
    if (name.endsWith('.html')) return 'ri-html5-fill';
    if (name.endsWith('.css')) return 'ri-css3-fill';
    if (name.endsWith('.js')) return 'ri-javascript-fill';
    if (name.endsWith('.jsx')) return 'ri-reactjs-fill';
    if (name.endsWith('.json')) return 'ri-braces-line';
    if (name.endsWith('.md')) return 'ri-markdown-fill';
    return 'ri-file-code-line'; // Default
  }

  function getIconColor(name, type) {
    if (type === 'folder') return '#e0af68'; // Gold folder
    if (name.endsWith('.html')) return '#e34f26';
    if (name.endsWith('.css')) return '#2965f1';
    if (name.endsWith('.js')) return '#f7df1e';
    if (name.endsWith('.jsx')) return '#61dafb';
    return 'var(--text-muted)';
  }
</script>

<div 
  class="row {isActive ? 'active' : ''}" 
  style="padding-left: {(depth * 12) + 12}px"
  on:click={handleClick}
>
  <i 
    class={getIcon(node.name, node.type, isExpanded)} 
    style="color: {getIconColor(node.name, node.type)}"
  ></i>
  
  <span class="name">{node.name}</span>
</div>

{#if node.type === 'folder' && isExpanded}
  <div class="children">
    <FileTree nodes={node.children} depth={depth + 1} />
  </div>
{/if}

<style>
  .row {
    display: flex;
    align-items: center;
    height: 32px; /* Compact height for mobile */
    cursor: pointer;
    border-left: 2px solid transparent; /* Selection indicator */
    transition: background 0.1s;
    user-select: none;
    font-size: 13px;
    color: var(--text-muted);
  }

  .row:hover {
    background-color: rgba(255, 255, 255, 0.03);
    color: var(--text-main);
  }

  .row.active {
    background-color: rgba(137, 180, 250, 0.1); /* Soft Blue Tint */
    border-left-color: var(--accent);
    color: var(--text-main);
    font-weight: 500;
  }

  i {
    margin-right: 6px;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
