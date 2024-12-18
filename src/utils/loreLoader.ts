import fs from 'fs/promises';
import path from 'path';

export async function loadLoreContext(context: string): Promise<string> {
  const loreDir = path.join(process.cwd(), 'app/data/Core Knowledge Base');
  
  try {
    // Load relevant lore files based on context
    const files = await fs.readdir(loreDir);
    const relevantFiles = files.filter(file => 
      file.toLowerCase().includes(context.toLowerCase())
    );

    let loreContent = '';
    for (const file of relevantFiles) {
      const content = await fs.readFile(path.join(loreDir, file), 'utf-8');
      loreContent += content + '\n';
    }

    return loreContent;

  } catch (error) {
    console.error('Error loading lore:', error);
    return 'Basic Aqua Prime setting and character guidelines';
  }
} 