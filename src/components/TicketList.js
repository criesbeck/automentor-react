import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Content, Control, Field, Table } from 'rbx';
import { emptyTicket, ticketDb, ticketSummary, ticketTime } from '../utils/tickets';

const TicketRow = ({ ticket, select, user } ) => (
  <Table.Row>
    <Table.Cell>{ticketTime(ticket)}</Table.Cell>
    { user.role === 'mentor' && <Table.Cell>{ticket.author}</Table.Cell> }
    <Table.Cell>{ticket.exercise}</Table.Cell>
    <Table.Cell>
      <a href="#ticket-editor" onClick={ select }>
        <Content as="span">
          {ticketSummary(ticket)}
        </Content> 
      </a>
    </Table.Cell>
  </Table.Row>
);

const TicketList = ({ user, setTicketState }) => {
  const [tickets, setTickets] = useState({});

  useEffect(() => {
    const onData = snap => setTickets(snap.val());
    const ref = user.role === 'mentor' ? ticketDb : ticketDb.orderByChild('author').equalTo(user.uid);
    ref.on('value', onData, error => alert(error));
    return () => { ref.off('value', onData); };
  }, [user]);

  const select = (id, ticket) => {
    setTicketState({ id, ticket});
  };

  const newTicket = () => {
    setTicketState({id: ticketDb.push(), ticket: emptyTicket() });
  }
  const byTicketTime = ([id1, tkt1], [id2, tkt2]) => tkt1.timestamp - tkt2.timestamp;

  const rows = Object.entries(tickets).sort(byTicketTime).map(([id, ticket]) => (
    <TicketRow key={id} ticket={ ticket } select={ () => select(id, ticket) } tickets={ tickets } user={ user } />
  ));

  return (
    <React.Fragment>
      <Content className="ticket-list">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading>Date</Table.Heading>
              { user.role === 'mentor' && <Table.Heading>Student</Table.Heading> }
              <Table.Heading>Exercise</Table.Heading>
              <Table.Heading>Message</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            { rows }
          </Table.Body>
        </Table>
      </Content>
      {
        user.role === 'mentor' ? null : (
          <Field horizontal align="center">
            <Control>
              <Button onClick={() => newTicket()}>New ticket</Button>
            </Control>
          </Field>
        )
      }
    </React.Fragment>
  );
};

export default TicketList;
