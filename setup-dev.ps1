# Build the shared module
Write-Host "Building shared module..."
cd shared
npm run build
cd ..

# Create a symlink in the auth service's node_modules
$authServicePath = ".\services\auth-service\node_modules\@quantummin"

# Create the directory if it doesn't exist
if (-not (Test-Path -Path $authServicePath)) {
    New-Item -ItemType Directory -Path $authServicePath -Force
}

# Remove the existing symlink if it exists
$symlinkPath = "$authServicePath\shared"
if (Test-Path -Path $symlinkPath) {
    Remove-Item -Path $symlinkPath -Recurse -Force
}

# Create a symlink to the shared module
$sharedPath = Resolve-Path "..\shared"
$symlink = New-Item -ItemType Junction -Path $symlinkPath -Target $sharedPath -Force

Write-Host "Symlink created at: $($symlink.FullName)"
Write-Host "Setup complete. You can now start the auth service."
