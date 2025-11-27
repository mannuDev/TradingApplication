# Fix .env file with correct MongoDB URI
$envContent = @"
PORT=5000
MONGO_URI=mongodb+srv://mannu:mannu%409988@mini-trading-app.ochevnx.mongodb.net/
JWT_SECRET=yourSecretKey
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
Write-Host ".env file updated successfully!"
Write-Host "MongoDB URI fixed: Password is now URL encoded (@ becomes %40)"

