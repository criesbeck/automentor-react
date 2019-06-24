import React, { useState, useEffect } from 'react';
import { useTitle } from 'hookrouter';
import 'rbx/index.css';
import { Container, Message, Section, Table } from 'rbx';
import { ticketDb, ticketSummary, ticketTime } from '../utils/tickets';

const RequestRow = ({ ticket }) => (
  <Table.Row>
    <Table.Cell>{ticketTime(ticket)}</Table.Cell>
    <Table.Cell>{ticket.exercise}</Table.Cell>
    <Table.Cell>{ticketSummary(ticket)}</Table.Cell>
  </Table.Row>
);

const RequestList = ({context}) => {
  useTitle('My Tickets');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const handleData = snap => {
      const tickets = Object.entries(snap.val() || {});
      setTickets(tickets.filter(([id, ticket]) => ticket.author === context.netid));
    }
    ticketDb.on('value', handleData, error => alert(error));

    return () => { ticketDb.off('value', handleData); };
  }, [context.netid]);

  const rows = tickets.map(([id, ticket]) => (
    <RequestRow key={id} ticket={ticket} />
  ));

  return (
    <Section>
      <Container>
        <Message>
          <Message.Header>Welcome, {context.netid}</Message.Header>
        </Message>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading>Date</Table.Heading>
              <Table.Heading>Exercise</Table.Heading>
              <Table.Heading>Message</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            { rows }
          </Table.Body>
        </Table>
      </Container>
    </Section>
  );
};

export default RequestList;
