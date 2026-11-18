#Requires -Version 5.1
param([switch]$Scan,[switch]$NoGui)
# iPad Legacy Assistant: local USB diagnostics and safe jailbreak preparation.
# ARCHIVED historical experiment. Read-only diagnosis; prepares (never runs) a jailbreak.
# -Scan : run the diagnostic headless (no GUI), print and save a report, then exit.
Set-StrictMode -Version 2.0
$ErrorActionPreference='Stop'
[System.Net.ServicePointManager]::SecurityProtocol=[System.Net.SecurityProtocolType]::Tls12
# Best-effort DPI awareness so the WinForms UI is not blurry on HiDPI displays.
try{Add-Type -Namespace IplaNative -Name Dpi -MemberDefinition '[System.Runtime.InteropServices.DllImport("user32.dll")] public static extern bool SetProcessDPIAware();' -ErrorAction SilentlyContinue;[void][IplaNative.Dpi]::SetProcessDPIAware()}catch{}

$script:AppDir=Join-Path $env:LOCALAPPDATA 'iPadLegacyAssistant'
$script:DownloadDir=Join-Path $script:AppDir 'Downloads'
$script:ToolsDir=Join-Path $script:AppDir 'tools'
$script:LogFile=Join-Path $script:AppDir ('session-{0:yyyyMMdd-HHmmss}.log' -f (Get-Date))
[void][System.IO.Directory]::CreateDirectory($script:DownloadDir)
[void][System.IO.Directory]::CreateDirectory($script:ToolsDir)
$script:LastScan=$null
$script:log=$null
# Advanced opt-in: a GitHub repo the user explicitly trusts for a Windows ideviceinfo build.
$script:HelperRepo=[string]$env:IPADLEGACY_HELPER_REPO

