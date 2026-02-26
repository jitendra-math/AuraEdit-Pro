<script>
  import { onMount } from 'svelte';
  
  // Stores
  import { fileSystem } from './lib/stores/fileSystemStore';
  import { ui } from './lib/stores/uiStore';
  
  // Components
  import Header from './lib/components/layout/Header.svelte';
  import Sidebar from './lib/components/layout/Sidebar.svelte';
  import CodeEditor from './lib/components/editor/CodeEditor.svelte';
  import Toast from './lib/components/ui/Toast.svelte';
  import Preview from './lib/components/layout/Preview.svelte';
  import Modal from './lib/components/ui/Modal.svelte';

  // Smart Paste Logic for Custom Modal
  async function handlePasteConfirm() {
    if (!$fileSystem.activeFileId) return;
    try {
      const text = await navigator.clipboard.readText();
      fileSystem.updateFileContent($fileSystem.activeFileId, text);
      ui.showToast("File Content Replaced!", "success");
    } catch (err) {
      ui.showToast("Clipboard access denied", "error");
    }
  }

  // Initialize App
  onMount(async () => {
    // Load Project from IndexedDB
    await fileSystem.init();
    
    // Initial loader handling
    const loader = document.getElementById('initial-loader');
    if(loader) loader.style.display = 'none';
  });
</script>

<Toast />
<Preview />
<Modal 
  title="Replace Everything?" 
  message="Kya aap pakka is file ka saara code clipboard content se badalna chahte hain?" 
  confirmText="Haan, Replace Karo"
  on:confirm={handlePasteConfirm} 
/>

<div class="app-layout">
  
  <Sidebar />

  <div class="main-column">
    
    <Header />

    <main class="editor-area">
      {#if $fileSystem.activeFileId}
        <CodeEditor />
      {:else}
        <div class="empty-state">
          <i class="ri-code-s-slash-line icon-bg"></i>
          <p>Select a file to edit</p>
          <span class="sub-text">AuraEdit v3.0 (Svelte)</span>
        </div>
      {/if}
    </main>

  </div>
</div>

<style>
  /* --- MASTER LAYOUT --- */
  .app-layout {
    display: flex;
    height: 100dvh; /* Mobile fixed height fix */
    width: 100vw;
    background-color: var(--bg-main);
    overflow: hidden; 
    position: relative;
  }

  .main-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  /* --- EDITOR AREA --- */
  .editor-area {
    flex: 1; 
    overflow-y: hidden; 
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* --- EMPTY STATE --- */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    opacity: 0.5;
  }

  .icon-bg {
    font-size: 64px;
    margin-bottom: 16px;
    color: var(--border);
  }

  .sub-text {
    font-size: 12px;
    margin-top: 8px;
    opacity: 0.7;
  }
</style>
