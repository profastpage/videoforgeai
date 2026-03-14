"use client";

import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirebaseClientConfig } from "@/lib/firebase/config";

let emulatorConnected = false;

export function getFirebaseClientAuth() {
  const { config, isConfigured, authEmulatorHost } = getFirebaseClientConfig();

  if (!isConfigured) {
    return null;
  }

  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });

  const auth = getAuth(app);

  void setPersistence(auth, browserLocalPersistence);

  if (authEmulatorHost && !emulatorConnected) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`, {
      disableWarnings: true,
    });
    emulatorConnected = true;
  }

  return auth;
}
