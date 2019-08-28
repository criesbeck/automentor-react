import { useCallback, useEffect } from 'react';
import { firebase } from 'utils/firebase';

const defaultErrorHandler = (error) => {
  window.alert(error);
};

const formQuery = (path, options) => (
  Object.keys(options).filter(key => key !== 'path').reduce((ref, key) => (
    options[key] === null ? ref[key]() : ref[key](options[key])
  ), firebase.database().ref().child(path))
);

const getFirebaseRef = query => (
  !query ? null
  : typeof query === 'string'
  ? firebase.database().ref().child(query)
  : formQuery(query.path, query)
);

const useFirebaseRef = query => (
  useCallback(() => getFirebaseRef(query), [query])
);

const useFirebase = (query, handler, errorHandler = defaultErrorHandler) => {
  useEffect(() => {
    if (!query) return;
    const db = getFirebaseRef(query);
    const listener = snap => {
      handler(snap.val());
    };

    db.on('value', listener, errorHandler);
    return () => db.off('value', listener);
  }, [query, handler, errorHandler]);
};

const useFirebaseValue = (query, handler, errorHandler = defaultErrorHandler) => {
  useEffect(() => {
    const getValue = async () => {
      if (!query) return;
      
      const db = getFirebaseRef(query);
      const snap = await db.once('value');
      handler(snap.val());
    };
    getValue();
  }, [query, handler, errorHandler]);
};

export { useFirebase, useFirebaseRef, useFirebaseValue };