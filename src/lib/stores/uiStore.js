// src/lib/stores/uiStore.js
import { writable } from 'svelte/store';

function createUIStore() {
    const { subscribe, update } = writable({
        isSidebarOpen: false,   // Mobile Sidebar state
        activeModal: null,      // 'confirm-paste', 'import', etc.
        toast: null             // { message: "Saved!", type: "success" }
    });

    return {
        subscribe,

        // --- Sidebar Logic ---
        toggleSidebar: () => update(s => ({ ...s, isSidebarOpen: !s.isSidebarOpen })),
        closeSidebar: () => update(s => ({ ...s, isSidebarOpen: false })),
        openSidebar: () => update(s => ({ ...s, isSidebarOpen: true })),

        // --- Modal Logic ---
        openModal: (modalId) => update(s => ({ ...s, activeModal: modalId })),
        closeModal: () => update(s => ({ ...s, activeModal: null })),

        // --- Toast Notification Logic ---
        showToast: (message, type = 'info') => {
            update(s => ({ ...s, toast: { message, type } }));
            
            // Auto hide after 2 seconds
            setTimeout(() => {
                update(s => ({ ...s, toast: null }));
            }, 2500);
        }
    };
}

export const ui = createUIStore();
