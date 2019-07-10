import { firebase } from './firebase';

const course = 'cs111-f18';
const ticketDb = firebase.database().ref(course).child('tickets');

const ticketTimeFormat = {
  month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
};

const cloneTicket = ticket => (
  {...ticket, blocks: [...ticket.blocks]}
);

const emptyTicket = (author) => ({
  author,
  blocks: []
});

const getTicket = async id => {
  const snap = await ticketDb.once('value');
  return snap.val()[id];
};

const getTickets = async () => {
  const snap = await ticketDb.once('value');
  return Object.entries(snap.val() || {});
};

const ticketSummary  = ticket => (
  ticket.blocks[0].text
)

const ticketTime = ticket => (
  new Date(ticket.timestamp).toLocaleString('en-US', ticketTimeFormat)
);

const addTimestamp = obj => (
  {...obj, timestamp: firebase.database.ServerValue.TIMESTAMP}
);

const updateTicket = async (id, ticket) => {
  const tsTicket = addTimestamp(ticket);
  if (id === '*') {
    ticketDb.push(tsTicket);
  } else {
    ticketDb.child(id).set(tsTicket);
  }
};

export { addTimestamp, cloneTicket, emptyTicket, getTicket, getTickets, ticketDb, ticketSummary, ticketTime, updateTicket };