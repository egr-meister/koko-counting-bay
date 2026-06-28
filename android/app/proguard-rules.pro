# Koko Counting Bay - ProGuard / R8 rules
#
# Staged release optimization:
#   1. First ship a non-minified release build (minifyEnabled false).
#   2. Only after verifying it launches, enable minify + resource shrink.
#
# These rules keep React Native, Hermes and Expo runtime safe under R8.

# --- React Native core ---
-keep,allowobfuscation class com.facebook.react.** { *; }
-keep,allowobfuscation class com.facebook.hermes.** { *; }
-keep,allowobfuscation class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# Keep native module annotations and methods invoked from JS via reflection.
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keep @com.facebook.react.module.annotations.ReactModule class * { *; }

# --- Expo modules ---
-keep class expo.modules.** { *; }
-keep class expo.core.** { *; }
-dontwarn expo.modules.**

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# --- Hermes / JSC ---
-keep class com.facebook.jni.** { *; }

# Keep generic signatures and annotations (needed by RN runtime).
-keepattributes Signature,*Annotation*,SourceFile,LineNumberTable

# Suppress warnings for optional dependencies that may not be present.
-dontwarn okio.**
-dontwarn javax.annotation.**
