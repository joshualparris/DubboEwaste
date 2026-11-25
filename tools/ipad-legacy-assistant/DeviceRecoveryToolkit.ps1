#Requires -Version 5.1
# Universal Device Recovery Toolkit - portable Windows desktop app.
# All scans are read-only. No restore, erase, flashing, bypass or account access.
Set-StrictMode -Version 2.0
$ErrorActionPreference='Stop'
Import-Module (Join-Path $PSScriptRoot 'DeviceRecovery.Core.psm1') -Force
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
$script:Snapshot=$null
$script:Font='Segoe UI'
function New-Label {
 param([string]$Text,[int]$X,[int]$Y,[int]$W,[int]$H,[int]$Size=10)
 $l=New-Object System.Windows.Forms.Label
 $l.Text=$Text;$l.Location=New-Object System.Drawing.Point($X,$Y)
 $l.Size=New-Object System.Drawing.Size($W,$H)
 $l.Font=New-Object System.Drawing.Font($script:Font,$Size)
 return $l
}
function New-Button {
 param([string]$Text,[int]$X,[int]$Y,[int]$W=215)
 $b=New-Object System.Windows.Forms.Button
 $b.Text=$Text;$b.Location=New-Object System.Drawing.Point($X,$Y)
 $b.Size=New-Object System.Drawing.Size($W,43)
 $b.FlatStyle='Flat';$b.FlatAppearance.BorderSize=0
 $b.BackColor=[System.Drawing.Color]::FromArgb(44,91,130)
 $b.ForeColor=[System.Drawing.Color]::White
 $b.Font=New-Object System.Drawing.Font($script:Font,10,[System.Drawing.FontStyle]::Bold)
 return $b
}
function New-Readout {
 param([int]$X,[int]$Y,[int]$W,[int]$H)
 $t=New-Object System.Windows.Forms.TextBox
 $t.Multiline=$true;$t.ReadOnly=$true;$t.ScrollBars='Vertical'
 $t.Location=New-Object System.Drawing.Point($X,$Y)
 $t.Size=New-Object System.Drawing.Size($W,$H)
 $t.Font=New-Object System.Drawing.Font('Consolas',10)
 $t.BackColor=[System.Drawing.Color]::FromArgb(244,248,252)
 $t.Anchor='Top,Bottom,Left,Right'
 return $t
}
function New-Tab([string]$Title) {
 $tab=New-Object System.Windows.Forms.TabPage;$tab.Text=$Title
 $tab.BackColor=[System.Drawing.Color]::White;return $tab
}
function Open-Trusted([string]$Link){
 $u=[uri]$Link
 if($u.Scheme -ne 'https' -or $u.Host -notin @('support.apple.com','developer.android.com','learn.microsoft.com','sideloadly.io','ios.cfw.guide','github.com')){throw 'Link is not on the approved list.'}
 Start-Process $u.AbsoluteUri | Out-Null
}
function Show-Failure([string]$Title,[string]$Detail){
 [System.Windows.Forms.MessageBox]::Show($Detail,$Title,'OK','Warning') | Out-Null
 $script:notice.Text="$Title - $Detail"
}
function Join-RecoveryLines([object[]]$Items){return ($Items -join [Environment]::NewLine)}
$script:form=New-Object System.Windows.Forms.Form
$script:form.Text='Universal Device Recovery Toolkit 2.0'
$script:form.StartPosition='CenterScreen'
$script:form.ClientSize=New-Object System.Drawing.Size(1030,735)
$script:form.MinimumSize=New-Object System.Drawing.Size(930,685)
$script:form.BackColor=[System.Drawing.Color]::FromArgb(234,241,247)
$script:form.Controls.Add((New-Label 'UNIVERSAL DEVICE RECOVERY TOOLKIT' 22 15 830 42 21))
$script:form.Controls.Add((New-Label 'Apple / Android / Windows / Mac | privacy-safe diagnostics and reuse guidance' 22 59 945 25 10))
$script:form.Controls.Add((New-Label 'Device authorisation:' 22 100 155 28 10))
$script:owner=New-Object System.Windows.Forms.ComboBox
$script:owner.DropDownStyle='DropDownList'
$script:owner.Location=New-Object System.Drawing.Point(185,96)
$script:owner.Size=New-Object System.Drawing.Size(265,30)
[void]$script:owner.Items.AddRange([object[]]@('Unknown / unverified','Owned and authorised','Organisation-managed'))
$script:owner.SelectedIndex=0
$script:form.Controls.Add($script:owner)
$scan=New-Button 'Scan connected hardware' 475 91 250
$exportTop=New-Button 'Export report' 744 91 250
$script:form.Controls.AddRange(@($scan,$exportTop))
$tabs=New-Object System.Windows.Forms.TabControl
$tabs.Location=New-Object System.Drawing.Point(22,155)
$tabs.Size=New-Object System.Drawing.Size(972,515)
$tabs.Anchor='Top,Bottom,Left,Right'
$script:form.Controls.Add($tabs)

