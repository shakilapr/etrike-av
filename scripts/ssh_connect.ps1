param(
    [string]$Command = "echo 'Connected' && hostname"
)

$plinkPath = "C:\Program Files\PuTTY\plink.exe"
$host_ip = "172.16.25.56"
$username = "med1"
$password = "med1"

# Create a script to handle the host key acceptance
$expectScript = @"
spawn "$plinkPath" -ssh -l $username -pw $password $host_ip "$Command"
expect {
    "The host key is not cached" {
        send "y\r"
        exp_continue
    }
    "Store key in cache" {
        send "y\r"
        exp_continue
    }
    eof
}
"@

# Write the expect script to a temporary file
$tempFile = [System.IO.Path]::GetTempFileName() + ".exp"
Set-Content -Path $tempFile -Value $expectScript

# Try to run with expect if available
try {
    & expect $tempFile
} catch {
    Write-Host "Expect not available, trying alternative method..."
    
    # Alternative: Use plink with -batch flag and accept the key manually first
    Write-Host "Please run this command manually first to accept the host key:"
    Write-Host "  & '$plinkPath' -ssh -l $username -pw $password $host_ip 'echo test'"
    Write-Host ""
    Write-Host "Then run this script again."
} finally {
    # Clean up
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}
