// src/lib/utils/aiParser.js
import { fileSystem } from '../stores/fileSystemStore';

export const AIParser = {
    
    parse(text) {
        if (!text || typeof text !== 'string') return;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return;

        // 1. Create a temporary root array
        const root = [];
        const stack = [{ depth: -1, children: root }];

        lines.forEach(line => {
            // Calculate indentation depth (spaces or tree symbols)
            const depthMatch = line.match(/^[\s\t│|├└─]*/);
            const rawDepth = depthMatch ? depthMatch[0].length : 0;
            
            // Clean up the name (remove symbols like ├──, └──, etc.)
            const cleanName = line.replace(/^[│|├└─\s\t]+/, '').trim();
            if (!cleanName) return;

            // Determine type
            const isFolder = cleanName.endsWith('/') || !cleanName.includes('.');
            const name = cleanName.replace(/\/$/, ''); // Remove trailing slash

            const newNode = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name: name,
                type: isFolder ? 'folder' : 'file',
                content: isFolder ? undefined : `// Code for ${name}`,
                children: isFolder ? [] : undefined
            };

            // Logic to find parent based on depth
            // We pop from stack until we find a parent with less depth
            // Note: This is a simplified heuristic. Tree formats vary, 
            // but this works for standard 'tree' command output.
            
            // Adjust depth logic for standard 2-space or 4-space indentation
            // If previous node was a folder and this line has more indent, it goes inside.
            
            // Simplified Stack Logic:
            // Always try to push to the last folder in stack.
            // If depth suggests we went back up, pop the stack.
            
            // (Strict tree parsing is complex, for now we assume flat list 
            // or simple indentation. In v2 we can add advanced tree parsing).
            
            // Fallback: Just push to root if flat, or naive nesting
            // Better Logic:
            const lastParent = stack[stack.length - 1];
            lastParent.children.push(newNode);

            if (isFolder) {
                stack.push({ depth: rawDepth, children: newNode.children });
            }
        });

        // 2. Update the Store
        fileSystem.loadNewProjectStructure("AI-Generated-Project", root);
        
        return true;
    }
};
