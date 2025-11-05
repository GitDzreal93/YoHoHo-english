import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yohoho.english',
  appName: 'YoHoHo English',
  webDir: 'dist',
  bundleWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#667eea",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#667eea'
    },
    Haptics: {
      enabled: true
    },
    LocalNotifications: {
      enabled: true
    },
    Preferences: {
      enabled: true
    },
    Keyboard: {
      resize: 'body'
    }
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#667eea',
    handleApplicationNotifications: true,
    handleLocalNotifications: true,
    appendUserAgent: 'YoHoHoEnglish/1.0',
    scrollEnabled: true,
    webContentsDebuggingEnabled: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
