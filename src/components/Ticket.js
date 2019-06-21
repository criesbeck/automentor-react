import React, { useState, useEffect } from 'react';
import "rbx/index.css";
import { Button, Card, Column, Container, Content, Control, Field, Section, Textarea } from 'rbx';
import useForm from "../utils/useForm";
import { getTicket, ticketTime } from '../utils/tickets';

const Entry = ({ title, text }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content>{ text }</Content>
    </Card.Content>
  </Card>  
);

const Ticket = ({id}) => {
  const [ values, handleChange ] = useForm(['response', 'note']);
  const [ ticket, setTicket ] = useState(null);

  useEffect(() => {
    const fetchTicket = async (id) => {
      const ticket = await getTicket(id);
      setTicket(ticket);
    };
    fetchTicket(id);
  }, [id]);

  function respond(event) {
    event.preventDefault();
    values.date = Date.now();
    values.ticketId = id;
    console.log(values);
  };

  return !ticket ? '...Loading ticket' : (
    <Section>
      <Container>
        <Column.Group>
          <Column size={4} offset={4}>
            <Entry title="Student" text={ticket.student} />
            <Entry title="Date" text={ticketTime(ticket.date)} />
            <Entry title="Exercise" text={ticket.exercise} />
            <Entry title="Message" text={ticket.message} />
            <Entry title="Source code" text={ticket.sourceCode} />
            <Entry title="Computer output" text={ticket.computerOutput} />
            <form onSubmit={respond}>
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
                  <Button type="submit" color="primary">Submit</Button>
                </Control>
              </Field>
            </form>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default Ticket;
