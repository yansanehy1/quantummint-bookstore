const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'services');

function repairFile(filePath) {
    console.log(`Checking ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match the inserted tsconfig block
    // It looks like:
    // {
    //   "extends": "../../tsconfig.base.json",
    //   ...
    // }
    // It might be preceded by a comma if it was inserted after an object, 
    // or it might cause a syntax error if inserted elsewhere.
    // The block seems to start with { and contains "extends": "../../tsconfig.base.json"

    const regex = /,\s*\{\s*"extends":\s*"\.\.\/\.\.\/tsconfig\.base\.json"[\s\S]*?\}\s*(?=,|}])|^\s*\{\s*"extends":\s*"\.\.\/\.\.\/tsconfig\.base\.json"[\s\S]*?\}\s*,?/m;

    // Actually, let's be more specific to the content we saw.
    // The block is:
    /*
      {
      "extends": "../../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src"
      },
      "include": ["src/**\/*"],
      "exclude": ["node_modules", "dist"]
      }
    */

    const blockRegex = /\s*\{\s*"extends":\s*"\.\.\/\.\.\/tsconfig\.base\.json",\s*"compilerOptions":\s*\{[\s\S]*?\},\s*"include":\s*\[[\s\S]*?\],\s*"exclude":\s*\[[\s\S]*?\]\s*\},?/g;

    if (blockRegex.test(content)) {
        console.log(`Found corruption in ${filePath}. Repairing...`);
        let newContent = content.replace(blockRegex, '');

        // Also fix the double command in scripts if present
        // "build": "tsc",    "start": "node dist/index.js",
        // This might be tricky with regex, but let's try to fix the specific pattern we saw in moderation-service
        const scriptRegex = /"build": "tsc",\s+"start": "node dist\/index\.js",/g;
        if (scriptRegex.test(newContent)) {
            console.log(`Fixing scripts line in ${filePath}...`);
            newContent = newContent.replace(scriptRegex, '"build": "tsc",\n    "start": "node dist/index.js",');
        }

        // Clean up potential double commas or trailing commas before closing brace
        // This is a simple heuristic, might need more care
        newContent = newContent.replace(/,(\s*\})/g, '$1');

        fs.writeFileSync(filePath, newContent);
        console.log(`Repaired ${filePath}`);
    } else {
        console.log(`No corruption found in ${filePath} (or regex didn't match).`);
        // Check if it has the specific string but regex failed
        if (content.includes('tsconfig.base.json') && content.includes('"extends":')) {
            // It might be valid if it's a tsconfig.json, but this is package.json
            // So if it's package.json, it's likely corrupt if it has this.
            console.log(`WARNING: File ${filePath} contains 'tsconfig.base.json' but regex didn't match.`);
        }
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules') {
                traverseDir(fullPath);
            }
        } else if (file === 'package.json') {
            repairFile(fullPath);
        }
    }
}

traverseDir(servicesDir);
