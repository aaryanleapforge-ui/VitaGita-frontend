$pkg = Get-Content package.json -Raw
if ($pkg -match '"vite"') { npm run dev -- --host }
elseif ($pkg -match 'react-scripts') { $env:HOST='0.0.0.0'; npm start }
elseif ($pkg -match '"next"') { npm run dev }
else { npm start }
