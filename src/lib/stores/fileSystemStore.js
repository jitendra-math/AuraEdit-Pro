// src/lib/stores/fileSystemStore.js
import { writable, get } from 'svelte/store';
import { DB } from '../utils/db';

// Initial State Structure
const initialState = {
    projectName: 'Aura Project',
    root: [],           // Array of file/folder objects
    activeFileId: null, // Currently open file ID
    expandedFolders: {} // UI state: { 'folder-id': true/false }
};

function createFileSystem() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,

        // === 1. INITIALIZATION ===
        async init() {
            const saved = await DB.loadProject();
            if (saved) {
                set(saved);
            } else {
                // Default Template if no project exists
                const defaultProject = {
                    projectName: 'My-App',
                    root: [
                        { id: 'f1', name: 'index.html', type: 'file', content: '<h1>Hello Aura</h1>' },
                        { id: 'f2', name: 'style.css', type: 'file', content: 'body { background: #1e1e2e; color: #fff; }' },
                        { id: 'f3', name: 'main.js', type: 'file', content: "console.log('Aura Ready');" }
                    ],
                    activeFileId: 'f1',
                    expandedFolders: {}
                };
                set(defaultProject);
                this.save();
            }
        },

        // === 2. CRUD OPERATIONS ===
        
        // Add File or Folder
        addNode(parentId, name, type) {
            update(state => {
                const newNode = {
                    id: Date.now().toString(),
                    name,
                    type,
                    content: type === 'file' ? '' : undefined,
                    children: type === 'folder' ? [] : undefined
                };

                if (!parentId) {
                    state.root.push(newNode);
                } else {
                    const parent = findNode(state.root, parentId);
                    if (parent && parent.children) {
                        parent.children.push(newNode);
                        state.expandedFolders[parentId] = true; // Auto-open parent
                    }
                }
                return state;
            });
            this.save();
        },

        // Delete Node
        deleteNode(id) {
            update(state => {
                // Recursive delete filter
                state.root = recursiveDelete(state.root, id);
                // If active file was deleted, close editor
                if (state.activeFileId === id) state.activeFileId = null;
                return state;
            });
            this.save();
        },

        // Rename
        renameNode(id, newName) {
            update(state => {
                const node = findNode(state.root, id);
                if (node) node.name = newName;
                return state;
            });
            this.save();
        },

        // Update File Content (Text Editor)
        updateFileContent(id, content) {
            update(state => {
                const node = findNode(state.root, id);
                if (node && node.type === 'file') {
                    node.content = content;
                }
                return state;
            });
            // Note: In production, debounce this save for performance
            this.save(); 
        },

        // === 3. UI ACTIONS ===
        
        setActiveFile(id) {
            update(state => ({ ...state, activeFileId: id }));
            this.save();
        },

        toggleFolder(id) {
            update(state => {
                // Toggle boolean state
                if (state.expandedFolders[id]) {
                    delete state.expandedFolders[id];
                } else {
                    state.expandedFolders[id] = true;
                }
                return state;
            });
            this.save();
        },

        // Overwrite entire tree (For Zip Import / AI)
        loadNewProjectStructure(name, root) {
            update(state => ({
                ...state,
                projectName: name,
                root: root,
                activeFileId: null
            }));
            this.save();
        },

        // === 4. DATABASE SYNC ===
        async save() {
            const state = get(this);
            await DB.saveProject(state);
        }
    };
}

// === HELPER FUNCTIONS (Internal) ===

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

function recursiveDelete(nodes, id) {
    return nodes.filter(node => {
        if (node.id === id) return false;
        if (node.children) {
            node.children = recursiveDelete(node.children, id);
        }
        return true;
    });
}

export const fileSystem = createFileSystem();
