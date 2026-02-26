<script>
  import { fade, fly } from 'svelte/transition';
  import { ui } from '../../stores/uiStore';
  import { fileSystem } from '../../stores/fileSystemStore';
  import FileTree from '../filesystem/FileTree.svelte';

  // Sidebar close logic
  function close() {
    ui.closeSidebar();
  }
</script>

{#if $ui.isSidebarOpen}
  <div 
    class="overlay" 
    on:click={close}
    transition:fade={{ duration: 200 }}
  ></div>

  <aside 
    class="sidebar glass"
    transition:fly={{ x: -250, duration: 300 }}
  >
    <div class="sidebar-header">
      <span class="brand">
        <i class="ri-code-s-slash-line"></i> AURA
      </span>
      <button class="close-btn" on:click={close}>
        <i class="ri-menu-fold-line"></i>
      </button>
    </div>

    <div class="tree-container">
      <FileTree 
        nodes={$fileSystem.root} 
        activeId={$fileSystem.activeFileId} 
      />
    </div>

    <div class="sidebar-footer">
      <button class="action-btn" on:click={() => alert('Export Feature Coming Soon')}>
        <i class="ri-download-cloud-2-line"></i> Export ZIP
      </button>
      <button class="action-btn" on:click={() => alert('Settings Coming Soon')}>
        <i class="ri-settings-4-line"></i> Settings
      </button>
    </div>
  </aside>
{/if}

<style>
  /* --- Overlay --- */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 90; /* Behind sidebar, above editor */
    backdrop-filter: blur(2px);
  }

  /* --- Sidebar Panel --- */
  .sidebar {
    position: fixed;
    top: 0; bottom: 0; left: 0;
    width: 260px;
    background: var(--bg-sidebar);
    z-index: 100;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }

  /* Header */
  .sidebar-header {
    height: var(--header-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
  }

  .brand {
    font-weight: 700;
    font-size: 16px;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .brand i {
    color: var(--accent);
    font-size: 20px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    padding: 4px;
  }

  /* Tree Area */
  .tree-container {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  /* Footer */
  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg-sidebar);
  }

  .action-btn {
    width: 100%;
    background: var(--bg-panel);
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    transition: all 0.2s;
  }

  .action-btn:active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
</style>
