import { firebase } from './firebase';

const course = 'cs111-f18';
const memberDb = firebase.database().ref(course).child('members');

const addMember = async (uid, displayName, email, role = '') => {
  try {
    await memberDb.child(uid).set({ uid, displayName, email, role });
  } catch (exc) {
    alert(`Could not add ${uid}: ${displayName} to ${course} -- ${exc}`);
  }
}

// starts listening, returns function to stop listening
const memberOff = (handleData) => {
  const listener = snap => { if (snap.val()) handleData(snap.val())};
  memberDb.on('value', listener, (error) => alert(error));
  return () => memberDb.off('value', listener);
};

export { addMember, memberOff };