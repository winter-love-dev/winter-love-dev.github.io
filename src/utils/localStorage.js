export function getValueFromLocalStorage(key) {
  if (typeof window === 'undefined') return;
  const storedValue = window.localStorage.getItem(key);

  if (storedValue === null && key === 'isDarkMode') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  }

  return JSON.parse(storedValue);
}

export function setValueToLocalStorage(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  if (key === 'isDarkMode') {
    window.dispatchEvent(new Event("theme"));
  }
}
