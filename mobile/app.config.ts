import type { ConfigContext, ExpoConfig } from 'expo/config';

import manifest from './model/manifest.json';

// APP_VARIANT=release produces the store build. It must never request network
// access: on Android the INTERNET permission is stripped from the manifest, so the
// OS itself refuses any socket. Development builds keep it because Metro (the JS
// dev server) needs it.
const isRelease = process.env.APP_VARIANT === 'release';

export const NETWORK_PERMISSIONS = [
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.ACCESS_WIFI_STATE',
];

// Added by the React Native template for development tooling; the app does not
// need them (file import uses the system picker).
const UNUSED_PERMISSIONS = [
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
];

const bundleId = process.env.APP_BUNDLE_ID ?? 'app.kompass.offline';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Kompass',
  slug: 'kompass-offline',
  scheme: 'kompass',
  version: '1.0.0',
  platforms: ['ios', 'android'],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: true,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        'Kompass zeigt Ihre Koordinaten und die Himmelsrichtung an. Der Standort verlässt das Gerät nie. / Kompass shows your coordinates and heading. Your location never leaves the device.',
      NSAppTransportSecurity: { NSAllowsArbitraryLoads: false },
      UIRequiredDeviceCapabilities: ['arm64', 'metal'],
    },
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [],
      NSPrivacyAccessedAPITypes: [
        { NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults', NSPrivacyAccessedAPITypeReasons: ['CA92.1'] },
        { NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp', NSPrivacyAccessedAPITypeReasons: ['C617.1'] },
        { NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime', NSPrivacyAccessedAPITypeReasons: ['35F9.1'] },
        { NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace', NSPrivacyAccessedAPITypeReasons: ['E174.1'] },
      ],
    },
  },
  android: {
    package: bundleId,
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#0F1A14',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    permissions: ['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION'],
    blockedPermissions: isRelease ? [...NETWORK_PERMISSIONS, ...UNUSED_PERMISSIONS] : [],
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    'expo-localization',
    ['expo-splash-screen', { image: './assets/splash-icon.png', imageWidth: 160, backgroundColor: '#0F1A14' }],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Kompass zeigt Ihre Koordinaten und die Himmelsrichtung an. Der Standort verlässt das Gerät nie.',
        isAndroidBackgroundLocationEnabled: false,
        isIosBackgroundLocationEnabled: false,
      },
    ],
    // Store builds target real phones (arm64); dev builds also run on x86_64 emulators.
    ['expo-build-properties', { android: { buildArchs: isRelease ? ['arm64-v8a'] : ['arm64-v8a', 'x86_64'] } }],
    // Declares optional OpenCL/Hexagon libraries so Snapdragon GPUs can be used when present.
    ['llama.rn', { enableOpenCLAndHexagon: true }],
    ['./plugins/withOfflineModel', { fileName: manifest.fileName }],
  ],
  experiments: { typedRoutes: true },
  extra: { model: manifest, release: isRelease },
});