$overview=New-Tab 'Devices'
$health=New-Tab 'Battery & health'
$recovery=New-Tab 'Recovery & apps'
$reuse=New-Tab 'Repurpose'
$report=New-Tab 'Reports & limitations'
$tabs.TabPages.AddRange([System.Windows.Forms.TabPage[]]@($overview,$health,$recovery,$reuse,$report))
$overview.Controls.Add((New-Label 'Detected USB interfaces and optional tools' 17 13 890 30 13))
$script:deviceOut=New-Readout 17 53 925 390
$overview.Controls.Add($script:deviceOut)
$script:deviceOut.Text='No scan yet. Click Scan connected hardware. This reads Windows device metadata, not device files.'
$health.Controls.Add((New-Label 'Battery details are estimates; charge percentage is not battery condition.' 17 13 910 35 11))
$script:healthOut=New-Readout 17 57 925 386
$health.Controls.Add($script:healthOut)
$script:healthOut.Text='No scan yet. Apple battery health may not be available. Android requires authorised USB debugging.'
$recovery.Controls.Add((New-Label 'Recovery and app installation (manual; owner-authorised devices only)' 17 12 900 31 12))
$recovery.Controls.Add((New-Label 'An unknown Apple Account or Find My lock cannot be removed by this tool.' 17 45 900 28 10))
$script:legacy=New-Button 'Open legacy Apple assistant' 17 89 281
$script:side=New-Button 'Open Sideloadly site' 315 89 281
$script:mac=New-Button 'Mac inspection helper' 613 89 305
$script:appleLink=New-Button 'Apple Activation Lock help' 17 145 281
$script:androidLink=New-Button 'Android USB / ADB guide' 315 145 281
$script:firmware=New-Button 'Firmware safety guidance' 613 145 305
$recovery.Controls.AddRange(@($script:legacy,$script:side,$script:mac,$script:appleLink,$script:androidLink,$script:firmware))
$script:recoverOut=New-Readout 17 213 925 230
$recovery.Controls.Add($script:recoverOut)
$script:recoverOut.Text=Join-RecoveryLines @(
 'READ-ONLY BY DEFAULT.',
 'This app does not unlock Apple accounts or bypass Activation Lock.',
 'Firmware signing status has NOT been checked. Never assume an old IPSW is installable.',
 'Sideloading, jailbreaks and legacy app installation require confirmed authorisation.',
 'Android ADB must be explicitly approved on the device. No automatic flashing.',
 'On a Mac, run the included local helper on that Mac and inspect its report.'
)
$reuse.Controls.Add((New-Label 'Device category:' 17 22 133 24 10))
$script:family=New-Object System.Windows.Forms.ComboBox
$script:family.DropDownStyle='DropDownList'
$script:family.Location=New-Object System.Drawing.Point(153,18)
$script:family.Size=New-Object System.Drawing.Size(185,30)
[void]$script:family.Items.AddRange([object[]]@('Apple','Android','Windows','Mac'))
$script:family.SelectedIndex=0
$reuse.Controls.Add($script:family)
$reuse.Controls.Add((New-Label 'OS version:' 370 22 92 24 10))
$script:version=New-Object System.Windows.Forms.TextBox
$script:version.Location=New-Object System.Drawing.Point(468,18)
$script:version.Size=New-Object System.Drawing.Size(130,28)
$script:version.Text='9.3.6'
$reuse.Controls.Add($script:version)
$script:suggest=New-Button 'Generate reuse ideas' 633 12 275
$reuse.Controls.Add($script:suggest)
$script:reuseOut=New-Readout 17 67 925 376
$reuse.Controls.Add($script:reuseOut)
$reuse.Controls.Add((New-Label 'Offline use does not override someone else''s ownership or privacy rights.' 17 454 910 24 9))
$report.Controls.Add((New-Label 'Privacy-safe exports: no USB serial numbers, device IDs, IMEIs, photos or accounts.' 17 15 910 32 11))
$script:reportOut=New-Readout 17 58 925 386
$report.Controls.Add($script:reportOut)
$script:reportOut.Text=Join-RecoveryLines @(
 'Reports include device-interface counts, read-only diagnostic summaries, optional-tool availability and battery percentages if available.',
 'They do not include personal content or hardware unique identifiers.',
 'Apple Activation Lock, exact battery health and firmware signing cannot be proven by a basic USB scan.',
 'USB interfaces may outnumber physical devices.',
 'This Windows application cannot inspect a Mac over USB. Use the provided macOS helper on the Mac itself.',
 'No restore, erase, unlock, APK installation, firmware flash or jailbreak action is executed automatically.'
)
$script:notice=New-Label 'Ready. Scanning is read-only. No connected device has been changed.' 22 680 973 34 9
$script:notice.Anchor='Bottom,Left,Right'
$script:form.Controls.Add($script:notice)

