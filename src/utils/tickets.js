import firedb from './firebase';

const ticketDb = firedb.ref('tickets');

const ticketTimeFormat = {
  month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
};

const emptyTicket = () => ({
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

const updateTicket = async (id, ticket) => {
  if (id) {
    ticketDb.child(id).set(ticket);
  } else {
    ticketDb.push(ticket);
  }
};

export { emptyTicket, getTicket, getTickets, ticketDb, ticketSummary, ticketTime, updateTicket };