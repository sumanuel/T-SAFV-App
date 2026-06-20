import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "tsafv_token";
const ONBOARDING_KEY = "tsafv_onboarding_seen";

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export async function setToken(token) {
  try {
    return await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (e) {
    return null;
  }
}

export async function deleteToken() {
  try {
    return await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export async function getHasSeenOnboarding() {
  try {
    return (await SecureStore.getItemAsync(ONBOARDING_KEY)) === "1";
  } catch (e) {
    return false;
  }
}

export async function setHasSeenOnboarding() {
  try {
    return await SecureStore.setItemAsync(ONBOARDING_KEY, "1");
  } catch (e) {
    return null;
  }
}
