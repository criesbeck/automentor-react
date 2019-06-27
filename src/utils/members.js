import firedb from './firebase';

const memberDb = firedb.ref('cs111-f18/members');

const getMembers = async () => {
  const snap = await memberDb.once('value');
  return snap.val() || {};
};

export { getMembers };