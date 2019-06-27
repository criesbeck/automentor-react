import React, { useState, useEffect } from 'react';
import { A, setQueryParams } from 'hookrouter';
import 'rbx/index.css';
import { Button, Content, Control, Field, Table } from 'rbx';
import { ticketDb, ticketSummary, ticketTime } from '../utils/tickets';

const TicketRow = ({ id, ticket, context } ) => (
  <Table.Row>
    <Table.Cell>{ticketTime(ticket)}</Table.Cell>
    { context.isMentor && <Table.Cell>{ticket.author}</Table.Cell> }
    <Table.Cell>{ticket.exercise}</Table.Cell>
    <Table.Cell><A href="#" onClick={() => setQueryParams({tid: id})}>{ticketSummary(ticket)}</A></Table.Cell>
  </Table.Row>
);

const TicketList = ({context}) => {
  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const canSeeTicket = ([id, ticket]) => (
      !ticket.isClosed && (context.isMentor || context.netid === ticket.author)
    );
    const handleData = snap => {
      const tickets = Object.entries(snap.val() || {}).filter(canSeeTicket);
      setTickets(tickets.length ? tickets : []);
    };
    ticketDb.on('value', handleData, error => alert(error));

    return () => { ticketDb.off('value', handleData); };
  }, [context]);

  const byTicketTime = ([id1, tkt1], [id2, tkt2]) => tkt1.timestamp - tkt2.timestamp;

  const rows = tickets.sort(byTicketTime).map(([id, ticket]) => (
    <TicketRow key={id} id={id} ticket={ticket} context={context} />
  ));

  return (
    <Content className="ticket-list">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Heading>Date</Table.Heading>
            { context.isMentor && <Table.Heading>Student</Table.Heading> }
            <Table.Heading>Exercise</Table.Heading>
            <Table.Heading>Message</Table.Heading>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          { rows }
        </Table.Body>
      </Table>
      {
        context.isMentor ? null : (
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
