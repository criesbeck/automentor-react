import React from 'react';
import { navigate } from 'hookrouter';
import useForm from '../utils/useForm';
import { addTicket } from '../utils/tickets';
import 'rbx/index.css';
import { Button, Column, Container, Control, Field, Input, Message, Section, Select, Textarea } from 'rbx';

const Request = ({netid}) => {
  const [ values, handleChange ] = useForm(['exercise', 'message', 'sourceCode', 'computerOutput']);

  function submitRequest(event) {
    event.preventDefault();
    values.author = netid;
    values.date = Date.now();
    addTicket(values);
    navigate(`/requests/${netid}`);
  }

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={4} offset={4}>
            <Message>
              <Message.Header>Welcome, {netid}</Message.Header>
            </Message>
            <form onSubmit={submitRequest}>
              <Field>
                <Control>
                  <Select.Container>
                    <Select name="exercise" onChange={handleChange} value={values.exercise}>
                      <Select.Option value="ex-1">Exercise 1</Select.Option>
                      <Select.Option value="ex-2">Exercise 2</Select.Option>
                      <Select.Option value="ex-3">Exercise 3</Select.Option>
                    </Select>
                  </Select.Container>
                </Control>
              </Field>
              <Field>
                <Control>
                  <Input type="text" placeholder="Message" name="message" 
                    onChange={handleChange} value={values.message} required />
                </Control>
              </Field>
              <Field>
                <Control>
                  <Textarea rows={5} size="small" placeholder="Source code" name="sourceCode" 
                    onChange={handleChange} value={values.sourceCode} />
                </Control>
              </Field>
              <Field>
                <Control>
                  <Textarea rows={5} size="small" placeholder="Computer output" name="computerOutput" 
                    onChange={handleChange} value={values.computerOutput} />
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

export default Request;