function Log([string]$text){
 $line=('{0:HH:mm:ss}  {1}' -f (Get-Date),$text)
 try{Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8}catch{}
 if($script:log){$script:log.AppendText($line+[Environment]::NewLine)}else{Write-Host $line}
}
function Open-Official([string]$url){
 if($url -notmatch '^https://(sideloadly\.io|ios\.cfw\.guide|phoenixpwn\.com|github\.com|libimobiledevice\.org|support\.apple\.com)/'){throw 'Untrusted destination.'}
 Start-Process $url | Out-Null
}
function Find-Exe([string]$cmd,[string[]]$paths){
 foreach($p in $paths){ if($p -and (Test-Path -LiteralPath $p -PathType Leaf)){return $p} }
 $c=Get-Command $cmd -ErrorAction SilentlyContinue
 if($c){return [string]$c.Source}
 return $null
}
function Resolve-Helper {
 # Locate a read-only ideviceinfo across PATH and common toolkits. No download here.
 $pf=[Environment]::GetFolderPath('ProgramFiles');$pfx=[Environment]::GetFolderPath('ProgramFilesX86')
 $cands=@(
  (Join-Path $script:ToolsDir 'ideviceinfo.exe'),
  (Join-Path $env:USERPROFILE 'scoop\shims\ideviceinfo.exe'),
  (Join-Path $env:ProgramData 'chocolatey\bin\ideviceinfo.exe'),
  'C:\msys64\clang64\bin\ideviceinfo.exe','C:\msys64\ucrt64\bin\ideviceinfo.exe','C:\msys64\mingw64\bin\ideviceinfo.exe',
  (Join-Path $pf 'libimobiledevice\ideviceinfo.exe'),(Join-Path $pfx 'libimobiledevice\ideviceinfo.exe'),
  (Join-Path $pfx '3uTools\ideviceinfo.exe'),(Join-Path $pf 'iMazing\ideviceinfo.exe'))
 return (Find-Exe 'ideviceinfo.exe' $cands)
}
function Invoke-GitHubJson([string]$uri){
 try{ return Invoke-RestMethod -Uri $uri -Headers @{'User-Agent'='iPadLegacyAssistant/2.0'} -TimeoutSec 30 }
 catch{
  $resp=$_.Exception.Response
  if($resp -and ([int]$resp.StatusCode) -eq 403){throw 'GitHub API rate limit reached (HTTP 403). Wait ~1 hour or use the Releases page button to download manually.'}
  if($_.Exception.Message -match 'remote name|resolve|unable to connect|No such host|timed out|SSL'){throw 'Could not reach GitHub (no internet or blocked). Check your connection, or use the Releases page button.'}
  throw ('GitHub request failed: '+$_.Exception.Message)
 }
}
$script:ModelMap=@{'iPad3,1'='iPad 3 (Wi-Fi)';'iPad3,2'='iPad 3 (Cellular, CDMA)';'iPad3,3'='iPad 3 (Cellular, GSM)';'iPad3,4'='iPad 4 (Wi-Fi)';'iPad3,5'='iPad 4 (Cellular)';'iPad3,6'='iPad 4 (Cellular MM)'}
function Scan-AppleDevice {
 # Read Windows device metadata only. No user files, identifiers, or account data.
 $dev=@(Get-CimInstance Win32_PnPEntity | Where-Object { $_.PNPDeviceID -match '(?i)VID_05AC' })
 $bad=@($dev | Where-Object {$_.Status -ne 'OK'}).Count
 $svc=Get-Service -Name 'Apple Mobile Device Service' -ErrorAction SilentlyContinue
 $pf=[Environment]::GetFolderPath('ProgramFiles');$pfx=[Environment]::GetFolderPath('ProgramFilesX86')
 $itunes=Find-Exe 'iTunes.exe' @((Join-Path $pf 'iTunes\iTunes.exe'),(Join-Path $pfx 'iTunes\iTunes.exe'))
 $side=Find-Exe 'Sideloadly.exe' @((Join-Path $pf 'Sideloadly\Sideloadly.exe'),(Join-Path $pfx 'Sideloadly\Sideloadly.exe'),(Join-Path $env:LOCALAPPDATA 'Programs\Sideloadly\Sideloadly.exe'))
 $idevice=Resolve-Helper
 $helper=[bool]$idevice;$model='Unknown';$ios='Unknown'
 if($dev.Count -gt 0 -and $idevice){
   $pt='';try{$pt=([string](& $idevice -k ProductType 2>$null | Select-Object -First 1)).Trim()}catch{}
   try{$ios=([string](& $idevice -k ProductVersion 2>$null | Select-Object -First 1)).Trim()}catch{}
   if($pt){$model=if($script:ModelMap.ContainsKey($pt)){$script:ModelMap[$pt]+' ['+$pt+']'}else{$pt}}
   if([string]::IsNullOrWhiteSpace($ios)){$ios='Unknown'}
 }elseif($dev.Count -gt 0){
   $model='Install device-info helper to read';$ios='Install device-info helper to read'
 }
 [pscustomobject]@{Connected=$dev.Count -gt 0;UsbCount=$dev.Count;DriverIssue=$bad -gt 0;
  AppleService=if($svc){[string]$svc.Status}else{'Missing'};ITunes=[bool]$itunes;
  Sideloadly=[bool]$side;SideloadlyExe=$side;Helper=$helper;Model=$model;IOS=$ios}
}
function Get-Readiness($s){
 if(-not $s){return [pscustomobject]@{Ready=$false;Score=0;Max=5;Supported=$false;Missing=@('Run Scan first')}}
 $m=@()
 if(-not $s.Connected){$m+='iPad not detected on USB'}
 if($s.DriverIssue -or $s.AppleService -ne 'Running'){$m+='Apple driver/service not ready (install web iTunes)'}
 $supported=($s.Model -match 'iPad3,' -and $s.IOS -eq '9.3.6')
 if(-not $supported){$m+='Supported device not confirmed (need iPad3,x on iOS 9.3.6; a helper reads this)'}
 if(-not $s.ITunes){$m+='Web iTunes not found (Sideloadly needs it)'}
 if(-not $s.Sideloadly){$m+='Sideloadly not installed'}
 [pscustomobject]@{Ready=($m.Count -eq 0);Score=(5-$m.Count);Max=5;Supported=$supported;Missing=$m}
}
function Download-OfficialIpa {
 $api='https://api.github.com/repos/LukeZGD/EverPwnage/releases/latest'
 $release=Invoke-GitHubJson $api
 if(!$release -or !$release.tag_name){throw 'Incomplete official GitHub release data.'}
 $assets=@($release.assets | Where-Object {$_.name -match '(?i)\.ipa$'})
 if($assets.Count -eq 0){throw "The latest EverPwnage release ($($release.tag_name)) has no .ipa asset. Use 'Official EverPwnage releases' to pick the correct file manually."}
 $asset=@($assets | Sort-Object {[long]$_.size} -Descending)[0]
 $note=if($assets.Count -gt 1){'Multiple IPAs found ('+(($assets|ForEach-Object{$_.name}) -join ', ')+'); selected largest: '+$asset.name}else{''}
 $url=[uri]$asset.browser_download_url
 if($url.Scheme -ne 'https' -or $url.Host -ne 'github.com' -or
   !$url.AbsolutePath.StartsWith('/LukeZGD/EverPwnage/releases/download/',[System.StringComparison]::OrdinalIgnoreCase)){
   throw 'Refusing unexpected download URL.'
 }
 $digest='';if(($asset.PSObject.Properties.Name -contains 'digest') -and $asset.digest){$digest=[string]$asset.digest}
 $name=([string]$release.tag_name+'-'+[string]$asset.name) -replace '[^a-zA-Z0-9_.-]','_'
 $dest=Join-Path $script:DownloadDir $name; $part="$dest.partial"
 try{
   Invoke-WebRequest -Uri $url.AbsoluteUri -OutFile $part -UseBasicParsing -TimeoutSec 120 -Headers @{'User-Agent'='iPadLegacyAssistant/2.0'}
   $file=Get-Item -LiteralPath $part
   if($file.Length -lt 1024 -or ($asset.size -gt 0 -and $file.Length -ne [long]$asset.size)){throw 'Download size mismatch.'}
   $stream=[System.IO.File]::OpenRead($part)
   try{if($stream.ReadByte() -ne 80 -or $stream.ReadByte() -ne 75){throw 'Downloaded file is not a ZIP-based IPA.'}}
   finally{$stream.Dispose()}
   $hash=(Get-FileHash -LiteralPath $part -Algorithm SHA256).Hash
   $verified=$false
   if($digest -match '^sha256:([0-9a-fA-F]{64})$'){
     if($matches[1].ToLower() -ne $hash.ToLower()){throw 'SHA-256 does not match the digest published by GitHub. Refusing the file.'}
     $verified=$true
   }
   Move-Item -LiteralPath $part -Destination $dest -Force
   [pscustomobject]@{Path=$dest;Tag=$release.tag_name;Note=$note;SHA256=$hash;Verified=$verified}
 }finally{if(Test-Path -LiteralPath $part){Remove-Item -LiteralPath $part -Force}}
}
function Get-HelperGuidance {
 # No silent binary execution: locate an existing helper, else guide the user to a trusted source.
 $existing=Resolve-Helper
 if($existing){return [pscustomobject]@{Found=$true;Path=$existing;Repo=''}}
 $repo=if($script:HelperRepo -match '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'){$script:HelperRepo}else{''}
 return [pscustomobject]@{Found=$false;Path=$null;Repo=$repo}
}

