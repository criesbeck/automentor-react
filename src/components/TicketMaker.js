import React, { useEffect, useState } from 'react';
import { useQueryParams } from 'hookrouter';
import useForm from '../utils/useForm';
import { emptyTicket, getTicket, updateTicket } from '../utils/tickets';
import BlockEditor from './BlockEditor';
import 'rbx/index.css';
import { Box, Button, Control, Divider, Field, Select } from 'rbx';

const FilledField = ({block}) => (
  <Box as={block.isCode ? 'pre' : 'div'}>{block.text}</Box>
);

const TicketMaker = ({context}) => {
  const [ values, handleChange ] = useForm(['exercise', 'block']);
  const [ queryParams ] = useQueryParams();
  const { tid } = queryParams;
  const [ ticket, setTicket ] = useState(null);

  useEffect(() => {
    const fetchTicket = async (tid) => {
      const ticket = await (!tid ? null : tid === '*' ? emptyTicket() : getTicket(tid));
      setTicket(ticket);
    };
    fetchTicket(tid);
  }, [tid]);

  const setBlocks = (blocks) => {
    setTicket({...ticket, blocks: blocks});
  };

  const updateBlock = (oldBlock, newBlock) => {
    setBlocks(ticket.blocks.map(block => (
      block === oldBlock ? {...oldBlock, ...newBlock} : oldBlock))
    );
  };

  const addBlock = (block) => setBlocks([...ticket.blocks, block]);

  const timestamp = block => (
    {...block, timestamp: Date.now() }
  );

  const saveBlock = (block, oldBlock) => {
    const newBlock = timestamp(block);
    if (oldBlock) {
      updateBlock(oldBlock, newBlock);
    } else {
      addBlock(newBlock);
    }
  };

  const submitTicket = (event) => {
    event.preventDefault();
    const id = tid && tid !== '*' ? tid : null;
    const newTicket = {...ticket, author: context.netid, timestamp: Date.now(), exercise: values.exercise };
    updateTicket(id, newTicket);
    window.scrollTo(0, 0);
  };

  const Exercise = () => (
    ticket.exercise ? (
      <FilledField block={ { label: 'Exercise', text: ticket.exercise } } />
    ) : (
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
    )
  );

  const getBlocks = () => (
    (ticket && ticket.blocks) || []
  );

  const boxes = getBlocks().map(block => (
    <FilledField key={block.timestamp} block={block} />
  ));

  return (
    !ticket ? null : (
      <React.Fragment>
        <Divider color="primary">start of problem report</Divider>
        <Exercise />
        { boxes }
        <Divider color="primary">end of problem report</Divider>
        <BlockEditor submitBlockHandler={saveBlock} />
        <Divider color="primary">
          { context.isMentor ? 'respond to problem' : 'edit problem report' }</Divider>
        <Field>
          <Control>
            <Button color="primary" onClick={submitTicket}>Send to mentors</Button>
          </Control>
        </Field>
      </React.Fragment>
    )
  )
};

export default TicketMaker;
