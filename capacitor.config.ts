import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gitmaxxing.app",
  appName: "github-stats-tracker",
  webDir: "out",
  server: {
    url: "http://192.168.1.103:3000/",
    cleartext: true,
  },
};

export default config;