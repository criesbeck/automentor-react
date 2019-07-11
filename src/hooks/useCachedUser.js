import { useState } from 'react';

const getCachedUser = () => {
  const text = window.sessionStorage.getItem('cachedUser');
  return text ? JSON.parse(text) : null;
};

const isRecent = time => (
  (Date.now() - time) < 24 * 60 * 60 * 1000
);

const validUser = (user, testMode) => (
  user && (testMode || isRecent(user.time)) ? user : null
);

const useCachedUser = (testMode = false) => {
  const [user, setUser] = useState(validUser(getCachedUser(), testMode));

  const setCachedUser = (user) => {
    setUser(user);
    if (user) {
      window.sessionStorage.setItem('cachedUser', JSON.stringify(user));
    } else {
      window.sessionStorage.removeItem('cachedUser');
    }
  };
  
  return [user, setCachedUser];
};

export { useCachedUser }; 