import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist', 'index.html');
const outputPath = path.join(process.cwd(), 'gas-files', 'index.html');

if (fs.existsSync(distPath)) {
  let html = fs.readFileSync(distPath, 'utf8');

  // 1. 移除 type="module" (GAS 不支援)
  // 只替換屬性，不更動標籤位置，避免誤殺 JS 內的字串
  html = html.replace(/\s+type=["']module["']/g, '');
  
  // 2. 徹底移除 crossorigin 屬性 (GAS 不支援且會報錯)
  html = html.replace(/\s+crossorigin(="[^"]*")?/g, '');
  
  // 3. 搬移所有 <script> 標籤到 </body> 之前，確保 DOM 已準備好 (解決 React #299 錯誤)
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts: string[] = [];
  let match;
  
  // 提取所有腳本
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[0]);
  }
  
  // 從原始 HTML 中移除腳本
  html = html.replace(scriptRegex, '');
  
  // 確保結尾標籤後有換行
  html = html.replace(/<\/style>/g, '<\/style>\n');
  
  // 將腳本重新插入到 </body> 之前
  const scriptsJoined = scripts.join('\n');
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${scriptsJoined}\n</body>`);
  } else {
    html += `\n${scriptsJoined}`;
  }

  fs.writeFileSync(outputPath, html);
  console.log('Successfully generated robust GAS index.html');
} else {
  console.error('dist/index.html not found! Please run build first.');
}
