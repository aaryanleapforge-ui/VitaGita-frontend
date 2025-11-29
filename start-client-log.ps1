$pkg = Get-Content package.json -Raw
if ($pkg -match '"vite"') { npm run dev -- --host 0.0.0.0 *>&1 | Tee-Object -FilePath client_start.log }
elseif ($pkg -match 'react-scripts') { $env:HOST='0.0.0.0'; npm start *>&1 | Tee-Object -FilePath client_start.log }
elseif ($pkg -match '"next"') { npm run dev *>&1 | Tee-Object -FilePath client_start.log }
else { npm start *>&1 | Tee-Object -FilePath client_start.log }
