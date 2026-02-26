<script>
  import { ui } from '../../stores/uiStore';
  import { fileSystem } from '../../stores/fileSystemStore';
  import { AIParser } from '../../utils/aiParser'; // AI Logic Import

  // Reactive: Find the active file object whenever ID changes
  $: activeFile = findNode($fileSystem.root, $fileSystem.activeFileId) || { name: 'AuraEdit' };

  function findNode(nodes, id) {
     for (const node of nodes) {
       if (node.id === id) return node;
       if (node.children) {
         const found = findNode(node.children, id);
         if (found) return found;
       }
     }
     return null;
  }

  // --- Feature 1 & 2: Smart Paste Logic ---
  async function handleSmartPaste() {
    try {
      const text = await navigator.clipboard.readText();

      // 1. Check for AI Tree Structure (e.g. ├── src/)
      if (text.includes('├──') || text.includes('└──') || (text.includes('/') && text.split('\n').length > 3)) {
         if (confirm("📂 AI Folder Structure Detected!\n\nGenerate folders and files from this text?")) {
             const success = AIParser.parse(text);
             if (success) {
                 ui.showToast("Project Structure Created!", "success");
                 return; // Stop here if it was a tree
             }
         }
      }

      // 2. Normal Code Paste (Validation)
      if (!$fileSystem.activeFileId) {
          ui.showToast("Please open a file first!", "error");
          return;
      }

      // 3. Trigger Custom Glass Modal (App.svelte handles the actual paste)
      ui.openModal('confirm-paste');

    } catch (err) {
      console.error(err);
      ui.showToast("Allow Clipboard Access", "error");
    }
  }

  // --- Feature 3: Live Preview Trigger ---
  function handleRun() {
    ui.openModal('preview'); // Opens the Preview.svelte component
  }
</script>

<header>
  <div class="left">
    <button class="icon-btn" on:click={ui.toggleSidebar}>
      <i class="ri-menu-line"></i>
    </button>
    <span class="filename">{activeFile.name}</span>
  </div>

  <div class="right">
    <button class="icon-btn" on:click={handleSmartPaste} title="Smart Paste / Import Tree">
      <i class="ri-clipboard-line"></i>
    </button>
    
    <button class="icon-btn highlight" on:click={handleRun} title="Run Live Preview">
      <i class="ri-play-fill"></i>
    </button>
  </div>
</header>

<style>
  header {
    height: var(--header-h);
    background-color: var(--bg-sidebar);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    flex-shrink: 0;
    z-index: 50;
  }

  .left, .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filename {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-main);
    margin-left: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .icon-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .icon-btn:active {
    background: rgba(255,255,255,0.1);
    transform: scale(0.95);
    color: var(--text-main);
  }

  .highlight {
    color: var(--accent);
  }
</style>
