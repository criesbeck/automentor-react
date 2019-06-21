import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Container, Message, Section, Table } from 'rbx';
import { ticketDb, ticketTime } from '../utils/tickets';

const RequestRow = ({ ticket: { date, exercise, message } }) => (
  <Table.Row>
    <Table.Cell>{ticketTime(date)}</Table.Cell>
    <Table.Cell>{exercise}</Table.Cell>
    <Table.Cell>{message}</Table.Cell>
  </Table.Row>
);

const RequestList = ({netid}) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const handleData = snap => {
      const tickets = Object.entries(snap.val() || {});
      setTickets(tickets.filter(([id, ticket]) => ticket.student === netid));
    }
    ticketDb.on('value', handleData, error => alert(error));

    return () => { ticketDb.off('value', handleData); };
  }, [netid]);

  const rows = tickets.map(([id, ticket]) => (
    <RequestRow key={id} ticket={ticket} />
  ));

  return (
    <Section>
      <Container>
        <Message>
          <Message.Header>Welcome, {netid}</Message.Header>
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
