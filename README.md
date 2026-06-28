# Koko Counting Bay 🐢🌊

A calm, bright, offline sea-themed counting app for children. Kids count fish,
shells, crabs, and sea stars, compare quantities, and solve very simple
additions — all guided by **Koko**, a friendly sea turtle.

There are **no timers, no pressure, no penalties, no ads, no purchases, no
accounts, no internet, and no data collection**. Everything is stored locally
on the device and the app works fully in airplane mode.

---

## Features

- **Numbers 1–20** with a friendly Number Bay learning screen.
- **Three game modes:**
  - **Count and Choose** — count sea objects and choose the number.
  - **More or Less** — choose which group has more or less.
  - **Add Sea Friends** — add simple sea objects together (result always ≤ 10).
- **Three difficulty levels** (Easy / Medium / Hard) that stay child-friendly.
- **Sea stickers** — local learning badges for encouragement.
- **Local progress and statistics** — correct answers, games completed, and
  per-game-mode breakdowns.
- **Parent settings** — sound on/off, default difficulty, privacy notes, and a
  "Clear All Data" control.
- **Custom Koko Sunny Bay icon and splash screen.**

## Child safety notes

Koko Counting Bay is built to be safe for children. It does **not** use:

ads, in-app purchases, account registration, analytics, Firebase, external
APIs, internet access, personal data collection, location, camera, microphone,
contacts, photo gallery / image picker, file sharing, social sharing, public
profiles, leaderboards, chat, gambling mechanics, loot boxes, or real-money
mechanics.

There are **no coins, bonuses, jackpots, cash, or money rewards** of any kind.
Sea stickers are simple local learning markers and have **no money value**.

## Sea counting learning rules

- Numbers range from **1 to 20**.
- Counting objects: **fish, shells, crabs, and sea stars**.
- **Easy:** numbers 1–5, 2 answer choices, one sea object type, large clear groups.
- **Medium:** numbers 1–10, 3 answer choices, mixed sea objects.
- **Hard:** numbers 1–20 for counting/comparison, 4 answer choices, mixed objects.

## Simple math rules

- Addition results are **always 10 or less**. There is no subtraction.
- "More or Less" questions **never use equal groups**.
- Answer choices **always include the correct answer** and **never contain duplicates**.
- All number generation is simple, predictable, and safe.

## No timer / no pressure

There are no timers, countdowns, or penalties anywhere. Wrong answers receive a
gentle "Good try" message that also shows the correct answer. Each session is a
calm set of **5 questions**.

## No internet / no permissions

The app does not request the `INTERNET` permission or any runtime permissions
(location, camera, microphone, contacts, calendar, notifications, photo gallery,
storage, Bluetooth, nearby devices, or sensors). `app.json` declares an empty
`permissions` array and also blocks common sensitive permissions.

## Airplane mode support

Because there is no networking at all, the app works exactly the same in
airplane mode. All data stays on the device via `AsyncStorage`.

## Fullscreen sticky immersive mode

On Android the status bar and navigation bar are hidden using `SystemBars` from
`react-native-edge-to-edge` (`<SystemBars hidden />` in `App.js`, plus an
imperative request in `src/utils/immersiveHelpers.js`). System bars reappear
briefly after an edge swipe.

## Portrait only

Orientation is locked to `portrait` in `app.json`.

## Safe area

`react-native-safe-area-context` is used (via `ScreenContainer`) so content
never overlaps notches, camera cutouts, or rounded corners.

## Keep awake only on the game screen

`expo-keep-awake` is activated **only** on `CountingGameScreen` (the active game
screen) and is always released when leaving it. Static screens — Home, Number
Bay, Game Picker, Result, Sea Stickers, and Parent Settings — never hold the
device awake.

## Sea stickers and progress

Six sea stickers can be collected as local learning markers:

1. **First Fish Sticker** — answer 1 question correctly.
2. **Shell Counter Sticker** — answer 5 Count and Choose questions correctly.
3. **Crab Compare Sticker** — answer 5 More or Less questions correctly.
4. **Starfish Addition Sticker** — answer 5 Add Sea Friends questions correctly.
5. **Koko Bay Sticker** — complete 5 game sessions.
6. **Sea Counting Star** — answer 25 questions correctly.

There are no rankings, leaderboards, or social sharing.

## App icon and splash screen concept

- **Icon:** Koko the turtle centered on a bright sea-blue background with a soft
  sand lower edge, surrounded by a fish, shell, crab, and sea star, plus a large
  number bubble showing "5". (`assets/icon.png`, `assets/adaptive-icon.png`.)
- **Splash:** a soft blue bay with Koko floating near a number bubble, sea
  creatures arranged around the bay, the app name **Koko Counting Bay**, and the
  subtitle **"Count sea friends and play"**. (`assets/splash.png`.)

The default Expo icon and splash are **not** used.

## Koko Sunny Bay visual style

A soft tropical bay with clear water, rounded waves, sand, friendly sea
creatures, and the cheerful Koko mascot. The UI is drawn with pure React Native
Views and emoji-style symbols — no external art packs or heavy SVG libraries.

---

## Project structure

