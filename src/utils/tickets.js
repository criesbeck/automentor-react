const ticketTimeFormat = {
  month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
};

const addTicket = async (ticket) => {
  const data = getTicketData();
  const id = Object.keys(data).length + 1;
  data[id] = {id: id, ...ticket};
  localStorage.setItem('tickets', JSON.stringify(data));
};

const getTicketData = () => {
  const text = localStorage.getItem('tickets');
  return text ? JSON.parse(text) : {};
};

const getTicket = async id => (
  getTicketData()[id]
);

const getTickets = async () => (
  Object.values(getTicketData())
);

const ticketTime = (ts) => (
  new Date(ts).toLocaleString('en-US', ticketTimeFormat)
);

export { addTicket, getTicket, getTickets, ticketTime };