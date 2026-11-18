#Requires -Version 5.1
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
$paths=@('DeviceRecovery.Core.psm1','DeviceRecoveryToolkit.ps1','iPadLegacyAssistant.ps1','tests/Universal.Tests.ps1','tests/Smoke.Tests.ps1')
foreach($relative in $paths){
 $path=Join-Path $root $relative
 if(!(Test-Path $path)){throw "Missing file $relative"}
 $tokens=$null;$errors=$null
 [void][System.Management.Automation.Language.Parser]::ParseFile($path,[ref]$tokens,[ref]$errors)
 if(@($errors).Count -gt 0){throw "PowerShell parse error in $relative : $($errors[0])"}
}
Import-Module (Join-Path $root 'DeviceRecovery.Core.psm1') -Force
function Check([bool]$Condition,[string]$Message) {if(!$Condition){throw "FAILED: $Message"}}
$apple=ConvertTo-RecoveryDevice -Pnp ([pscustomobject]@{PNPDeviceID='USB\VID_05AC&PID_1234\SECRET-DEVICE-ID';Name='Matisse iPad';Status='OK'})
Check ($apple.Family -eq 'Apple') 'Apple vendor detection'
Check ($apple.Description -eq 'Apple USB interface') 'No owner name displayed'
Check (-not ($apple | ConvertTo-Json).Contains('SECRET-DEVICE-ID')) 'No USB ID leaks'
$android=ConvertTo-RecoveryDevice -Pnp ([pscustomobject]@{PNPDeviceID='USB\VID_18D1&PID_0001\1234';Name='Android Device';Status='Error'})
Check ($android.Family -eq 'Android') 'Android vendor detection'
Check ($android.DriverStatus -match 'Check') 'Driver issue visible'
$printer=ConvertTo-RecoveryDevice -Pnp ([pscustomobject]@{PNPDeviceID='USB\VID_1234&PID_0001';Name='Printer';Status='OK'})
Check ($null -eq $printer) 'Ignore unrelated hardware'
Check (-not (Test-RecoveryModificationPermission -Ownership 'Unknown / unverified')) 'Unknown ownership gate'
Check (-not (Test-RecoveryModificationPermission -Ownership 'Organisation-managed')) 'Organisation device gate'
Check (Test-RecoveryModificationPermission -Ownership 'Owned and authorised') 'Owned-and-authorised gate'
$unknown=@(Get-RecoveryRecommendations -Family Apple -Version '9.3.6' -Ownership 'Unknown / unverified')
Check (($unknown -join ' ') -match 'Ownership unresolved') 'Repurpose ideas are ownership gated'
$owned=@(Get-RecoveryRecommendations -Family Apple -Version '9.3.6' -Ownership 'Owned and authorised')
Check (($owned -join ' ') -match 'PDF') 'iOS 9 ideas present'
$sample=[pscustomobject]@{
 Tool='Device Recovery Toolkit';Version='2.0.0';Captured='2026-11-18'
 DeviceInterfaces=@($apple);WindowsHost=[pscustomobject]@{BatteryPercent=63;BatteryHealth='Not measured'}
 Apple=[pscustomobject]@{Model='iPad3,3';IOS='9.3.6';ActivationLock='Not verifiable'}
 Android=@($android)
 ToolAvailability=[pscustomobject]@{ADBInstalled=$false;AppleService='Not installed'}
 Disclaimer='USB data is limited'
 ExtraPrivate='SECRET-DEVICE-ID'
}
$report=Join-Path $env:TEMP ('recovery-smoke-'+[guid]::NewGuid().ToString('N')+'.json')
try{
 [void](Export-RecoverySnapshot -Snapshot $sample -Path $report)
 $txt=[System.IO.File]::ReadAllText($report)
 Check ($txt -match 'Device Recovery Toolkit') 'Export includes tool'
 Check (!$txt.Contains('SECRET-DEVICE-ID')) 'Export does not copy extra private fields'
 Check ($txt -match 'Not measured') 'Health unknown retained'
}finally{Remove-Item -LiteralPath $report -Force -ErrorAction SilentlyContinue}
$badReport=Join-Path $env:TEMP 'recovery-test.exe'
$rejected=$false
try{Export-RecoverySnapshot -Snapshot $sample -Path $badReport | Out-Null}catch{$rejected=$true}
Check $rejected 'Unsafe report extension rejected'
Check (@(Get-AndroidReadOnlyDetails -Adb '').Count -eq 0) 'Missing ADB reports zero Android devices'
Write-Host 'PASS: universal toolkit parser, classifiers, permission gates, reuse, privacy-safe export.'
