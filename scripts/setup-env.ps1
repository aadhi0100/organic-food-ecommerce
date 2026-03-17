param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function New-RandomHex([int]$Bytes) {
  $buffer = New-Object byte[] $Bytes
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buffer)
  return ([System.BitConverter]::ToString($buffer)).Replace("-", "").ToLowerInvariant()
}

$root = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $root ".env.local"

if ((Test-Path $envPath) -and -not $Force) {
  Write-Host "Exists: $envPath"
  Write-Host "Re-run with -Force to overwrite."
  exit 0
}

$sessionSecret = New-RandomHex 32

$content = @"
# Local development environment variables (DO NOT COMMIT)
APP_BASE_URL=http://localhost:3000
APP_SESSION_SECRET=$sessionSecret

# Google OAuth 2.0 (create in Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Optional role mapping (comma-separated)
AUTH_ADMIN_EMAILS=
AUTH_VENDOR_EMAILS=
"@

Set-Content -Path $envPath -Value $content -Encoding ASCII

Write-Host "Wrote: $envPath"
Write-Host "Next: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then restart 'npm run dev'."
