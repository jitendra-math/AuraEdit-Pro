<script>
  import { fade, scale } from 'svelte/transition';
  import { ui } from '../../stores/uiStore';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props to make it reusable
  export let title = "Are you sure?";
  export let message = "This action cannot be undone.";
  export let confirmText = "Confirm";
  export let cancelText = "Cancel";
  
  // Close handler
  function close() {
    ui.closeModal();
  }

  function onConfirm() {
    dispatch('confirm');
    close();
  }
</script>

{#if $ui.activeModal === 'confirm-paste'}
  <div class="modal-backdrop" transition:fade={{ duration: 200 }}>
    <div 
      class="modal-box glass" 
      transition:scale={{ start: 0.95, duration: 200 }}
    >
      <div class="modal-icon">
        <i class="ri-question-mark"></i>
      </div>
      
      <h3 class="modal-title">{title}</h3>
      <p class="modal-msg">{message}</p>

      <div class="modal-actions">
        <button class="btn cancel" on:click={close}>{cancelText}</button>
        <button class="btn confirm" on:click={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 3000; /* Above everything */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal-box {
    width: 100%;
    max-width: 320px;
    background: #252526;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }

  .modal-icon {
    width: 48px;
    height: 48px;
    background: rgba(137, 180, 250, 0.1);
    color: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 16px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 8px;
  }

  .modal-msg {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    flex: 1;
    height: 44px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .btn.cancel {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
  }

  .btn.confirm {
    background: var(--accent);
    color: #fff;
  }
  
  .btn:active {
    transform: scale(0.98);
  }
</style>
