# Pester v5 tests for iPad Legacy Assistant.
# Dot-sources the app with -NoGui so only its functions load (no window, no network).
BeforeAll {
  $script:App = Join-Path (Split-Path -Parent $PSScriptRoot) 'iPadLegacyAssistant.ps1'
  . $script:App -NoGui
}

Describe 'Core functions are defined' {
  It 'exposes the documented functions' {
    foreach ($fn in 'Scan-AppleDevice','Download-OfficialIpa','Get-Readiness','Open-Official','Resolve-Helper','Get-HelperGuidance') {
      (Get-Command $fn -ErrorAction SilentlyContinue) | Should -Not -BeNullOrEmpty
    }
  }
}

Describe 'Get-Readiness' {
  It 'treats a null scan as not ready' {
    $r = Get-Readiness $null
    $r.Ready  | Should -BeFalse
    $r.Score  | Should -Be 0
  }
  It 'marks an iPad3 on 9.3.6 with all prerequisites as ready' {
    $s = [pscustomobject]@{Connected=$true;DriverIssue=$false;AppleService='Running';Model='iPad 3 (Cellular, GSM) [iPad3,3]';IOS='9.3.6';ITunes=$true;Sideloadly=$true}
    $r = Get-Readiness $s
    $r.Supported | Should -BeTrue
    $r.Ready     | Should -BeTrue
    $r.Score     | Should -Be 5
  }
  It 'does not treat a wrong iOS as supported' {
    $s = [pscustomobject]@{Connected=$true;DriverIssue=$false;AppleService='Running';Model='iPad3,3';IOS='9.3.5';ITunes=$true;Sideloadly=$true}
    (Get-Readiness $s).Supported | Should -BeFalse
  }
  It 'lists each missing prerequisite' {
    $s = [pscustomobject]@{Connected=$false;DriverIssue=$true;AppleService='Missing';Model='Unknown';IOS='Unknown';ITunes=$false;Sideloadly=$false}
    (Get-Readiness $s).Missing.Count | Should -BeGreaterThan 0
  }
}

Describe 'Open-Official guard' {
  It 'rejects non-whitelisted destinations' {
    { Open-Official 'http://evil.example/x' } | Should -Throw
  }
  It 'rejects a look-alike host' {
    { Open-Official 'https://github.com.evil.example/x' } | Should -Throw
  }
}

Describe 'Scan-AppleDevice shape' {
  It 'returns the expected properties' {
    $s = Scan-AppleDevice
    foreach ($p in 'Connected','UsbCount','Helper','Model','IOS','Sideloadly','ITunes') {
      $s.PSObject.Properties.Name | Should -Contain $p
    }
  }
}
