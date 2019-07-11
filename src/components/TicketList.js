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
      <Content onClick={ select }>
        {ticketSummary(ticket)}
      </Content>
    </Table.Cell>
  </Table.Row>
);

const TicketList = ({ user, selectTicket }) => {
  const [tickets, setTickets] = useState({});

  useEffect(() => {
    const onData = snap => {
      window.scrollTo(0, 0);
      setTickets(snap.val() || []);
    };
    const ref = user.role === 'mentor' ? ticketDb : ticketDb.orderByChild('author').equalTo(user.uid);
    ref.on('value', onData, error => alert(error));
    return () => { ref.off('value', onData); };
  }, [user]);

  const select = (id, ticket) => {
    selectTicket(id, ticket);
  };

  const newTicket = () => {
    selectTicket( ticketDb.push().key, emptyTicket(user.uid));
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