# -------- Headless diagnostic mode (no GUI); used by CI and scripting --------
if($Scan){
 $s=Scan-AppleDevice; $script:LastScan=$s; $r=Get-Readiness $s
 Log ("USB connected: {0} (count {1}); driver issue: {2}; Apple service: {3}" -f $s.Connected,$s.UsbCount,$s.DriverIssue,$s.AppleService)
 Log ("iTunes: {0}; Sideloadly: {1}; helper: {2}; model: {3}; iOS: {4}" -f $s.ITunes,$s.Sideloadly,$s.Helper,$s.Model,$s.IOS)
 Log ("Readiness: {0}/{1}; ready to sideload: {2}" -f $r.Score,$r.Max,$r.Ready)
 if($r.Missing.Count){Log ('Missing: '+($r.Missing -join '; '))}
 $out=Join-Path $script:DownloadDir ('scan-{0:yyyyMMdd-HHmmss}.txt' -f (Get-Date))
 $lines=@('iPad Legacy Assistant - local metadata only, no personal data.',"USB connected: $($s.Connected)","USB count: $($s.UsbCount)","Driver issue: $($s.DriverIssue)","Apple service: $($s.AppleService)","iTunes: $($s.ITunes)","Sideloadly: $($s.Sideloadly)","Helper: $($s.Helper)","Model: $($s.Model)","iOS: $($s.IOS)","Readiness: $($r.Score)/$($r.Max)","Ready: $($r.Ready)")
 [System.IO.File]::WriteAllLines($out,[string[]]$lines,(New-Object System.Text.UTF8Encoding($false)))
 Log "Saved report: $out"
 return
}
# Skip the GUI when the script is dot-sourced (e.g. by tests) or -NoGui is given.
if($NoGui -or $MyInvocation.InvocationName -eq '.'){return}

