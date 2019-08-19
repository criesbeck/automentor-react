import { firebase } from 'utils/firebase';

const ticketTimeFormat = {
  month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
};

const cloneTicket = ticket => (
  {...ticket, blocks: [...ticket.blocks]}
);

const emptyTicket = (author) => ({
  author,
  blocks: [],
  exercise: {
    id: '?',
    define: 'Question about error'
  }
});

const shortenId = exerciseId => (
  exerciseId.replace(/exercise_/, 'Ex ')
);

const ticketLabel = ticket => (
  ticket.exercise
  ? `${shortenId(ticket.exercise.id)}: ${ticket.exercise.define}`
  : ''
);

const ticketSummary = ticket => (
  ticket.blocks[0].text
)

const ticketTime = ticket => (
  new Date(ticket.timestamp).toLocaleString('en-US', ticketTimeFormat)
);

const addTimestamp = obj => (
  {...obj, timestamp: firebase.database.ServerValue.TIMESTAMP}
);

const updateTicket = async (db, id, ticket) => {
  const tsTicket = addTimestamp(ticket);
  if (id === '*') {
    db.push(tsTicket);
  } else {
    db.child(id).set(tsTicket);
  }
};

export { addTimestamp, cloneTicket, emptyTicket, 
  ticketLabel, ticketSummary, ticketTime, updateTicket };