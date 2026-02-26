<script>
  import { ui } from '../../stores/uiStore';
  import { fileSystem } from '../../stores/fileSystemStore';

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

  async function handleSmartPaste() {
    if (!$fileSystem.activeFileId) return;
    
    // Safety Check (Fast Native Alert)
    if (!confirm(`Overwrite "${activeFile.name}" with clipboard content?`)) return;

    try {
      const text = await navigator.clipboard.readText();
      fileSystem.updateFileContent($fileSystem.activeFileId, text);
      // Trigger Toast (Assume Toast UI is listening to store)
      ui.showToast("File Updated!", "success");
    } catch (err) {
      alert("Clipboard permission denied! Please allow access.");
    }
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
    <button class="icon-btn" on:click={handleSmartPaste} title="Smart Paste">
      <i class="ri-clipboard-line"></i>
    </button>
    
    <button class="icon-btn highlight" title="Run Code">
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
    flex-shrink: 0; /* CRITICAL: Prevents header from shrinking/scrolling */
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
    width: 40px; /* Large touch target */
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