function Update-RecoveryPermission {
 $allowed=Test-RecoveryModificationPermission ([string]$script:owner.SelectedItem)
 $script:legacy.Enabled=$allowed
 $script:side.Enabled=$allowed
 $script:legacy.BackColor=if($allowed){[System.Drawing.Color]::FromArgb(44,91,130)}else{[System.Drawing.Color]::Gray}
 $script:side.BackColor=if($allowed){[System.Drawing.Color]::FromArgb(44,91,130)}else{[System.Drawing.Color]::Gray}
}
function Refresh-Reuse {
 try {
  # Use the codename of the first authorised Android device from the last scan, if any.
  $codename=if($script:Snapshot){@($script:Snapshot.Android | Where-Object {$_.Codename -and $_.Codename -ne 'Unavailable'})[0].Codename}else{$null}
  $ideas=@(Get-RecoveryRecommendations -Family ([string]$script:family.SelectedItem) -Version $script:version.Text -Ownership ([string]$script:owner.SelectedItem) -Codename $codename)
  $script:reuseOut.Text=Join-RecoveryLines ($ideas | ForEach-Object { '- '+$_ })
 }catch{Show-Failure 'Reuse' $_.Exception.Message}
}
function Save-Report {
 if(!$script:Snapshot){Show-Failure 'Report' 'Run a scan before exporting.';return}
 $dlg=New-Object System.Windows.Forms.SaveFileDialog
 $dlg.Filter='JSON report (*.json)|*.json|Text report (*.txt)|*.txt'
 $dlg.FileName='device-recovery-report.json'
 if($dlg.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK){return}
 try{
  [void](Export-RecoverySnapshot -Snapshot $script:Snapshot -Path $dlg.FileName)
  $script:notice.Text="Saved privacy-safe report: $($dlg.FileName)"
 }catch{Show-Failure 'Report export' $_.Exception.Message}
}
$script:owner.Add_SelectedIndexChanged({Update-RecoveryPermission;Refresh-Reuse})
$script:family.Add_SelectedIndexChanged({Refresh-Reuse})
$script:version.Add_TextChanged({Refresh-Reuse})
$script:suggest.Add_Click({Refresh-Reuse})
$scan.Add_Click({
 $scan.Enabled=$false;$script:form.Cursor='WaitCursor'
 try {
  $script:Snapshot=Get-RecoverySnapshot;$s=$script:Snapshot
  $lines=@("Scan: $($s.Captured)","Apple / Android USB interfaces: $(@($s.DeviceInterfaces).Count)")
  foreach($d in @($s.DeviceInterfaces)){$lines+=" - $($d.Description): $($d.DriverStatus) (interface only)"}
  if(@($s.DeviceInterfaces).Count -eq 0){$lines+=' - None identified. Check USB cable and drivers.'}
  $t=$s.ToolAvailability
  $lines+=@('','OPTIONAL TOOLS',"ADB: $($t.ADBInstalled)","ideviceinfo: $($t.IdeviceInfoInstalled)","Apple Devices: $($t.AppleDevicesInstalled)","iTunes: $($t.ITunesInstalled)","Sideloadly: $($t.SideloadlyInstalled)","Apple Mobile Device Service: $($t.AppleService)")
  $lines+=@('','APPLE (only if ideviceinfo and device trust are available)',"Model: $($s.Apple.Model); iOS: $($s.Apple.IOS)",'Activation Lock cannot be verified from USB.')
  foreach($a in @($s.Android)){$lines+="Android authorised connection: $($a.Connection); model: $($a.Model); version: $($a.Android)"}
  $script:deviceOut.Text=Join-RecoveryLines $lines
  $w=$s.WindowsHost
  $battery=@("WINDOWS HOST","OS: $($w.OperatingSystem) ($($w.Architecture))","Battery percent: $($w.BatteryPercent)","Status: $($w.BatteryStatus)","Health: $($w.BatteryHealth)","Disk drives detected: $($w.DiskCount)",'','APPLE','Battery health: not available from this basic scan.','Battery cycles/capacity are not inferred.','')
  if(@($s.Android).Count -eq 0){$battery+='ANDROID: no ADB-authorised devices reported.'}
  foreach($a in @($s.Android)){$battery+=@("ANDROID $($a.Model) ($($a.Connection))","Battery percent: $($a.BatteryPercent)","Health: $($a.BatteryHealth)",'')}
  $script:healthOut.Text=Join-RecoveryLines $battery
  if($s.Apple.IOS -ne 'Unknown'){$script:family.SelectedItem='Apple';$script:version.Text=$s.Apple.IOS}
  $script:notice.Text='Scan completed. No erase, reset, flash or user-data extraction.'
  $tabs.SelectedTab=$overview
 }catch{Show-Failure 'Scan' $_.Exception.Message}
 finally{$scan.Enabled=$true;$script:form.Cursor='Default'}
})
$exportTop.Add_Click({Save-Report})
$script:legacy.Add_Click({
 if(!(Test-RecoveryModificationPermission ([string]$script:owner.SelectedItem))){return}
 $old=Join-Path $PSScriptRoot 'iPadLegacyAssistant.ps1'
 if(!(Test-Path -LiteralPath $old)){Show-Failure 'Legacy assistant' 'The legacy file is not in the application folder.';return}
 try{Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-STA','-ExecutionPolicy','Bypass','-File',('"'+$old+'"')) | Out-Null
  $script:notice.Text='Legacy assistant launched. No device change has been verified.'
 }catch{Show-Failure 'Legacy assistant' $_.Exception.Message}
})
$script:side.Add_Click({try{if(Test-RecoveryModificationPermission ([string]$script:owner.SelectedItem)){Open-Trusted 'https://sideloadly.io/'}}catch{Show-Failure 'Sideloadly' $_.Exception.Message}})
$script:mac.Add_Click({
 $path=Join-Path $PSScriptRoot 'DeviceRecovery-Mac.sh'
 if(Test-Path $path){Start-Process -FilePath 'notepad.exe' -ArgumentList ('"'+$path+'"') | Out-Null
  $script:notice.Text='Mac helper opened. Copy to and run on your own Mac; it does not run on Windows.'
 }else{Show-Failure 'Mac helper' 'DeviceRecovery-Mac.sh was not found.'}
})
$script:appleLink.Add_Click({try{Open-Trusted 'https://support.apple.com/en-au/108934'}catch{Show-Failure 'Apple help' $_.Exception.Message}})
$script:androidLink.Add_Click({try{Open-Trusted 'https://developer.android.com/tools/adb'}catch{Show-Failure 'Android help' $_.Exception.Message}})
$script:firmware.Add_Click({
 [System.Windows.Forms.MessageBox]::Show('This tool does not verify which firmware versions are currently signed. Only restore an owned and fully backed-up device using the manufacturer-approved method. Never erase an Activation-Locked device hoping a restore removes the lock.','Firmware safety','OK','Information') | Out-Null
})
Update-RecoveryPermission
Refresh-Reuse
[void]$script:form.ShowDialog()
