import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orbit.social',
  appName: 'Orbit',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // We handle our own splash in React
      backgroundColor: '#070d1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
  android: {
    backgroundColor: '#070d1a',
  },
};

export default config;
