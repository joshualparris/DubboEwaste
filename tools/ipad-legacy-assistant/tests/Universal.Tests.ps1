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
# Mobile OS options: ranked from the shared compatibility database, ownership-gated, never inferred from SoC.
$db=Get-MobileOsDatabasePath
Check ([bool]$db) 'Compatibility database found from the module'
$gated=@(Get-MobileOsOptions -Codename 'enchilada' -Ownership 'Unknown / unverified' -DatabasePath $db)
Check ($gated.Count -eq 1 -and $gated[0] -match 'Ownership unresolved') 'OS replacement is ownership gated'
$op6=@(Get-MobileOsOptions -Codename 'enchilada' -Ownership 'Owned and authorised' -DatabasePath $db)
Check ($op6[0] -match '^LineageOS:') 'Maintained LineageOS ranked first'
Check ((($op6 -join ' ') -match 'postmarketOS') -and (($op6 -join ' ') -match 'Ubuntu Touch') -and (($op6 -join ' ') -match 'Droidian')) 'All listed Linux options offered'
Check ($op6[-1] -match '^Dubbo Reuse app') 'App fallback last'
$huawei=@(Get-MobileOsOptions -Codename 'AMN-LX2' -Ownership 'Owned and authorised' -DatabasePath $db)
Check ($huawei.Count -eq 2 -and $huawei[0] -match 'cannot unlock' -and $huawei[1] -match 'Dubbo Reuse app') 'Locked Huawei gets app only, no bypass'
$unknownPhone=@(Get-MobileOsOptions -Codename 'notarealphone' -Ownership 'Owned and authorised' -DatabasePath $db)
Check ($unknownPhone[0] -match 'not in the compatibility database') 'Uncatalogued phone treated as untested'
$pine=@(Get-MobileOsOptions -Codename 'pinephone' -Ownership 'Owned and authorised' -DatabasePath $db)
Check (-not (($pine -join ' ') -match 'Dubbo Reuse app')) 'No Android app offered for a Linux phone'
$androidIdeas=@(Get-RecoveryRecommendations -Family Android -Version '11' -Ownership 'Owned and authorised' -Codename 'sargo')
Check ((($androidIdeas -join ' ') -match 'Operating system option: LineageOS') -and (($androidIdeas -join ' ') -match 'Carrier-locked')) 'Android ideas include ranked OS options with carrier caveat'
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
# Android account-lock hint: privacy-safe, non-authoritative, boundary-reinforcing.
$lockNone=Get-AndroidAccountLockHint -DeviceInterfaces @() -AndroidDetails @()
Check ($lockNone.AccountLock -match 'No Android interface') 'No Android interface => no lock hint'
$androidIface=@([pscustomobject]@{Family='Android'})
$lockFrp=Get-AndroidAccountLockHint -DeviceInterfaces $androidIface -AndroidDetails @()
Check ($lockFrp.AccountLock -match 'FRP') 'Interface present without authorised shell => possible FRP hint'
Check ($lockFrp.OwnershipAction -match 'do not attempt lock bypass') 'FRP hint reinforces the no-bypass boundary'
$lockOk=Get-AndroidAccountLockHint -DeviceInterfaces $androidIface -AndroidDetails @([pscustomobject]@{Family='Android';Connection='device'})
Check ($lockOk.AccountLock -notmatch 'FRP') 'Authorised shell is not flagged as a lock'
$lockSample=[pscustomobject]@{
 Tool='Device Recovery Toolkit';Version='2.1.0';Captured='2026-11-25'
 DeviceInterfaces=@($android);WindowsHost=[pscustomobject]@{BatteryPercent=50;BatteryHealth='Not measured'}
 Apple=[pscustomobject]@{Model='Unknown';IOS='Unknown';ActivationLock='Not verifiable'}
 Android=@($android);AndroidAccountLock=$lockFrp
 ToolAvailability=[pscustomobject]@{ADBInstalled=$false;AppleService='Not installed'};Disclaimer='USB data is limited'
}
$lockReport=Join-Path $env:TEMP ('recovery-lock-'+[guid]::NewGuid().ToString('N')+'.json')
try{
 [void](Export-RecoverySnapshot -Snapshot $lockSample -Path $lockReport)
 $ltxt=[System.IO.File]::ReadAllText($lockReport)
 Check ($ltxt -match 'AndroidAccountLock') 'Export carries the Android account-lock hint'
 Check ($ltxt -match 'do not attempt lock bypass') 'Exported hint keeps the no-bypass boundary'
}finally{Remove-Item -LiteralPath $lockReport -Force -ErrorAction SilentlyContinue}
Write-Host 'PASS: universal toolkit parser, classifiers, permission gates, reuse, account-lock hint, privacy-safe export.'
