// src/lib/utils/fileHandlers.js
import JSZip from 'jszip';
import { fileSystem } from '../stores/fileSystemStore';
import { get } from 'svelte/store';

export const FileHandlers = {
    
    // === 1. IMPORT ZIP ===
    async importZip(file) {
        if (!file) return;

        try {
            const zip = await JSZip.loadAsync(file);
            const root = [];
            const folderMap = {}; // Helper to find parent folder objects

            // Loop through every file in the zip
            for (const [relativePath, entry] of Object.entries(zip.files)) {
                if (entry.dir) continue; // Skip empty directory entries, we create them on demand

                const parts = relativePath.split('/');
                const fileName = parts.pop();
                
                // Traverse/Create folders path
                let currentLevel = root;
                let currentPath = "";

                for (const part of parts) {
                    currentPath += part + "/";
                    
                    // Check if folder exists in our map, if not create it
                    if (!folderMap[currentPath]) {
                        const newFolder = {
                            id: Date.now() + Math.random().toString(36).substr(2, 5),
                            name: part,
                            type: 'folder',
                            children: [],
                            isOpen: false
                        };
                        currentLevel.push(newFolder);
                        folderMap[currentPath] = newFolder.children;
                    }
                    // Move deeper
                    currentLevel = folderMap[currentPath];
                }

                // Add the file
                const content = await entry.async("string");
                currentLevel.push({
                    id: Date.now() + Math.random().toString(36).substr(2, 5),
                    name: fileName,
                    type: 'file',
                    content: content
                });
            }

            // Update Store
            fileSystem.loadNewProjectStructure(file.name.replace('.zip', ''), root);
            return true;

        } catch (err) {
            console.error("Zip Import Failed:", err);
            alert("Failed to read Zip file.");
            return false;
        }
    },

    // === 2. EXPORT ZIP ===
    async exportProject() {
        const state = get(fileSystem);
        const zip = new JSZip();

        // Recursive function to write nodes to zip
        function addNodesToZip(folder, nodes) {
            nodes.forEach(node => {
                if (node.type === 'folder') {
                    const newFolder = folder.folder(node.name);
                    if (node.children) addNodesToZip(newFolder, node.children);
                } else {
                    folder.file(node.name, node.content || "");
                }
            });
        }

        addNodesToZip(zip, state.root);

        // Generate and Download
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.projectName || 'project'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
