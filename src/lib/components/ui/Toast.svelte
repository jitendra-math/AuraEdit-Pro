<script>
  import { fly, fade } from 'svelte/transition';
  import { ui } from '../../stores/uiStore';

  // Reactively get toast data from store
  $: toast = $ui.toast;
</script>

{#if toast}
  <div 
    class="toast {toast.type}" 
    in:fly={{ y: 20, duration: 300 }} 
    out:fade
  >
    <i class={toast.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}></i>
    <span>{toast.message}</span>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000; /* Top of everything */
    
    display: flex;
    align-items: center;
    gap: 8px;
    
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    min-width: 200px;
    justify-content: center;
  }

  /* Variants */
  .success {
    background: var(--bg-panel);
    border: 1px solid var(--success);
    color: var(--success);
  }

  .error {
    background: var(--bg-panel);
    border: 1px solid var(--danger);
    color: var(--danger);
  }

  .info {
    background: var(--bg-panel);
    border: 1px solid var(--accent);
    color: var(--accent);
  }

  i {
    font-size: 16px;
  }
</style>
