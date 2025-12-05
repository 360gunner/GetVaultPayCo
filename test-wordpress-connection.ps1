# Test WordPress API Connection
# Usage: Run this in PowerShell to test if your credentials work

$username = "aurora"
$password = "i-09e34274a2f0bc206"
$baseUrl = "https://vaultpay.shop"

Write-Host "Testing WordPress API Connection..." -ForegroundColor Cyan
Write-Host "Site: $baseUrl" -ForegroundColor Gray
Write-Host "User: $username" -ForegroundColor Gray
Write-Host ""

# Create Basic Auth header
$credentials = "$username`:$password"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($credentials)
$base64 = [System.Convert]::ToBase64String($bytes)
$authHeader = "Basic $base64"

Write-Host "Step 1: Testing authentication..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod `
        -Uri "$baseUrl/wp-json/wp/v2/users/me" `
        -Method GET `
        -Headers @{
            "Authorization" = $authHeader
        } `
        -ErrorAction Stop

    Write-Host "✓ Authentication successful!" -ForegroundColor Green
    Write-Host "  User ID: $($response.id)" -ForegroundColor Gray
    Write-Host "  Username: $($response.username)" -ForegroundColor Gray
    Write-Host "  Email: $($response.email)" -ForegroundColor Gray
    Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor Gray
    Write-Host ""
    
    if ($response.roles -contains "administrator" -or $response.roles -contains "shop_manager") {
        Write-Host "✓ User has sufficient permissions for vendor creation" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: User may not have sufficient permissions" -ForegroundColor Yellow
        Write-Host "  Recommended roles: administrator or shop_manager" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "✗ Authentication failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - Incorrect username or password" -ForegroundColor Gray
    Write-Host "  - WordPress site not accessible" -ForegroundColor Gray
    Write-Host "  - REST API disabled on WordPress" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "Step 2: Testing WordPress REST API..." -ForegroundColor Yellow

try {
    $apiInfo = Invoke-RestMethod `
        -Uri "$baseUrl/wp-json" `
        -Method GET `
        -ErrorAction Stop
    
    Write-Host "✓ WordPress REST API is accessible" -ForegroundColor Green
    Write-Host "  WordPress Version: $($apiInfo.description)" -ForegroundColor Gray
    Write-Host "  Site Name: $($apiInfo.name)" -ForegroundColor Gray
} catch {
    Write-Host "✗ WordPress REST API not accessible" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 3: Testing Dokan API..." -ForegroundColor Yellow

try {
    $dokanInfo = Invoke-RestMethod `
        -Uri "$baseUrl/wp-json/dokan/v1" `
        -Method GET `
        -Headers @{
            "Authorization" = $authHeader
        } `
        -ErrorAction Stop
    
    Write-Host "✓ Dokan API is accessible" -ForegroundColor Green
    Write-Host "  Namespace: $($dokanInfo.namespace)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Dokan API not accessible" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Make sure Dokan plugin is installed and activated!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Create .env.local file with these credentials"
Write-Host "2. Restart your dev server: npm run dev"
Write-Host "3. Test vendor creation at /signup-business"
Write-Host ""
