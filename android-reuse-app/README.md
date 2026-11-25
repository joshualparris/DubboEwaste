# Dubbo Reuse — universal legacy Android reuse app

A single APK that turns an **authorised** old Android phone (Android 6.0 / API 23 and newer)
into a set of offline, no-account appliances. Part of DubboEwaste's reuse-first program.

> **Scope honesty:** this README describes what is *implemented and CI-built*, and what is
> *planned but not yet built*. A planned feature is not a working one.

## Implemented (v0.1 — builds in CI, offline, zero runtime permissions)

| Tool | Status | Notes |
|------|--------|-------|
| Launcher | ✅ Built | Grid of available tools |
| Clock | ✅ Built | Full-screen bedside clock, keeps screen on |
| Calculator | ✅ Built | Two-operand arithmetic |
| Stopwatch | ✅ Built | Start / stop / reset, accurate across pause/resume |

These need **no** storage, network, location or account permissions, so they run on a
factory-fresh, signed-out, authorised handset.

## Planned (v0.2 — NOT yet implemented)

These need `READ_MEDIA_*` / storage runtime permissions and `MediaStore` access, so they
are deliberately deferred until the permission UX and tests are in place:

- MP3 / audiobook player (local files)
- Digital photo frame (local images)
- Offline educational library (local documents)
- Information display

## Build

CI (`.github/workflows/android-reuse-app.yml`) builds the debug APK on every change under
`android-reuse-app/` and uploads it as the `dubbo-reuse-debug-apk` artifact.

Locally (needs JDK 17 + Android SDK):

```
cd android-reuse-app
gradle :app:assembleDebug      # or ./gradlew once wrapper scripts are generated
```

- Gradle 8.7, Android Gradle Plugin 8.5.2
- `compileSdk` / `targetSdk` 34, `minSdk` 23
- Only dependency: `androidx.appcompat`

## Authorisation boundary

This app is for phones that are **owned or authorised for reuse**. It performs no account
unlock, no FRP bypass and no data recovery. A handset that is account-locked
(e.g. "Google verifying your device") must be cleared through the owner or a
manufacturer-supported process **before** it is reused — see the account-lock guidance in
`tools/ipad-legacy-assistant/`.
