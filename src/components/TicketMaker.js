import React, { useEffect, useState } from 'react';
import { useQueryParams } from 'hookrouter';
import useForm from '../utils/useForm';
import { emptyTicket, getTicket, updateTicket } from '../utils/tickets';
import BlockEditor from './BlockEditor';
import 'rbx/index.css';
import { Box, Button, Column, Content, Control, Divider, Field, Select } from 'rbx';

const authorStyle = isMentor => (
  isMentor ?  { backgroundColor: 'honeydew'} : { backgroundColor: 'lightyellow'}
);

const exercises = {
  'ex-1': { name: 'Exercise 1' },
  'ex-2': { name: 'Exercise 2' },
  'ex-3': { name: 'Exercise 3' }
};

const FilledField = ({block, mentor}) => (
  <Column size={10} offset={mentor ? 0 : 2}>
    <Box as={block.isCode ? 'pre' : 'div'} style={authorStyle(mentor)}>
      {mentor ? <Content as="span">{mentor}:</Content> : null} {block.text}
    </Box>
  </Column>
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
      console.log(ticket)
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

  const updatedTicket = () => {
    ticket.author = ticket.author || context.netid;
    ticket.exercise = values.exercise || ticket.exercise || 'ex-1';
    ticket.timestamp = Date.now();
    return ticket;
  }

  const blockIsUnsaved = () => (
    document.querySelector('textarea[name=text]').value
  );

  const submitTicket = (event) => {
    event.preventDefault();
    if (blockIsUnsaved()) {
      alert('Please save or clear current field first');
      return;
    };
    const id = tid && tid !== '*' ? tid : null;
    updateTicket(id, updatedTicket());
    window.scrollTo(0, 0);
  };

  const Exercise = () => (
    <Column size={10} offset={2}>
      <Field>
        <Control>
          <Select.Container>
            <Select name="exercise" onChange={handleChange} value={values.exercise}>
              {
                Object.entries(exercises).map(([id, ex]) => (
                  <Select.Option key={id} value={id}>{ex.name}</Select.Option>
                ))
              }
            </Select>
          </Select.Container>
        </Control>
      </Field>
    </Column>
  );

  const getBlocks = () => (
    (ticket && ticket.blocks) || []
  );

  const boxes = getBlocks().map(block => (
    <FilledField key={block.timestamp} block={block} mentor={block.fromMentor} />
  ));

  // reset exercise to previous setting, if any
  values.exercise = ticket && ticket.exercise;

  return (
    !ticket ? null : (
      <React.Fragment>
        <Divider color="primary">start of problem report</Divider>
        <Exercise />
        { boxes }
        <Divider color="primary">end of problem report</Divider>
        <BlockEditor submitBlockHandler={saveBlock} context={context} />
        <Divider color="primary">
          { context.isMentor ? 'respond to problem' : 'edit problem report' }</Divider>
        <Field>
          <Control>
            <Button color="primary" onClick={submitTicket}>
              { context.isMentor ? 'Send to student' : 'Send to mentors' }
            </Button>
          </Control>
        </Field>
      </React.Fragment>
    )
  )
};

export default TicketMaker;
