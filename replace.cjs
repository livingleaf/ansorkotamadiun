const fs = require('fs');
const path = require('path');

const iconMapping = {
    'search': 'Search',
    'cloud_upload': 'UploadCloud',
    'arrow_forward': 'ArrowRight',
    'arrow_back': 'ArrowLeft',
    'construction': 'Wrench',
    'error': 'AlertCircle',
    'picture_as_pdf': 'FileText',
    'close': 'X',
    'draw': 'Pen',
    'progress_activity': 'Loader2',
    'signature': 'PenTool',
    'download': 'Download',
    'add_photo_alternate': 'ImagePlus',
    'delete': 'Trash2',
    'upload_file': 'FileUp',
    'description': 'FileText',
    'lock': 'Lock',
    'visibility': 'Eye',
    'visibility_off': 'EyeOff',
    'splitscreen': 'SplitSquareHorizontal',
    'join_inner': 'Combine',
    'compress': 'Shrink',
    'table': 'Table',
    'image': 'Image',
    'insert_photo': 'ImagePlus',
    'document_scanner': 'ScanText',
    'menu': 'Menu',
    'verified_user': 'ShieldCheck',
    'play_circle': 'PlayCircle',
    'add': 'Plus'
};

const files = [
    'src/lib/components/HowItWorks.svelte',
    'src/lib/components/Hero.svelte',
    'src/lib/components/Navbar.svelte',
    'src/routes/tools/split/+page.svelte',
    'src/routes/tools/pdf-to-jpg/+page.svelte',
    'src/routes/tools/merge/+page.svelte',
    'src/routes/tools/protect/+page.svelte',
    'src/routes/tools/image-to-pdf/+page.svelte',
    'src/routes/tools/sign/+page.svelte',
    'src/routes/+page.svelte',
    'src/routes/coming-soon/+page.svelte'
];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const usedIcons = new Set();
    
    // Sometimes the class attribute might have material-symbols-outlined inside
    const regex = /<span\s+class="([^"]*material-symbols-outlined[^"]*)"([^>]*)>\s*({showPassword \? 'visibility_off' : 'visibility'}|[a-zA-Z0-9_]+)\s*<\/span>/g;
    
    content = content.replace(regex, (match, classAttr, otherAttrs, iconName) => {
        let newClassAttr = classAttr.replace('material-symbols-outlined', '').replace(/\s+/g, ' ').trim();
        
        if (iconName === "{showPassword ? 'visibility_off' : 'visibility'}") {
            usedIcons.add('Eye');
            usedIcons.add('EyeOff');
            return `{#if showPassword}\n  <EyeOff class="${newClassAttr}" ${otherAttrs} />\n{:else}\n  <Eye class="${newClassAttr}" ${otherAttrs} />\n{/if}`;
        }

        const lucideComponent = iconMapping[iconName] || 'HelpCircle';
        usedIcons.add(lucideComponent);
        return `<${lucideComponent} class="${newClassAttr}"${otherAttrs} />`;
    });

    if (usedIcons.size > 0) {
        const importStatement = `import { ${Array.from(usedIcons).join(', ')} } from '@lucide/svelte';\n`;
        if (content.includes('<script>')) {
            content = content.replace('<script>', `<script>\n    ${importStatement}`);
        } else {
            content = `<script>\n    ${importStatement}</script>\n\n` + content;
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
}
