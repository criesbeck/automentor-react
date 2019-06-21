import React, { useState, useEffect } from 'react';
import { A } from 'hookrouter';
import 'rbx/index.css';
import { Container, Message, Section, Table } from 'rbx';
import { getTickets, ticketTime } from '../utils/tickets';

const TicketRow = ({ id, date, student, exercise, message }) => (
  <Table.Row>
    <Table.Cell>{ticketTime(date)}</Table.Cell>
    <Table.Cell>{student}</Table.Cell>
    <Table.Cell>{exercise}</Table.Cell>
    <Table.Cell><A href={`/ticket/${id}`}>{message}</A></Table.Cell>
  </Table.Row>
);

const TicketList = ({netid}) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTickets();
      setTickets(tickets);
    };
    fetchTickets();
  }, []); 

  const rows = tickets.map(ticket => (
    <TicketRow key={ticket.id} ticket={ticket} />
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
              <Table.Heading>Student</Table.Heading>
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

export default TicketList;
