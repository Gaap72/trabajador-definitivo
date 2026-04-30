const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Shapes: Sharp, brutalist edges
    content = content.replace(/rounded-\[.*?\]/g, 'rounded-none');
    content = content.replace(/rounded-2xl/g, 'rounded-none');
    content = content.replace(/rounded-3xl/g, 'rounded-none');
    content = content.replace(/rounded-xl/g, 'rounded-none');
    content = content.replace(/rounded-lg/g, 'rounded-none');
    content = content.replace(/rounded-full/g, 'rounded-none'); 
    
    // 2. Backgrounds: Deep Dark Tech
    content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-black');
    content = content.replace(/bg-\[#F1F5F9\]/g, 'bg-black');
    content = content.replace(/bg-white\/80/g, 'bg-zinc-950/90 border-b border-cyan-900');
    content = content.replace(/bg-white/g, 'bg-zinc-950 border border-cyan-900/50');
    content = content.replace(/bg-slate-50/g, 'bg-zinc-900 border border-zinc-800');
    content = content.replace(/bg-slate-100/g, 'bg-zinc-800');
    content = content.replace(/bg-slate-900/g, 'bg-black border border-cyan-900');
    content = content.replace(/bg-slate-800/g, 'bg-zinc-900');

    // 3. Texts: Bright contrast
    content = content.replace(/text-slate-900/g, 'text-cyan-50');
    content = content.replace(/text-slate-800/g, 'text-cyan-100');
    content = content.replace(/text-slate-700/g, 'text-zinc-300');
    content = content.replace(/text-slate-500/g, 'text-zinc-400');
    content = content.replace(/text-slate-400/g, 'text-zinc-500');
    content = content.replace(/text-slate-300/g, 'text-zinc-600');
    content = content.replace(/text-slate-200/g, 'text-zinc-700');

    // 4. Borders
    content = content.replace(/border-slate-100/g, 'border-cyan-900/30');
    content = content.replace(/border-slate-200/g, 'border-cyan-900/50');
    content = content.replace(/border-slate-700/g, 'border-zinc-800');
    content = content.replace(/border-slate-800/g, 'border-zinc-900');

    // 5. Brand Colors: Cyan Neon
    content = content.replace(/bg-rose-50\/30/g, 'bg-cyan-950/50');
    content = content.replace(/bg-rose-50/g, 'bg-cyan-950');
    content = content.replace(/bg-rose-100/g, 'bg-cyan-900');
    content = content.replace(/bg-rose-500/g, 'bg-cyan-600');
    content = content.replace(/bg-rose-600/g, 'bg-cyan-500 text-black'); 
    content = content.replace(/bg-rose-700/g, 'bg-cyan-600 text-black');
    content = content.replace(/bg-rose-900/g, 'bg-cyan-900');
    
    content = content.replace(/text-rose-400/g, 'text-cyan-400');
    content = content.replace(/text-rose-500/g, 'text-cyan-400');
    content = content.replace(/text-rose-600/g, 'text-cyan-400');
    content = content.replace(/text-rose-700/g, 'text-cyan-300');
    content = content.replace(/text-rose-900/g, 'text-cyan-200');

    content = content.replace(/border-rose-100/g, 'border-cyan-900');
    content = content.replace(/border-rose-400/g, 'border-cyan-500');
    content = content.replace(/border-rose-500/g, 'border-cyan-400');
    
    content = content.replace(/ring-rose-400/g, 'ring-cyan-400');
    content = content.replace(/shadow-rose-100/g, 'shadow-[0_0_15px_rgba(6,182,212,0.3)]');
    
    // 6. Hovers & Shadows
    content = content.replace(/hover:bg-rose-50/g, 'hover:bg-cyan-950');
    content = content.replace(/hover:bg-rose-700/g, 'hover:bg-cyan-600');
    content = content.replace(/hover:text-rose-600/g, 'hover:text-cyan-300');
    content = content.replace(/hover:text-rose-500/g, 'hover:text-cyan-300');
    
    content = content.replace(/shadow-sm/g, 'shadow-none');
    content = content.replace(/shadow-xl/g, 'shadow-[0_0_10px_rgba(6,182,212,0.1)]');
    content = content.replace(/shadow-2xl/g, 'shadow-[0_0_20px_rgba(6,182,212,0.2)]');

    // 7. Typography (Monospace / Hacker look)
    content = content.replace(/font-sans/g, 'font-mono uppercase tracking-widest');
    content = content.replace(/tracking-tight/g, 'tracking-[0.2em]');
    content = content.replace(/tracking-tighter/g, 'tracking-[0.1em]');
    
    // 8. Change emerald (green) to lime for matrix vibes
    content = content.replace(/emerald/g, 'lime');

    fs.writeFileSync(file, content, 'utf8');
});

// Extra fix for globals.css
let globalsPath = './src/app/globals.css';
if(fs.existsSync(globalsPath)) {
    let globals = fs.readFileSync(globalsPath, 'utf8');
    globals = globals.replace('--background: #F8FAFC;', '--background: #000000;');
    globals = globals.replace('--foreground: #0F172A;', '--foreground: #e4e4e7;');
    globals = globals.replace(/font-family: 'Inter', system-ui, sans-serif;/g, 'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; letter-spacing: 0.05em;');
    fs.writeFileSync(globalsPath, globals, 'utf8');
}

console.log('Restyling completo.');