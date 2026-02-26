<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { ui } from '../../stores/uiStore';
  import { fileSystem } from '../../stores/fileSystemStore';

  // State
  let iframeSrc = '';
  
  // Close Logic
  function close() {
    ui.closeModal();
  }

  // Compiler Logic
  function compileProject() {
    const root = $fileSystem.root;
    
    // Helper to find file content
    const getFile = (name) => {
      const find = (nodes) => {
        for (const node of nodes) {
          if (node.name === name) return node.content;
          if (node.children) {
            const res = find(node.children);
            if (res) return res;
          }
        }
        return '';
      };
      return find(root);
    };

    // 1. Fetch Core Files
    let html = getFile('index.html') || '<h1>No index.html found</h1>';
    const css = getFile('style.css');
    const js = getFile('script.js') || getFile('main.js') || getFile('index.js');

    // 2. Inject CSS
    if (css) {
      html = html.replace('</head>', `<style>${css}</style></head>`);
    }

    // 3. Inject JS (with Error Handling wrapper)
    if (js) {
      const scriptBlock = `
        <script>
          try {
            ${js}
          } catch (err) {
            document.body.innerHTML += '<div style="color:red; background:#000; padding:10px; margin-top:20px;">Runtime Error: ' + err.message + '</div>';
            console.error(err);
          }
        <\/script>
      `;
      html = html.replace('</body>', `${scriptBlock}</body>`);
    }

    // 4. Create Blob URL
    const blob = new Blob([html], { type: 'text/html' });
    iframeSrc = URL.createObjectURL(blob);
  }

  // Compile immediately when mounted
  onMount(() => {
    compileProject();
  });
</script>

{#if $ui.activeModal === 'preview'}
  <div class="preview-overlay" transition:fade={{ duration: 200 }}>
    
    <div class="preview-header">
      <span class="preview-title">
        <i class="ri-smartphone-line"></i> Live Preview
      </span>
      <div class="actions">
        <button class="icon-btn" on:click={compileProject} title="Refresh">
          <i class="ri-refresh-line"></i>
        </button>
        <button class="icon-btn close" on:click={close} title="Close">
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <div class="iframe-container" transition:fly={{ y: 20, duration: 300 }}>
      <iframe title="preview" src={iframeSrc} sandbox="allow-scripts allow-modals"></iframe>
    </div>

  </div>
{/if}

<style>
  .preview-overlay {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 2000; /* Highest Layer */
    display: flex;
    flex-direction: column;
  }

  .preview-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background: #181825;
    border-bottom: 1px solid #45475a;
  }

  .preview-title {
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .icon-btn {
    background: transparent;
    border: none;
    color: #a6adc8;
    font-size: 20px;
    cursor: pointer;
  }
  
  .icon-btn.close {
    color: #f38ba8;
  }

  .iframe-container {
    flex: 1;
    background: #fff;
    position: relative;
    overflow: hidden;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff; /* Web pages usually expect white bg */
  }
</style>
