import { firebase } from './firebase';

const offering = 'cs111-f18';
const offeringDb = firebase.database().ref(offering);
const courseDb = offeringDb.child('course');
const memberDb = offeringDb.child('members');

const addMember = async ({ uid, displayName, email, role = ''} ) => {
  try {
    await memberDb.child(uid).set({ uid, displayName, email, role });
  } catch (exc) {
    alert(`Could not add ${uid}: ${displayName} to ${offering} -- ${exc}`);
  }
}

// starts listening, returns function to stop listening
const dbTracker= (dbRef, handleData) => {
  const listener = snap => { if (snap.val()) handleData(snap.val())};
  dbRef.on('value', listener, (error) => alert(error));
  return () => dbRef.off('value', listener);
};

const courseTracker = handler => dbTracker(courseDb, handler);
const membersTracker = handler => dbTracker(memberDb, handler);

export { addMember, courseTracker, membersTracker };