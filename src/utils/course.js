import { firebase } from './firebase';

let db, dbName;

const addMember = async ({ uid, displayName, email, role = ''} ) => {
  try {
    await db.child('members').child(uid).set({ uid, displayName, email, role });
  } catch (exc) {
    alert(`Could not add ${uid}: ${displayName} to ${dbName} -- ${exc}`);
  }
}

// starts listening, returns function to stop listening
const dbTracker = (offering, child, handler) => {
  dbName = offering;
  db = firebase.database().ref(offering).child(child);
  const listener = snap => {
    if (snap.val()) handler(snap.val())
  };
  db.on('value', listener, (error) => alert(error));
  return () => db.off('value', listener);
};

const courseTracker = (offering, handler) => dbTracker(offering, 'course', handler);
const membersTracker = (offering, handler) => dbTracker(offering, 'members', handler);

export { addMember, courseTracker, membersTracker };