import React, { useState, useEffect } from 'react';
import { useTitle } from 'hookrouter';
import "rbx/index.css";
import { Button, Card, Column, Container, Content, Control, Field, Level, Section, Textarea } from 'rbx';
import useForm from "../utils/useForm";
import { getTicket, ticketTime } from '../utils/tickets';

const Entry = ({ title, children }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content>{ children }</Content>
    </Card.Content>
  </Card>  
);

const TicketResponder = ({context, id}) => {
  useTitle('Ticket Responder');
  const [ values, handleChange ] = useForm(['response', 'note']);
  const [ ticket, setTicket ] = useState(null);

  const blockSource = block => (
    block.source || (block.isCode ? 'Code' : 'Text')
  );

  useEffect(() => {
    const fetchTicket = async (id) => {
      const ticket = await getTicket(id);
      setTicket(ticket);
    };
    fetchTicket(id);
  }, [id]);

  function respondToStudent(event) {
    event.preventDefault();
    values.isMentor = true;
    values.author = context.netid;
    values.date = Date.now();
    values.ticketId = id;
    console.log(values);
  };

  return !ticket ? '...Loading ticket' : (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
            <Level>
              <Level.Item>
                <Entry title="Student">{ticket.author}</Entry>
              </Level.Item>
              <Level.Item>
                <Entry title="Date">{ticketTime(ticket)}</Entry>
              </Level.Item>
              <Level.Item>
                <Entry title="Exercise">{ticket.exercise}</Entry>
              </Level.Item>
            </Level>
            {
              ticket.blocks.map(block => (
                <Entry key={block.timestamp} title={blockSource(block)}>{block.text}</Entry>
              ))
            }
            <Field>
              <Control>
                <Textarea rows={5} placeholder="Response to student" name="response" 
                  onChange={handleChange} value={values.response} required />
              </Control>
            </Field>
            <Field>
              <Control>
                <Textarea rows={5} placeholder="Note for mentors" name="note" 
                  onChange={handleChange} value={values.note} required />
              </Control>
            </Field>
            <Field>
              <Control>
                <Button color="primary" onClick={respondToStudent}>Send to student</Button>
              </Control>
            </Field>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default TicketResponder;
