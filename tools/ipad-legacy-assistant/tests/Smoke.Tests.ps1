$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
$app=Join-Path $root 'iPadLegacyAssistant.ps1'
$cmd=Join-Path $root 'Launch-iPad-Legacy-Assistant.cmd'
if(!(Test-Path $app) -or !(Test-Path $cmd)){throw 'Missing application or launcher'}
$tokens=$null;$errors=$null
[System.Management.Automation.Language.Parser]::ParseFile($app,[ref]$tokens,[ref]$errors)|Out-Null
if($errors.Count -gt 0){throw ('PowerShell parsing failed: '+(($errors|ForEach-Object{$_.Message}) -join '; '))}
$text=[System.IO.File]::ReadAllText($app)
foreach($required in @('Scan-AppleDevice','Download-OfficialIpa','Get-CimInstance','Get-FileHash','LukeZGD/EverPwnage/releases/latest','support.apple.com/en-au/108934','ShowDialog')){
 if(!$text.Contains($required)){throw "Missing required code: $required"}
}
foreach($forbidden in @('idevicerestore','idevicebackup2','ActivationLockBypass','EraseDevice','FindMyOff')){
 if($text.Contains($forbidden)){throw "Unsafe primitive present: $forbidden"}
}
$launch=[System.IO.File]::ReadAllText($cmd)
if($launch -notmatch 'powershell\.exe.*-STA.*-File'){throw 'Launcher does not use STA PowerShell'}
Write-Host 'PASS: source syntax, app functions, guardrails and Windows launcher.'