# ---------------------------------- GUI ----------------------------------
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
function New-Button([string]$name,[int]$x,[int]$y,[int]$width){
 $b=New-Object System.Windows.Forms.Button
 $b.Text=$name;$b.Location=New-Object System.Drawing.Point($x,$y);$b.Size=New-Object System.Drawing.Size($width,49)
 $b.FlatStyle='Flat';$b.FlatAppearance.BorderSize=0;$b.AccessibleName=$name
 $b.BackColor=[System.Drawing.Color]::FromArgb(40,77,111);$b.ForeColor=[System.Drawing.Color]::White
 $b.Font=New-Object System.Drawing.Font('Segoe UI',9,[System.Drawing.FontStyle]::Bold)
 return $b
}
function New-Label([string]$text,[int]$x,[int]$y,[int]$w,[int]$h,[int]$fontSize){
 $l=New-Object System.Windows.Forms.Label;$l.Text=$text
 $l.Location=New-Object System.Drawing.Point($x,$y);$l.Size=New-Object System.Drawing.Size($w,$h)
 $l.Font=New-Object System.Drawing.Font('Segoe UI',$fontSize);$l.ForeColor=[System.Drawing.Color]::White;return $l
}
$script:form=New-Object System.Windows.Forms.Form
$script:form.Text='iPad Legacy Assistant (archived)';$script:form.StartPosition='CenterScreen'
$script:form.ClientSize=New-Object System.Drawing.Size(825,712);$script:form.MinimumSize=New-Object System.Drawing.Size(760,730)
$script:form.BackColor=[System.Drawing.Color]::FromArgb(20,29,45)
$script:form.Controls.Add((New-Label 'iPad Legacy Assistant' 27 18 780 40 23))
$script:form.Controls.Add((New-Label 'Archived experiment - old iPad diagnostics and guided install. No wipe, restore, or Activation Lock bypass.' 27 66 770 44 10))
$script:status=New-Label 'DEVICE NOT SCANNED' 27 120 780 30 12
$script:detail=New-Label 'Connect by USB, unlock iPad, tap Trust if prompted, then Scan.' 27 156 780 44 10
$script:ready=New-Label 'Readiness: not scanned' 27 204 780 24 10
$script:ready.ForeColor=[System.Drawing.Color]::FromArgb(183,229,218)
$script:form.Controls.AddRange(@($script:status,$script:detail,$script:ready))
$script:override=New-Object System.Windows.Forms.CheckBox
$script:override.Text='Advanced: allow prep actions without a verified iPad3 / 9.3.6 (I accept the risk)'
$script:override.Location=New-Object System.Drawing.Point(27,232);$script:override.Size=New-Object System.Drawing.Size(780,24)
$script:override.ForeColor=[System.Drawing.Color]::FromArgb(230,196,120);$script:override.Font=New-Object System.Drawing.Font('Segoe UI',9)
$script:form.Controls.Add($script:override)

