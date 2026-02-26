import { writable, get } from 'svelte/store';
import { DB } from '../utils/db';

const initialState = {
    projectName: 'Aura Project',
    root: [],
    activeFileId: null,
    expandedFolders: {}
};

function createFileSystem() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,

        async init() {
            const saved = await DB.loadProject();
            if (saved) {
                set(saved);
            } else {
                const defaultProject = {
                    projectName: 'My-App',
                    root: [
                        { id: 'root-1', name: 'index.html', type: 'file', content: '<h1>Hello</h1>' }
                    ],
                    activeFileId: 'root-1',
                    expandedFolders: {}
                };
                set(defaultProject);
                this.save();
            }
        },

        // --- CRUD OPERATIONS (Fixed Reactivity) ---
        
        addNode(parentId, name, type) {
            update(state => {
                const newNode = {
                    id: Date.now().toString(),
                    name,
                    type,
                    content: type === 'file' ? '' : undefined,
                    children: type === 'folder' ? [] : undefined
                };

                // Deep Clone to trigger Svelte Reactivity
                const newRoot = JSON.parse(JSON.stringify(state.root));

                if (!parentId) {
                    newRoot.push(newNode);
                } else {
                    const parent = findNode(newRoot, parentId);
                    if (parent && parent.children) {
                        parent.children.push(newNode);
                        state.expandedFolders[parentId] = true; 
                    }
                }
                
                state.root = newRoot; // Force Update
                return state;
            });
            this.save();
        },

        deleteNode(id) {
            update(state => {
                let newRoot = JSON.parse(JSON.stringify(state.root));
                newRoot = recursiveDelete(newRoot, id);
                
                if (state.activeFileId === id) state.activeFileId = null;
                
                state.root = newRoot; // Force Update
                return state;
            });
            this.save();
        },

        renameNode(id, newName) {
            update(state => {
                const newRoot = JSON.parse(JSON.stringify(state.root));
                const node = findNode(newRoot, id);
                if (node) node.name = newName;
                
                state.root = newRoot; // Force Update
                return state;
            });
            this.save();
        },

        updateFileContent(id, content) {
            update(state => {
                const node = findNode(state.root, id);
                if (node) node.content = content;
                return state;
            });
            this.save();
        },

        setActiveFile(id) {
            update(s => ({ ...s, activeFileId: id }));
            this.save();
        },

        toggleFolder(id) {
            update(s => {
                if (s.expandedFolders[id]) delete s.expandedFolders[id];
                else s.expandedFolders[id] = true;
                return s;
            });
            this.save();
        },

        loadNewProjectStructure(name, root) {
            set({ projectName: name, root, activeFileId: null, expandedFolders: {} });
            this.save();
        },

        async save() {
            const state = get(this);
            await DB.saveProject(state);
        }
    };
}

// Helpers
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
        if (node.children) node.children = recursiveDelete(node.children, id);
        return true;
    });
}

export const fileSystem = createFileSystem();
