<script>
  import { onMount, onDestroy } from 'svelte';
  import CodeMirror from 'codemirror';
  
  // Modes & Addons (Importing from node_modules)
  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/xml/xml';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/htmlmixed/htmlmixed';
  import 'codemirror/mode/jsx/jsx';
  
  // Addons
  import 'codemirror/addon/edit/closebrackets';
  import 'codemirror/addon/edit/closetag';
  
  // Styles
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/theme/dracula.css';

  import { fileSystem } from '../../stores/fileSystemStore';

  let editorContainer;
  let cmInstance = null;
  let currentFileId = null;

  // Subscribe to File System Store
  const unsubscribe = fileSystem.subscribe(store => {
    // 1. If active file changed
    if (store.activeFileId !== currentFileId) {
      currentFileId = store.activeFileId;
      loadContent(store.root, currentFileId);
    }
  });

  function loadContent(nodes, id) {
    if (!id || !cmInstance) return;
    
    // Find file content recursively
    const file = findFile(nodes, id);
    if (file) {
      const ext = file.name.split('.').pop();
      setMode(ext);
      
      // Only update if content is different (cursor jump prevention)
      if (cmInstance.getValue() !== file.content) {
        cmInstance.setValue(file.content || "");
      }
    }
  }

  function findFile(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function setMode(ext) {
    let mode = 'javascript';
    if (ext === 'html') mode = 'htmlmixed';
    if (ext === 'css') mode = 'css';
    if (ext === 'jsx' || ext === 'tsx') mode = 'jsx';
    if (ext === 'json') mode = 'application/json';
    
    cmInstance.setOption('mode', mode);
  }

  onMount(() => {
    cmInstance = CodeMirror(editorContainer, {
      theme: 'dracula',
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      lineWrapping: false, // Mobile pe false hi better hai for code clarity
      tabSize: 2,
      indentUnit: 2,
      viewportMargin: Infinity // Ensure smooth scrolling
    });

    // Handle Changes
    cmInstance.on('change', () => {
      if (currentFileId) {
        const val = cmInstance.getValue();
        fileSystem.updateFileContent(currentFileId, val);
      }
    });

    // Initial Load
    const state = $fileSystem; // Auto-subscribed via $ syntax in Svelte script
    if (state.activeFileId) {
      loadContent(state.root, state.activeFileId);
    }
  });

  onDestroy(() => {
    unsubscribe();
    if (cmInstance) {
      cmInstance.toTextArea(); // Cleanup
    }
  });
</script>

<div class="editor-wrapper" bind:this={editorContainer}></div>

<style>
  .editor-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-size: 14px;
  }

  /* Deep Styling for CodeMirror to fit Container */
  :global(.CodeMirror) {
    height: 100% !important;
    background-color: var(--bg-main) !important;
    font-family: var(--font-code) !important;
    color: #f8f8f2;
  }
  
  :global(.CodeMirror-gutters) {
    background-color: var(--bg-main) !important;
    border-right: 1px solid var(--border);
  }

  :global(.CodeMirror-linenumber) {
    color: var(--text-muted) !important;
  }
</style>
