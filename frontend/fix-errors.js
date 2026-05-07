// fix-errors.js
const fs = require('fs');
const path = require('path');

// Fix type imports (change `import { Type }` to `import type { Type }`)
function fixTypeImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const typeImports = content.match(/import\s+{\s*([^}]+)\s*}\s+from\s+['"](.+)['"]/g);
  
  if (typeImports) {
    typeImports.forEach(match => {
      const types = match.match(/{\s*([^}]+)\s*}/)[1];
      const typesList = types.split(',').map(t => t.trim());
      
      // Check if these are likely types (interfaces, types)
      const isTypeImport = typesList.some(t => 
        t === 'User' || t === 'Item' || t === 'Claim' || t === 'Verification' || 
        t === 'ItemFilters' || t === 'LucideProps'
      );
      
      if (isTypeImport) {
        const newImport = match.replace('import {', 'import type {');
        content = content.replace(match, newImport);
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Remove unused imports
function removeUnusedImports(filePath, unusedImports) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  unusedImports.forEach(imp => {
    const regex = new RegExp(`\\b${imp}\\b,\\s*|,\\s*\\b${imp}\\b|\\b${imp}\\b\\s*,`, 'g');
    content = content.replace(regex, '');
  });
  
  // Clean up double commas and trailing commas
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/{\s*,/g, '{');
  content = content.replace(/,\s*}/g, '}');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned: ${filePath}`);
}

// Fix specific files
const fixes = [
  {
    file: 'src/api/socket.api.ts',
    fix: () => {
      let content = fs.readFileSync('src/api/socket.api.ts', 'utf8');
      content = content.replace('interface SocketEvents {', '// interface SocketEvents {');
      fs.writeFileSync('src/api/socket.api.ts', content);
    }
  },
  {
    file: 'src/store/auth.store.ts',
    fix: () => fixTypeImports('src/store/auth.store.ts')
  },
  {
    file: 'src/store/item.store.ts',
    fix: () => fixTypeImports('src/store/item.store.ts')
  },
  {
    file: 'src/store/user.store.ts',
    fix: () => fixTypeImports('src/store/user.store.ts')
  },
  {
    file: 'src/store/verification.store.ts',
    fix: () => fixTypeImports('src/store/verification.store.ts')
  }
];

// Run fixes
fixes.forEach(f => {
  if (fs.existsSync(f.file)) {
    f.fix();
  }
});

console.log('✅ All fixes applied!');