```
App.js
package.json
app.json
package-lock.json   (generated by `npm install` — see below)
assets/
  icon.png
  adaptive-icon.png
  splash.png
src/
  navigation/AppNavigator.js
  screens/        7 screens
  components/      11 components
  data/            numberItems, seaObjectItems, gameModeItems, stickerItems
  utils/           counting / question / stats / progress / sound / animation /
                   immersive / date helpers
  storage/appStorage.js
  theme/colors.js
android/app/proguard-rules.pro   (R8/ProGuard rules used by the release build)
.github/workflows/android-build.yml
```

---

## How to scaffold with the official Expo template

This repository already contains the full source. To recreate the scaffold from
scratch, the canonical commands are:

```bash
npx create-expo-app koko-counting-bay --template blank
cd koko-counting-bay
```

Then add the source files from `App.js` and `src/`, and the assets.

## How to install dependencies (always via `npx expo install`)

Never hand-edit dependency versions. Install / align everything with Expo:

```bash
npm install
npx expo install --fix
npx expo install \
  @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage \
  react-native-edge-to-edge expo-keep-awake \
  expo-asset expo-constants expo-font expo-modules-core \
  expo-build-properties
```

> **`package-lock.json`:** run a full `npm install` once and commit the
> generated `package-lock.json`. It is intentionally **not** hand-written. CI
> uses `npm install` (not `npm ci`), so the build works before the lockfile is
> committed, but committing it is recommended for reproducible builds.

## How to run locally

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo install --check
npx expo start          # open in Expo Go or a dev build
npx expo run:android    # build & run a native debug build on a device/emulator
```

## How to build Android

Release builds are produced from the native project generated by `expo prebuild`:

```bash
npx expo prebuild --platform android --no-install
cd android
./gradlew assembleRelease    # APK  -> app/build/outputs/apk/release/app-release.apk
./gradlew bundleRelease      # AAB  -> app/build/outputs/bundle/release/app-release.aab
```

### Staged release optimization

Ship a **non-minified** release first, verify it launches, then enable
minification and resource shrinking.

1. **Initial release** (already the default — non-minified) in
   `android/app/build.gradle`:

   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled false
               shrinkResources false
           }
       }
   }
   ```

2. After verifying the non-minified release launches, enable R8:

   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

   The committed `android/app/proguard-rules.pro` keeps React Native, Hermes,
   Expo, and AsyncStorage safe under R8. Re-test the app launch after enabling.

## How to generate the PKCS12 keystore

Use the **same password** for the keystore and the key (different passwords can
break PKCS12 signing):

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore koko-counting-bay-release-key.p12 \
  -alias koko_counting_bay_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Convert it to base64 for GitHub Secrets:

```bash
# macOS / Linux
base64 -i koko-counting-bay-release-key.p12 -o keystore.base64.txt
# (or)  base64 koko-counting-bay-release-key.p12 > keystore.base64.txt
```

## How to add GitHub Secrets

In your repository: **Settings → Secrets and variables → Actions → New
repository secret**, and add:

| Secret name                 | Value                                            |
|-----------------------------|--------------------------------------------------|
| `ANDROID_KEYSTORE_BASE64`   | contents of `keystore.base64.txt`                |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore password                            |
| `ANDROID_KEY_ALIAS`         | `koko_counting_bay_key`                          |
| `ANDROID_KEY_PASSWORD`      | the key password (same as the keystore password) |

Never commit the keystore or passwords to the repository.

## GitHub Actions build explanation

`.github/workflows/android-build.yml` runs on push to `main` (and manual
dispatch) and:

1. checks out the repo and sets up Node.js 20 and JDK 17;
2. runs `npm install`;
3. runs `npx expo install --fix`, `npx expo-doctor`, and `npx expo install --check`;
4. installs **Android SDK Platform 35** and **Build Tools 35.0.0**
   (`sdkmanager "platforms;android-35" "build-tools;35.0.0"`);
5. runs `npx expo prebuild --platform android`;
6. decodes the keystore and injects a release `signingConfig`;
7. builds the signed release **APK** and **AAB**;
8. uploads `koko-counting-bay-release.apk` and `koko-counting-bay-release.aab`
   as artifacts.

The Android emulator launch smoke-test is intentionally **not** mandatory in CI.
Launch verification is a local pre-release step (below).

## Google Play compatibility notes

- Targets **Android API 35** (`compileSdkVersion 35`, `targetSdkVersion 35`) via
  `expo-build-properties` — it never targets API 34.
- `minSdkVersion 24` (compatible with React Native 0.79).
- A current Expo SDK / React Native is used so the release AAB supports
  **Android 15+ 16 KB memory page sizes**.
- No Firebase, ads, analytics, payment, or external native SDKs are added.
- Avoids the Play errors:
  - "Your app currently targets API level 34 and must target at least API level 35"
  - "Your app does not support 16 KB memory page sizes"

## Local launch verification checklist

A successful CI build is **not** proof the app launches. Before release:

1. Build the release APK.
2. Install it on a physical Android device or local emulator:
   `adb install -r dist/koko-counting-bay-release.apk`
3. Launch the app and capture logs: `adb logcat`.
4. Confirm there are **no** errors such as:
   - "Cannot find native module"
   - "Module has not been registered"
   - "Invariant Violation"
   - "theme.fonts.regular is undefined"
5. Repeat after enabling `minifyEnabled` / `shrinkResources`.

## Privacy note

Koko Counting Bay does not collect, store, or share personal information. The app
works offline without internet access. Learning progress, statistics, stickers,
and settings are stored only on the device.
