Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "    Starting LiveCollab (Backend + Frontend) on Windows" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot
npm run dev
