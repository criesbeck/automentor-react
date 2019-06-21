import firedb from './firebase';

const ticketDb = firedb.ref('tickets');

const ticketTimeFormat = {
  month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
};

const addTicket = async (ticket) => {
  ticketDb.push(ticket);
};

const getTicket = async id => {
  const snap = await ticketDb.once('value');
  return snap.val()[id];
};

const getTickets = async () => {
  const snap = await ticketDb.once('value');
  return Object.entries(snap.val() || {});
};

const ticketTime = (ts) => (
  new Date(ts).toLocaleString('en-US', ticketTimeFormat)
);

export { addTicket, getTicket, getTickets, ticketDb, ticketTime };