$scanBtn=New-Button '1  Scan connected iPad' 27 266 242
$ipaBtn=New-Button '2  Download EverPwnage IPA' 289 266 242
$sideBtn=New-Button '3  Open Sideloadly' 551 266 242
$everGuideBtn=New-Button 'EverPwnage guide' 27 326 242
$phxGuideBtn=New-Button 'Phoenix guide (9.3.6)' 289 326 242
$phxSiteBtn=New-Button 'Phoenix download site' 551 326 242
$helperBtn=New-Button 'Get device-info helper' 27 386 242
$releaseBtn=New-Button 'Official EverPwnage releases' 289 386 242
$driversBtn=New-Button 'Driver requirements' 551 386 242
$folderBtn=New-Button 'Open IPA folder' 27 446 242
$reportBtn=New-Button 'Save local report' 289 446 242
$appleBtn=New-Button 'Activation Lock support' 551 446 242
$script:form.Controls.AddRange(@($scanBtn,$ipaBtn,$sideBtn,$everGuideBtn,$phxGuideBtn,$phxSiteBtn,$helperBtn,$releaseBtn,$driversBtn,$folderBtn,$reportBtn,$appleBtn))
# Prep actions start disabled until a supported device is verified (or the override is ticked).
$script:gated=@($ipaBtn,$sideBtn,$phxSiteBtn)
foreach($g in $script:gated){$g.Enabled=$false}
$script:log=New-Object System.Windows.Forms.TextBox
$script:log.Location=New-Object System.Drawing.Point(27,516);$script:log.Size=New-Object System.Drawing.Size(766,170)
$script:log.Multiline=$true;$script:log.ReadOnly=$true;$script:log.ScrollBars='Vertical';$script:log.Anchor='Top,Bottom,Left,Right'
$script:log.BackColor=[System.Drawing.Color]::FromArgb(11,19,31);$script:log.ForeColor=[System.Drawing.Color]::FromArgb(183,229,218)
$script:log.Font=New-Object System.Drawing.Font('Consolas',9);$script:log.AccessibleName='Activity log'
$script:form.Controls.Add($script:log)
function Fail([string]$name,[string]$message){Log "$name failed: $message";[System.Windows.Forms.MessageBox]::Show($message,$name,'OK','Warning')|Out-Null}
function Update-Gating {
 $allow=$false
 if($script:LastScan){$r=Get-Readiness $script:LastScan;$allow=($r.Supported -or $script:override.Checked)}
 else{$allow=$script:override.Checked}
 foreach($g in $script:gated){$g.Enabled=$allow}
}
$script:override.Add_CheckedChanged({Update-Gating})
$scanBtn.Add_Click({
 $scanBtn.Enabled=$false;$script:form.Cursor='WaitCursor'
 try{
   $script:LastScan=Scan-AppleDevice;$s=$script:LastScan;$r=Get-Readiness $s
   $script:status.Text=if($s.Connected){'APPLE USB DEVICE DETECTED'}else{'NO APPLE USB DEVICE DETECTED'}
   $script:detail.Text="USB devices: $($s.UsbCount); driver issue: $($s.DriverIssue); Apple service: $($s.AppleService)"+[Environment]::NewLine+
      "iTunes: $($s.ITunes); Sideloadly: $($s.Sideloadly); Model: $($s.Model); iOS: $($s.IOS)"
   $script:ready.Text="Readiness: $($r.Score)/$($r.Max)"+$(if($r.Missing.Count){' - missing: '+($r.Missing -join '; ')}else{' - ready to sideload'})
   Log "Scan: USB=$($s.Connected), iTunes=$($s.ITunes), Sideloadly=$($s.Sideloadly), readiness=$($r.Score)/$($r.Max)."
   if($s.Connected -and -not $s.Helper){Log 'Tip: use the Get device-info helper button so model/iOS can be read over USB.'}
   if($r.Supported){Log 'iPad 3 / iOS 9.3.6 confirmed; prep actions enabled.'}
   Update-Gating
 }catch{Fail 'Scan' $_.Exception.Message}
 finally{$scanBtn.Enabled=$true;$script:form.Cursor='Default'}
})
$ipaBtn.Add_Click({
 if([System.Windows.Forms.MessageBox]::Show('Download from the official EverPwnage GitHub release? This does not install or execute the IPA.','Official IPA','YesNo','Question') -ne [System.Windows.Forms.DialogResult]::Yes){return}
 $ipaBtn.Enabled=$false;$script:form.Cursor='WaitCursor'
 try{$info=Download-OfficialIpa;if($info.Note){Log $info.Note}
  Log "Downloaded $($info.Tag); SHA256 $($info.SHA256); publisher-verified: $($info.Verified)"
  $vmsg=if($info.Verified){'SHA-256 matched the hash published by GitHub.'}else{'GitHub published no hash for this asset; compare the SHA-256 against the releases page yourself.'}
  [System.Windows.Forms.MessageBox]::Show("File: $($info.Path)"+[Environment]::NewLine+"SHA-256: $($info.SHA256)"+[Environment]::NewLine+$vmsg,'Download complete','OK','Information')|Out-Null}
 catch{Fail 'IPA download' $_.Exception.Message}
 finally{$ipaBtn.Enabled=$true;$script:form.Cursor='Default'}
})
$sideBtn.Add_Click({
 try{$exe=if($script:LastScan){$script:LastScan.SideloadlyExe}else{(Scan-AppleDevice).SideloadlyExe}
  if($exe){Start-Process -FilePath $exe|Out-Null;Log 'Opened Sideloadly. Use only your own Apple Account there.'}
  else{Open-Official 'https://sideloadly.io/';Log 'Sideloadly not detected; opened official installation page.'}}
 catch{Fail 'Sideloadly' $_.Exception.Message}
})
$everGuideBtn.Add_Click({try{Open-Official 'https://ios.cfw.guide/installing-everpwnage/'}catch{Fail 'Guide' $_.Exception.Message}})
$phxGuideBtn.Add_Click({try{Open-Official 'https://ios.cfw.guide/installing-phoenix/';Log 'Phoenix is semi-untethered: re-run the Phoenix app after every reboot.'}catch{Fail 'Phoenix guide' $_.Exception.Message}})
$phxSiteBtn.Add_Click({try{Open-Official 'https://phoenixpwn.com/';Log 'Opened the official Phoenix site. Sideload its IPA the same way, signing with your own Apple Account.'}catch{Fail 'Phoenix site' $_.Exception.Message}})
$releaseBtn.Add_Click({try{Open-Official 'https://github.com/LukeZGD/EverPwnage/releases'}catch{Fail 'Releases' $_.Exception.Message}})
$driversBtn.Add_Click({try{Open-Official 'https://sideloadly.io/'}catch{Fail 'Drivers' $_.Exception.Message}})
$folderBtn.Add_Click({try{Start-Process explorer.exe -ArgumentList ('"'+$script:DownloadDir+'"')}catch{Fail 'Folder' $_.Exception.Message}})
$appleBtn.Add_Click({try{Open-Official 'https://support.apple.com/en-au/108934'}catch{Fail 'Apple support' $_.Exception.Message}})
$helperBtn.Add_Click({
 try{$h=Get-HelperGuidance
  if($h.Found){Log "Device-info helper found: $($h.Path)";[System.Windows.Forms.MessageBox]::Show("A helper is already available:"+[Environment]::NewLine+$h.Path+[Environment]::NewLine+'Scan again to read model and iOS.','Helper ready','OK','Information')|Out-Null;return}
  $msg='No ideviceinfo helper was found. It reads the exact model and iOS over USB (read-only).'+[Environment]::NewLine+[Environment]::NewLine+
       'Safe ways to get one you can trust:'+[Environment]::NewLine+
       ' - Install 3uTools or iMazing (they bundle it), or the MSYS2 libimobiledevice package.'+[Environment]::NewLine+
       ' - Advanced: set env var IPADLEGACY_HELPER_REPO to a GitHub repo you trust, download ideviceinfo.exe into the tools folder, then Scan again.'+[Environment]::NewLine+[Environment]::NewLine+
       'Tools folder: '+$script:ToolsDir+[Environment]::NewLine+[Environment]::NewLine+'Open the libimobiledevice project page now?'
  if($h.Repo){$msg='Trusted repo set: '+$h.Repo+[Environment]::NewLine+$msg}
  if([System.Windows.Forms.MessageBox]::Show($msg,'Get device-info helper','YesNo','Information') -eq [System.Windows.Forms.DialogResult]::Yes){Open-Official 'https://libimobiledevice.org/'}
  Log ('Helper guidance shown; tools folder: '+$script:ToolsDir)}
 catch{Fail 'Helper' $_.Exception.Message}
})
$reportBtn.Add_Click({
 try{$dlg=New-Object System.Windows.Forms.SaveFileDialog;$dlg.Filter='Text file (*.txt)|*.txt';$dlg.FileName='ipad-legacy-report.txt'
  if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){return}
  $lines=@('iPad Legacy Assistant - local metadata only','No personal information, account credentials, serial or media copied.')
  if($script:LastScan){$s=$script:LastScan;$r=Get-Readiness $s;$lines+=@("USB connected: $($s.Connected)","USB count: $($s.UsbCount)","Driver issue: $($s.DriverIssue)","Apple service: $($s.AppleService)","iTunes: $($s.ITunes)","Sideloadly: $($s.Sideloadly)","Helper: $($s.Helper)","Model: $($s.Model)","iOS: $($s.IOS)","Readiness: $($r.Score)/$($r.Max)","Ready: $($r.Ready)")}
  $lines+='No jailbreak or Activation Lock change has been performed or verified.'
  [System.IO.File]::WriteAllLines($dlg.FileName,[string[]]$lines,(New-Object System.Text.UTF8Encoding($false)));Log 'Saved metadata-only report.'
 }catch{Fail 'Save report' $_.Exception.Message}
})
Log 'Ready. iPad 3 / iOS 9.3.6 is supported by EverPwnage and Phoenix (verify the actual device before continuing).'
Log 'Find My iPad is ON. Do not restore or erase. Do not access content belonging to the unknown owner.'
Log ('Session log: '+$script:LogFile)
[void]$script:form.ShowDialog()
