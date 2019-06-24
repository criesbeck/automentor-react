import React, { useState } from 'react';
import { navigate, useTitle } from 'hookrouter';
import useForm from '../utils/useForm';
import { addTicket } from '../utils/tickets';
import BlockEditor from './BlockEditor';
import 'rbx/index.css';
import { Box, Button, Column, Container, Control, Field, Message, Section, Select } from 'rbx';

const FilledField = ({block}) => (
  <Box as={block.isCode ? 'pre' : 'div'}>{block.text}</Box>
);

const TicketMaker = ({context}) => {
  useTitle('Ticket Maker');
  const [ values, handleChange ] = useForm(['exercise', 'block']);
  const [ blocks, setBlocks ] = useState([]);

  const updateBlock = (oldBlock, newBlock) => {
    setBlocks(blocks.map(block => (
      block === oldBlock ? {...oldBlock, ...newBlock} : oldBlock))
    );
  };

  const addBlock = (block) => setBlocks([...blocks, block]);

  const saveBlock = (newBlock, oldBlock) => {
    if (oldBlock) {
      updateBlock(oldBlock, newBlock);
    } else {
      addBlock(newBlock);
    }
  };

  const closeBlock = block => (
    {...block, timestamp: Date.now(), isClosed: true }
  );

  const submitBlockHandler = (block, event) => {
    saveBlock(closeBlock(block));
  };

  const submitRequest = (event) => {
    event.preventDefault();
    addTicket({ author: context.netid, timestamp: Date.now(), exercise: values.exercise, blocks });
    navigate('/requests');
  };

  const boxes = blocks.map(block => (
    <FilledField key={block.timestamp} block={block} />
  ));

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={10} offset={1}>
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
              <Message>
                <Message.Header>Welcome, {context.netid}</Message.Header>
                <Message.Body>
                  { boxes }
                </Message.Body>
              </Message>
              <BlockEditor submitBlockHandler={submitBlockHandler} />
              <Field>
                <Control>
                  <Button color="primary" onClick={submitRequest}>Send request</Button>
                </Control>
              </Field>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default TicketMaker;
