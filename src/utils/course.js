import { firebase } from './firebase';

let db, dbName;

const addMember = async ({ uid, displayName, email, role = ''} ) => {
  try {
    await db.child('members').child(uid).set({ uid, displayName, email, role });
  } catch (exc) {
    alert(`Could not add ${uid}: ${displayName} to ${dbName} -- ${exc}`);
  }
};

// starts listening for offering membership changes, returns function to stop listening
const membersTracker = (offering, handler) => {
  dbName = offering;
  db = firebase.database().ref(offering).child('members');
  const listener = snap => {
    if (snap.val()) handler(snap.val())
  };
  db.on('value', listener, (error) => alert(error));
  return () => db.off('value', listener);
};

// starts listening for course exercise changes, returns function to stop listening
const courseTracker = (courseName, handler) => {
  const courseDb = firebase.database().ref(courseName);
  const listener = snap => {
    if (snap.val()) handler(snap.val())
  };
  courseDb.on('value', listener, (error) => alert(error));
  return () => courseDb.off('value', listener);
};

export { addMember, courseTracker, membersTracker };