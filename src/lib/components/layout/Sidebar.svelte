<script>
  import { fly, fade } from 'svelte/transition';
  import { ui } from '../../stores/uiStore';
  import { fileSystem } from '../../stores/fileSystemStore';
  import FileTree from '../filesystem/FileTree.svelte';

  let newName = "";
  let isCreating = null; // 'file' or 'folder'

  function createItem(type) {
    const name = prompt(`Enter ${type} name:`);
    if (name) {
      // Add to root (default)
      fileSystem.addNode(null, name, type);
    }
  }
</script>

{#if $ui.isSidebarOpen}
  <div class="overlay" on:click={ui.closeSidebar} transition:fade></div>

  <aside class="sidebar" transition:fly={{ x: -250, duration: 300 }}>
    
    <div class="sidebar-header">
      <span class="brand">PRO EDITOR</span>
      <button class="close-btn" on:click={ui.closeSidebar}>
        <i class="ri-menu-fold-line"></i>
      </button>
    </div>

    <div class="tree-container">
      <FileTree nodes={$fileSystem.root} />
    </div>

    <div class="sidebar-actions">
      <button class="btn-action" on:click={() => createItem('file')}>
        <i class="ri-file-add-line"></i> New File
      </button>
      <button class="btn-action" on:click={() => createItem('folder')}>
        <i class="ri-folder-add-line"></i> New Folder
      </button>
    </div>

  </aside>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90; backdrop-filter: blur(2px); }
  .sidebar {
    position: fixed; top: 0; bottom: 0; left: 0; width: 260px;
    background: #181825; z-index: 100; display: flex; flex-direction: column;
    border-right: 1px solid #313244;
  }
  .sidebar-header { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #313244; color: #fff; font-weight: bold; }
  .close-btn { background: none; border: none; color: #a6adc8; font-size: 20px; }
  
  .tree-container { flex: 1; overflow-y: auto; padding: 10px 0; }

  /* New Action Buttons Styling */
  .sidebar-actions {
    padding: 12px; border-top: 1px solid #313244;
    display: flex; gap: 8px; background: #11111b;
  }
  .btn-action {
    flex: 1; background: #313244; border: none; color: #cdd6f4;
    padding: 8px; border-radius: 4px; font-size: 12px; display: flex;
    align-items: center; justify-content: center; gap: 6px;
  }
  .btn-action:active { background: #89b4fa; color: #11111b; }
</style>
