#Requires -Version 5.1
# Privacy-safe, read-only Windows device-recovery diagnostics.
Set-StrictMode -Version 2.0
function Find-RecoveryExecutable {
 param([string]$Name,[string[]]$Candidates=@())
 foreach($candidate in $Candidates) {if($candidate -and (Test-Path -LiteralPath $candidate -PathType Leaf)){return $candidate}}
 $c=Get-Command -Name $Name -ErrorAction SilentlyContinue
 if($c){return [string]$c.Source}
 return $null
}
function ConvertTo-RecoveryDevice {
 param([Parameter(Mandatory=$true)]$Pnp)
 $id=[string]$Pnp.PNPDeviceID;$name=[string]$Pnp.Name;$family=$null
 if($id -match '(?i)VID_05AC'){$family='Apple'}
 elseif($id -match '(?i)VID_(18D1|04E8|22B8|12D1|2717|2A70|0BB4|1004|2D95|1949)' -or $name -match '(?i)\b(Android|ADB Interface|MTP Device)\b'){$family='Android'}
 elseif($name -match '(?i)\b(iPhone|iPad|iPod)\b'){$family='Apple'}
 if(!$family){return $null}
 $status=if([string]$Pnp.Status -eq 'OK'){'OK'}else{'Check driver / connection'}
 # Friendly names can contain previous owners' names: deliberately omit them.
 [pscustomobject]@{Family=$family;Description="$family USB interface";DriverStatus=$status;InterfaceOnly=$true}
}
function Get-ConnectedRecoveryDevices {
 $out=@()
 try {
  foreach($entity in @(Get-CimInstance Win32_PnPEntity -ErrorAction Stop)){
   $item=ConvertTo-RecoveryDevice -Pnp $entity
   if($null -ne $item){$out+=,$item}
  }
 }catch{}
 return $out
}
function Get-RecoveryToolStatus {
 $pf=[Environment]::GetFolderPath('ProgramFiles')
 $pf86=[Environment]::GetFolderPath('ProgramFilesX86')
 $local=[Environment]::GetFolderPath('LocalApplicationData')
 $itunes=Find-RecoveryExecutable 'iTunes.exe' @((Join-Path $pf 'iTunes\iTunes.exe'),(Join-Path $pf86 'iTunes\iTunes.exe'))
 $sideloadly=Find-RecoveryExecutable 'Sideloadly.exe' @((Join-Path $pf 'Sideloadly\Sideloadly.exe'),(Join-Path $pf86 'Sideloadly\Sideloadly.exe'),(Join-Path $local 'Programs\Sideloadly\Sideloadly.exe'))
 $appleApp=$false
 try{$appleApp=(@(Get-AppxPackage -Name '*AppleDevices*' -ErrorAction SilentlyContinue).Count -gt 0)}catch{}
 $service='Not installed'
 try{$svc=Get-Service -Name 'Apple Mobile Device Service' -ErrorAction SilentlyContinue;if($svc){$service=[string]$svc.Status}}catch{}
 [pscustomobject]@{
  ADB=Find-RecoveryExecutable 'adb.exe' @((Join-Path $local 'Android\Sdk\platform-tools\adb.exe'),(Join-Path $pf 'Android\platform-tools\adb.exe'))
  IdeviceInfo=Find-RecoveryExecutable 'ideviceinfo.exe'
  ITunesInstalled=[bool]$itunes;AppleDevicesInstalled=$appleApp
  SideloadlyPath=$sideloadly;AppleService=$service
 }
}
function Get-RecoveryWindowsHealth {
 $os='Unavailable';$architecture='Unavailable';$percent=$null;$batteryState='Unavailable';$diskCount=$null
 try{$v=Get-CimInstance Win32_OperatingSystem -ErrorAction Stop;$os=[string]$v.Caption;$architecture=[string]$v.OSArchitecture}catch{}
 try{
  $b=@(Get-CimInstance Win32_Battery -ErrorAction Stop)
  if($b.Count -gt 0){
   if($null -ne $b[0].EstimatedChargeRemaining){$percent=[int]$b[0].EstimatedChargeRemaining}
   $batteryState=if($b[0].BatteryStatus -eq 2){'AC indicated'}else{'Battery present'}
  }else{$batteryState='No battery reported'}
 }catch{}
 try{$diskCount=@(Get-CimInstance Win32_DiskDrive -ErrorAction Stop).Count}catch{}
 [pscustomobject]@{OperatingSystem=$os;Architecture=$architecture;BatteryPercent=$percent;BatteryStatus=$batteryState;BatteryHealth='Not measured (charge is not battery health)';DiskCount=$diskCount}
}
function Get-AppleReadOnlyDetails {
 param([string]$IdeviceInfo)
 $type='Unknown';$version='Unknown'
 if($IdeviceInfo){
  try{$raw=([string](& $IdeviceInfo -k ProductType 2>$null)).Trim();if($LASTEXITCODE -eq 0 -and $raw -match '^[A-Za-z0-9,]+$'){$type=$raw}}catch{}
  try{$raw=([string](& $IdeviceInfo -k ProductVersion 2>$null)).Trim();if($LASTEXITCODE -eq 0 -and $raw -match '^[0-9.]+$'){$version=$raw}}catch{}
 }
 [pscustomobject]@{Model=$type;IOS=$version;BatteryHealth='Unavailable from basic USB scan';ActivationLock='Not verifiable from USB scan';FirmwareSigning='Not checked'}
}
function Get-AndroidReadOnlyDetails {
 param([string]$Adb)
 $out=@();if(!$Adb){return $out}
 try{$lines=@(& $Adb devices 2>$null)}catch{return $out}
 foreach($line in $lines){
  if($line -match '^\s*(\S+)\s+(device|offline|unauthorized)\s*$'){
   $serial=$Matches[1];$state=$Matches[2];$model='Unavailable';$version='Unavailable';$level=$null;$codename='Unavailable'
   if($state -eq 'device'){
    try{$candidate=([string](& $Adb -s $serial shell getprop ro.product.model 2>$null)).Trim();if($candidate -and $candidate.Length -lt 80){$model=$candidate}}catch{}
    # Device codename (e.g. enchilada) is the key upstream OS projects use. It is a model identifier, not personal data.
    try{$candidate=([string](& $Adb -s $serial shell getprop ro.product.device 2>$null)).Trim();if($candidate -match '^[A-Za-z0-9_-]{1,40}$'){$codename=$candidate}}catch{}
    try{$candidate=([string](& $Adb -s $serial shell getprop ro.build.version.release 2>$null)).Trim();if($candidate -match '^[0-9A-Za-z._-]+$' -and $candidate.Length -lt 30){$version=$candidate}}catch{}
    try{
     foreach($entry in @(& $Adb -s $serial shell dumpsys battery 2>$null)){
      if($entry -match '^\s*level:\s*(\d+)\s*$'){$level=[int]$Matches[1];break}
     }
     if($null -ne $level -and ($level -lt 0 -or $level -gt 100)){$level=$null}
    }catch{}
   }
   # No serial, IMEI, user files or accounts in returned results.
   $out+=,[pscustomobject]@{Family='Android';Connection=$state;Model=$model;Codename=$codename;Android=$version;BatteryPercent=$level;BatteryHealth='Not measured'}
  }
 }
 return $out
}
function Get-AndroidAccountLockHint {
 # Privacy-safe, NON-authoritative. Mirrors the Apple ActivationLock field for Android.
 # An Android interface that is present but offers no authorised ADB shell commonly
 # indicates a factory-reset / Google account (FRP) lock. This is a hint only: it never
 # collects serial/IMEI/account data and never implies a bypass is available.
 param($DeviceInterfaces=@(),$AndroidDetails=@())
 $present=@($DeviceInterfaces | Where-Object {$_.Family -eq 'Android'}).Count -gt 0
 $authorised=@($AndroidDetails | Where-Object {$_.Connection -eq 'device'}).Count -gt 0
 if(!$present){return [pscustomobject]@{AccountLock='No Android interface detected';OwnershipAction='None'}}
 if($authorised){return [pscustomobject]@{AccountLock='Shell reachable; account lock not indicated by USB scan';OwnershipAction='Confirm ownership before any change'}}
 return [pscustomobject]@{
  AccountLock='Possible factory-reset / Google account lock (FRP) - not verifiable from USB scan'
  OwnershipAction='Verify ownership via manufacturer-supported process; do not attempt lock bypass'
 }
}
function Get-MobileOsDatabasePath {
 # Packaged next to the module in the release zip; in the repository it lives in data/.
 foreach($candidate in @((Join-Path $PSScriptRoot 'legacy-device-compatibility.csv'),(Join-Path $PSScriptRoot '..\..\data\legacy-device-compatibility.csv'))){
  if(Test-Path $candidate){return (Resolve-Path $candidate).Path}
 }
 return $null
}
function Get-MobileOsOptions {
 # Ranks EXISTING operating systems for one catalogued phone or tablet, most practical first.
 # Mirrors scripts/query_device_compatibility.py recommend(). Only an upstream project's own
 # device listing counts; a matching processor is never enough. The ownership gate comes first.
 param([string]$Codename,[string]$Ownership,[string]$DatabasePath=(Get-MobileOsDatabasePath))
 $app='Dubbo Reuse app on the existing Android: no unlocking or reflashing needed (Android 6+).'
 if(!(Test-RecoveryModificationPermission $Ownership)){
  return @('Ownership unresolved: an operating system cannot be replaced. Diagnostics only.')
 }
 if(!$Codename -or $Codename -eq 'Unavailable'){return @('Codename unavailable: connect with authorised USB debugging to identify the model.',$app)}
 if(!$DatabasePath -or !(Test-Path $DatabasePath)){return @('Compatibility database not found next to the toolkit.',$app)}
 $row=@(Import-Csv -Path $DatabasePath | Where-Object {$_.model_code -ieq $Codename})[0]
 if(!$row){return @("$Codename is not in the compatibility database yet: treat it as untested. Check upstream device lists (LineageOS, postmarketOS, Ubuntu Touch, Droidian) before planning a reinstall.",$app)}
 if($row.verification -in @('','EXAMPLE-UNVERIFIED','needs-confirmation')){return @("$($row.marketing_name): catalogue entry unverified; research upstream support first.",$app)}
 if($row.bootloader_unlock -eq 'no'){return @("$($row.marketing_name): the owner cannot unlock this bootloader. No OS replacement; never attempt a bypass.",$app)}
 $caveat=switch($row.bootloader_unlock){
  'carrier-dependent' {' Carrier-locked variants cannot be unlocked: check this exact unit first.'}
  'unknown' {' Bootloader unlockability is unknown: confirm before planning a reinstall.'}
  'yes' {' Unlocking erases the phone; the owner must remove their account first.'}
  default {''}
 }
 $opts=@()
 if($row.lineageos_official -eq 'maintained'){$opts+="LineageOS: officially maintained Android replacement.$caveat"}
 if($row.postmarketos_status -in @('main','community')){$opts+="postmarketOS: native Linux ($($row.postmarketos_status) category).$caveat"}
 if($row.ubuntu_touch_status -eq 'listed'){$opts+="Ubuntu Touch: listed upstream; use the UBports installer.$caveat"}
 if($row.droidian_status -eq 'listed'){$opts+="Droidian: Debian on Android hardware, listed upstream.$caveat"}
 if($row.postmarketos_status -eq 'testing'){$opts+="postmarketOS (testing): experimental, expect missing features.$caveat"}
 if($row.lineageos_official -eq 'unmaintained'){$opts+="LineageOS (unmaintained): no security updates; offline single-purpose use only.$caveat"}
 if($row.shipped_android -notin @('','n/a')){$opts+=$app}
 return $opts
}
function Test-RecoveryModificationPermission {param([string]$Ownership);return ($Ownership -eq 'Owned and authorised')}
function Get-RecoveryRecommendations {
 param([string]$Family,[string]$Version,[string]$Ownership,[string]$Codename)
 if(!(Test-RecoveryModificationPermission $Ownership)){
  return @('Ownership unresolved: diagnostics only; do not change apps or personal data.','Ask the original owner to remove their account or seek manufacturer help with proof of purchase.','Keep the device offline while its ownership is unclear.')
 }
 switch($Family){
  'Apple' {
   if($Version -match '^9\.'){
    return @('Offline PDF / ebook reader with licensed compatible apps.','Local media playback with files you may use.','Retro games and emulators only with legitimately acquired software.','Home dashboard is experimental: obsolete browsers may not load modern sites.','Avoid sensitive accounts on unsupported iOS.')
   }
   return @('Offline reading and media.','Home dashboard if compatible and supported.','Check apps and security updates before signing in.')
  }
  'Android' {
   $ideas=@('Offline ebook and document viewer.','Local media or legitimately owned games.','Home dashboard only if browsers remain updated.','Avoid sensitive accounts on unsupported Android.')
   if($Codename){$ideas+=@(Get-MobileOsOptions -Codename $Codename -Ownership $Ownership | ForEach-Object {'Operating system option: '+$_})}
   return $ideas
  }
  'Windows' {return @('Offline education / media machine.','Network diagnostic console.','Consider a lightweight Linux distribution after authorised backup.')}
  'Mac' {return @('Offline books, documents and media.','Local light-duty workstation.','Check storage, battery and supported macOS before repurposing.')}
  default {return @('Identify the model and OS before deciding on a secure reuse plan.')}
 }
}
function Get-RecoverySnapshot {
 $tools=Get-RecoveryToolStatus
 $interfaces=@(Get-ConnectedRecoveryDevices)
 $androidDetails=@(Get-AndroidReadOnlyDetails -Adb $tools.ADB)
 [pscustomobject]@{
  Tool='Device Recovery Toolkit';Version='2.1.0';Captured=(Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  DeviceInterfaces=$interfaces
  WindowsHost=Get-RecoveryWindowsHealth
  Apple=Get-AppleReadOnlyDetails -IdeviceInfo $tools.IdeviceInfo
  Android=$androidDetails
  AndroidAccountLock=Get-AndroidAccountLockHint -DeviceInterfaces $interfaces -AndroidDetails $androidDetails
  ToolAvailability=[pscustomobject]@{
   ADBInstalled=[bool]$tools.ADB;IdeviceInfoInstalled=[bool]$tools.IdeviceInfo
   ITunesInstalled=$tools.ITunesInstalled;AppleDevicesInstalled=$tools.AppleDevicesInstalled
   SideloadlyInstalled=[bool]$tools.SideloadlyPath;AppleService=$tools.AppleService
  }
  Disclaimer='USB interfaces are not guaranteed to equal distinct physical devices; do not infer ownership or lock status.'
 }
}
function Export-RecoverySnapshot {
 param([Parameter(Mandatory=$true)]$Snapshot,[Parameter(Mandatory=$true)][string]$Path)
 $ext=[System.IO.Path]::GetExtension($Path).ToLowerInvariant()
 if($ext -notin @('.json','.txt')){throw 'Only .json and .txt files supported.'}
 $lock=if($Snapshot.PSObject.Properties.Name -contains 'AndroidAccountLock'){$Snapshot.AndroidAccountLock}else{$null}
 $data=[pscustomobject]@{Tool=$Snapshot.Tool;Version=$Snapshot.Version;Captured=$Snapshot.Captured;DeviceInterfaces=$Snapshot.DeviceInterfaces;WindowsHost=$Snapshot.WindowsHost;Apple=$Snapshot.Apple;Android=$Snapshot.Android;AndroidAccountLock=$lock;ToolAvailability=$Snapshot.ToolAvailability;Disclaimer=$Snapshot.Disclaimer}
 $content=$data | ConvertTo-Json -Depth 7
 if($ext -eq '.txt'){$content='Device Recovery Toolkit - privacy-safe report'+[Environment]::NewLine+$content}
 [System.IO.File]::WriteAllText($Path,$content,(New-Object System.Text.UTF8Encoding($false)))
 return $Path
}
Export-ModuleMember -Function ConvertTo-RecoveryDevice,Get-ConnectedRecoveryDevices,Get-RecoveryToolStatus,Get-RecoveryWindowsHealth,Get-AppleReadOnlyDetails,Get-AndroidReadOnlyDetails,Get-AndroidAccountLockHint,Get-RecoveryRecommendations,Get-MobileOsOptions,Get-MobileOsDatabasePath,Test-RecoveryModificationPermission,Get-RecoverySnapshot,Export-RecoverySnapshot
