import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  API_BASE_URL: 'settings.apiBaseUrl',
};

export async function getApiBaseUrl(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.API_BASE_URL);
    return value && value.trim().length > 0 ? value : null;
  } catch {
    return null;
  }
}

export async function setApiBaseUrl(url: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.API_BASE_URL, url);
  } catch {
    // ignore
  }
}

export { STORAGE_KEYS };


