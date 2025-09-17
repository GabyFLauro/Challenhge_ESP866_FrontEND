export function isNonEmpty(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  if (!isNonEmpty(value)) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value.trim());
}

export function isMinLength(value: string, min: number): boolean {
  return isNonEmpty(value) && value.trim().length >= min;
}

export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

export function toUserMessage(error: unknown, fallback: string = 'Ocorreu um erro'): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return fallback;
  }
}


