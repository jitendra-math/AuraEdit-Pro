// src/lib/utils/db.js

const DB_NAME = "AuraEditDB_Svelte_v1";
const STORE_NAME = "projects";

export const DB = {
    db: null,

    // 1. Open Database
    open() {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve(this.db);

            const req = indexedDB.open(DB_NAME, 1);

            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };

            req.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            req.onerror = (e) => reject(e.target.error);
        });
    },

    // 2. Save Project (Entire Tree)
    async saveProject(projectData) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(projectData, "activeProject");

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(false);
        });
    },

    // 3. Load Project
    async loadProject() {
        const db = await this.open();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get("activeProject");

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    }
};
