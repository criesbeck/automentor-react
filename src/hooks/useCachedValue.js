import { useEffect, useState } from 'react';

// by default, no expiration
const getCachedValue = (key, expiration) => {
  const text = window.sessionStorage.getItem(key);
  if (!text) return null;
  const { timestamp, value } = JSON.parse(text);
  if (!expiration || (Date.now() - timestamp) < expiration) return value;
  setCachedValue(key, null);
  return null;
};

const setCachedValue = (key, value) => {
  if (value) {
    window.sessionStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
  } else {
    window.sessionStorage.removeItem(key);
  }
}

const useCachedValue = (key, expiration) => {
  const [value, setValue] = useState(getCachedValue(key, expiration));

  useEffect(() => {
    setCachedValue(key, value);
  }, [key, value]);
  
  return [value, setValue];
};

export { useCachedValue }; 