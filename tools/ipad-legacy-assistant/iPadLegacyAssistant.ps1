#Requires -Version 5.1
# iPad Legacy Assistant: local USB diagnostics and safe jailbreak preparation.
Set-StrictMode -Version 2.0
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Net.ServicePointManager]::SecurityProtocol=[System.Net.SecurityProtocolType]::Tls12
$script:DownloadDir=Join-Path $env:LOCALAPPDATA 'iPadLegacyAssistant\Downloads'
[void][System.IO.Directory]::CreateDirectory($script:DownloadDir)
$script:LastScan=$null
function Open-Official([string]$url) {
 if($url -notmatch '^https://(sideloadly\.io|ios\.cfw\.guide|github\.com|support\.apple\.com)/'){throw 'Untrusted destination.'}
 Start-Process $url | Out-Null
}
function Find-Exe([string]$cmd,[string[]]$paths){
 foreach($p in $paths){ if($p -and (Test-Path -LiteralPath $p -PathType Leaf)){return $p} }
 $c=Get-Command $cmd -ErrorAction SilentlyContinue
 if($c){return [string]$c.Source}
 return $null
}
function Scan-AppleDevice {
 # Read Windows device metadata only. No user files, identifiers, or account data.
 $dev=@(Get-CimInstance Win32_PnPEntity | Where-Object { $_.PNPDeviceID -match '(?i)VID_05AC' })
 $bad=@($dev | Where-Object {$_.Status -ne 'OK'}).Count
 $svc=Get-Service -Name 'Apple Mobile Device Service' -ErrorAction SilentlyContinue
 $pf=[Environment]::GetFolderPath('ProgramFiles')
 $pfx=[Environment]::GetFolderPath('ProgramFilesX86')
 $itunes=Find-Exe 'iTunes.exe' @((Join-Path $pf 'iTunes\iTunes.exe'),(Join-Path $pfx 'iTunes\iTunes.exe'))
 $side=Find-Exe 'Sideloadly.exe' @((Join-Path $pf 'Sideloadly\Sideloadly.exe'),(Join-Path $pfx 'Sideloadly\Sideloadly.exe'),(Join-Path $env:LOCALAPPDATA 'Programs\Sideloadly\Sideloadly.exe'))
 $idevice=Find-Exe 'ideviceinfo.exe' @()
 $model='Unknown';$ios='Unknown'
 if($dev.Count -gt 0 -and $idevice){
   try{$model=[string](& $idevice -k ProductType 2>$null | Select-Object -First 1)}catch{}
   try{$ios=[string](& $idevice -k ProductVersion 2>$null | Select-Object -First 1)}catch{}
 }
 [pscustomobject]@{Connected=$dev.Count -gt 0;UsbCount=$dev.Count;DriverIssue=$bad -gt 0;
  AppleService=if($svc){[string]$svc.Status}else{'Missing'};ITunes=[bool]$itunes;
  Sideloadly=[bool]$side;SideloadlyExe=$side;Model=$model;IOS=$ios}
}
function Download-OfficialIpa {
 $api='https://api.github.com/repos/LukeZGD/EverPwnage/releases/latest'
 $release=Invoke-RestMethod -Uri $api -Headers @{'User-Agent'='iPadLegacyAssistant/1.0'} -TimeoutSec 30
 if(!$release -or !$release.tag_name){throw 'Incomplete official GitHub release data.'}
 $assets=@($release.assets | Where-Object {$_.name -match '(?i)\.ipa$'})
 if($assets.Count -ne 1){throw "Unexpected IPA asset count: $($assets.Count). Check official releases manually."}
 $asset=$assets[0]; $url=[uri]$asset.browser_download_url
 if($url.Scheme -ne 'https' -or $url.Host -ne 'github.com' -or
   !$url.AbsolutePath.StartsWith('/LukeZGD/EverPwnage/releases/download/',[System.StringComparison]::OrdinalIgnoreCase)){
   throw 'Refusing unexpected download URL.'
 }
 $name=([string]$release.tag_name+'-'+[string]$asset.name) -replace '[^a-zA-Z0-9_.-]','_'
 $dest=Join-Path $script:DownloadDir $name; $part="$dest.partial"
 try{
   Invoke-WebRequest -Uri $url.AbsoluteUri -OutFile $part -UseBasicParsing -TimeoutSec 120 -Headers @{'User-Agent'='iPadLegacyAssistant/1.0'}
   $file=Get-Item -LiteralPath $part
   if($file.Length -lt 1024 -or ($asset.size -gt 0 -and $file.Length -ne [long]$asset.size)){throw 'Download size mismatch.'}
   $stream=[System.IO.File]::OpenRead($part)
   try{if($stream.ReadByte() -ne 80 -or $stream.ReadByte() -ne 75){throw 'Downloaded file is not a ZIP-based IPA.'}}
   finally{$stream.Dispose()}
   Move-Item -LiteralPath $part -Destination $dest -Force
   [pscustomobject]@{Path=$dest;Tag=$release.tag_name;SHA256=(Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash}
 }finally{if(Test-Path -LiteralPath $part){Remove-Item -LiteralPath $part -Force}}
}
function New-Button([string]$name,[int]$x,[int]$y,[int]$width){
 $b=New-Object System.Windows.Forms.Button
 $b.Text=$name;$b.Location=New-Object System.Drawing.Point($x,$y);$b.Size=New-Object System.Drawing.Size($width,49)
 $b.FlatStyle='Flat';$b.FlatAppearance.BorderSize=0
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
$script:form.Text='iPad Legacy Assistant';$script:form.StartPosition='CenterScreen'
$script:form.ClientSize=New-Object System.Drawing.Size(825,640);$script:form.MinimumSize=New-Object System.Drawing.Size(760,650)
$script:form.BackColor=[System.Drawing.Color]::FromArgb(20,29,45)
$script:form.Controls.Add((New-Label 'iPad Legacy Assistant' 27 20 780 45 23))
$script:form.Controls.Add((New-Label 'Old iPad diagnostics and guided installation - no wipe, restore, or Activation Lock bypass' 27 72 770 60 10))
$script:status=New-Label 'DEVICE NOT SCANNED' 27 149 780 35 12
$script:detail=New-Label 'Connect by USB, unlock iPad, tap Trust if prompted, then Scan.' 27 190 780 70 10
$script:form.Controls.AddRange(@($script:status,$script:detail))
$scanBtn=New-Button '1  Scan connected iPad' 27 285 242
$ipaBtn=New-Button '2  Download official IPA' 289 285 242
$sideBtn=New-Button '3  Open Sideloadly' 551 285 242
$guideBtn=New-Button 'Installation guide' 27 345 242
$releaseBtn=New-Button 'Official EverPwnage releases' 289 345 242
$driversBtn=New-Button 'Driver requirements' 551 345 242
$folderBtn=New-Button 'Open IPA folder' 27 405 242
$reportBtn=New-Button 'Save local report' 289 405 242
$appleBtn=New-Button 'Activation Lock support' 551 405 242
$script:form.Controls.AddRange(@($scanBtn,$ipaBtn,$sideBtn,$guideBtn,$releaseBtn,$driversBtn,$folderBtn,$reportBtn,$appleBtn))
$script:log=New-Object System.Windows.Forms.TextBox
$script:log.Location=New-Object System.Drawing.Point(27,475);$script:log.Size=New-Object System.Drawing.Size(766,132)
$script:log.Multiline=$true;$script:log.ReadOnly=$true;$script:log.ScrollBars='Vertical'
$script:log.Anchor='Top,Bottom,Left,Right'
$script:log.BackColor=[System.Drawing.Color]::FromArgb(11,19,31);$script:log.ForeColor=[System.Drawing.Color]::FromArgb(183,229,218)
$script:log.Font=New-Object System.Drawing.Font('Consolas',9);$script:form.Controls.Add($script:log)
function Log([string]$text){$script:log.AppendText(('{0:HH:mm:ss}  {1}' -f (Get-Date),$text)+[Environment]::NewLine)}
function Fail([string]$name,[string]$message){Log "$name failed: $message";[System.Windows.Forms.MessageBox]::Show($message,$name,'OK','Warning')|Out-Null}
$scanBtn.Add_Click({
 $scanBtn.Enabled=$false;$script:form.Cursor='WaitCursor'
 try{
   $script:LastScan=Scan-AppleDevice;$s=$script:LastScan
   $script:status.Text=if($s.Connected){'APPLE USB DEVICE DETECTED'}else{'NO APPLE USB DEVICE DETECTED'}
   $script:detail.Text="USB devices: $($s.UsbCount); driver issue: $($s.DriverIssue); Apple service: $($s.AppleService)"+[Environment]::NewLine+
      "iTunes: $($s.ITunes); Sideloadly: $($s.Sideloadly); Model: $($s.Model); iOS: $($s.IOS)"
   Log "Scan: USB=$($s.Connected), iTunes=$($s.ITunes), Sideloadly=$($s.Sideloadly)."
   if($s.Model -match '^iPad3,' -and $s.IOS -eq '9.3.6'){Log 'iPad 3 / iOS 9.3.6 match supported versions.'}
 }catch{Fail 'Scan' $_.Exception.Message}
 finally{$scanBtn.Enabled=$true;$script:form.Cursor='Default'}
})
$ipaBtn.Add_Click({
 if([System.Windows.Forms.MessageBox]::Show('Download from the official EverPwnage GitHub release? This does not install or execute the IPA.','Official IPA','YesNo','Question') -ne [System.Windows.Forms.DialogResult]::Yes){return}
 $ipaBtn.Enabled=$false;$script:form.Cursor='WaitCursor'
 try{$info=Download-OfficialIpa;Log "Downloaded $($info.Tag); SHA256 $($info.SHA256)"
 [System.Windows.Forms.MessageBox]::Show("File: $($info.Path)"+[Environment]::NewLine+"SHA-256: $($info.SHA256)",'Download complete','OK','Information')|Out-Null}
 catch{Fail 'IPA download' $_.Exception.Message}
 finally{$ipaBtn.Enabled=$true;$script:form.Cursor='Default'}
})
$sideBtn.Add_Click({
 try{$exe=if($script:LastScan){$script:LastScan.SideloadlyExe}else{(Scan-AppleDevice).SideloadlyExe}
  if($exe){Start-Process -FilePath $exe|Out-Null;Log 'Opened Sideloadly. Use only your own Apple Account there.'}
  else{Open-Official 'https://sideloadly.io/';Log 'Sideloadly not detected; opened official installation page.'}}
 catch{Fail 'Sideloadly' $_.Exception.Message}
})
$guideBtn.Add_Click({try{Open-Official 'https://ios.cfw.guide/installing-everpwnage/'}catch{Fail 'Guide' $_.Exception.Message}})
$releaseBtn.Add_Click({try{Open-Official 'https://github.com/LukeZGD/EverPwnage/releases'}catch{Fail 'Releases' $_.Exception.Message}})
$driversBtn.Add_Click({try{Open-Official 'https://sideloadly.io/'}catch{Fail 'Drivers' $_.Exception.Message}})
$folderBtn.Add_Click({try{Start-Process explorer.exe -ArgumentList ('"'+$script:DownloadDir+'"')}catch{Fail 'Folder' $_.Exception.Message}})
$appleBtn.Add_Click({try{Open-Official 'https://support.apple.com/en-au/108934'}catch{Fail 'Apple support' $_.Exception.Message}})
$reportBtn.Add_Click({
 try{$dlg=New-Object System.Windows.Forms.SaveFileDialog;$dlg.Filter='Text file (*.txt)|*.txt';$dlg.FileName='ipad-legacy-report.txt'
  if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){return}
  $lines=@('iPad Legacy Assistant - local metadata only','No personal information, account credentials, serial or media copied.')
  if($script:LastScan){$s=$script:LastScan;$lines+=@("USB connected: $($s.Connected)","USB count: $($s.UsbCount)","Driver issue: $($s.DriverIssue)","Apple service: $($s.AppleService)","iTunes: $($s.ITunes)","Sideloadly: $($s.Sideloadly)","Model: $($s.Model)","iOS: $($s.IOS)")}
  $lines+='No jailbreak or Activation Lock change has been performed or verified.'
  [System.IO.File]::WriteAllLines($dlg.FileName,[string[]]$lines,(New-Object System.Text.UTF8Encoding($false)));Log 'Saved metadata-only report.'
 }catch{Fail 'Save report' $_.Exception.Message}
})
Log 'Ready. iPad 3 / iOS 9.3.6 is supported by EverPwnage (check actual device before continuing).'
Log 'Find My iPad is ON. Do not restore or erase. Do not access the unknown owner’s content.'
[void]$script:form.ShowDialog()
