import React, { useState, useEffect } from 'react';
import { A, setQueryParams } from 'hookrouter';
import 'rbx/index.css';
import { Button, Content, Control, Field, Table } from 'rbx';
import { ticketDb, ticketSummary, ticketTime } from '../utils/tickets';

const TicketRow = ({ id, ticket, user } ) => (
  <Table.Row>
    <Table.Cell>{ticketTime(ticket)}</Table.Cell>
    { user.role === 'mentor' && <Table.Cell>{ticket.author}</Table.Cell> }
    <Table.Cell>{ticket.exercise}</Table.Cell>
    <Table.Cell>
      <A href="#" onClick={() => setQueryParams({tid: id})}>
        <Content as="span" badge={ticket.unread && ticket.unread !== user.email ? 'New' : null}>
          {ticketSummary(ticket)}
        </Content> 
      </A>
    </Table.Cell>
  </Table.Row>
);

const TicketList = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const handleData = snap => {
      const tickets = Object.entries(snap.val() || {});
      setTickets(tickets.length ? tickets : []);
    };
    const ref = user.role === 'mentor' ? ticketDb : ticketDb.orderByChild('author').equalTo(user.uid);
    ref.on('value', handleData, error => alert(error));

    return () => { ref.off('value', handleData); };
  }, [user]);

  const byTicketTime = ([id1, tkt1], [id2, tkt2]) => tkt1.timestamp - tkt2.timestamp;

  const rows = tickets.sort(byTicketTime).map(([id, ticket]) => (
    <TicketRow key={id} id={id} ticket={ticket} user={ user } />
  ));

  return (
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
      {
        user.role === 'mentor' ? null : (
          <Field horizontal align="center">
            <Control>
              <Button onClick={() => setQueryParams({tid: '*'})}>New ticket</Button>
            </Control>
          </Field>
        )
      }
    </Content>
  );
};

export default TicketList;
