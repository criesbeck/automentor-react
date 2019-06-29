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

const getMembers = async () => {
  const snap = await memberDb.once('value');
  return snap.val() || {};
};

export { addMember, getMembers };