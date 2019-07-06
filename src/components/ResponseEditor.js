import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Control, Divider, Field } from 'rbx';
import BlockEditor from './BlockEditor';
import Exercise from 'components/Exercise';
import { addTimestamp } from 'utils/tickets';

const ResponseEditor = ({ block, labels, exercises, ticket, ticketSubmitHandler, user }) => {
  const [newTicket, setNewTicket] = useState(ticket);
  const blockRef = useRef(null);

  const setBlocks = (blocks) => {
    setNewTicket({...newTicket, blocks});
    block = null;
  };

  const setExercise = exercise => {
    setNewTicket({...newTicket, exercise});
  }

  const updateBlock = (oldBlock, newBlock) => {
    setBlocks(newTicket.blocks.map(block => (
      block === oldBlock ? newBlock : oldBlock))
    );
  };

  const addBlock = (block) => setBlocks([...ticket.blocks, block]);

  const wasSubmitted = block => (
    ticket.timestamp && block.timestamp <= ticket.timestamp
  )
  // if block not submitted, replace
  // otherwise an updated block added to thread
  const saveBlock = (block, oldBlock) => {
    const newBlock = addTimestamp(block);
    if (oldBlock && !wasSubmitted(oldBlock)) {
      updateBlock(oldBlock, newBlock);
    } else {
      addBlock(newBlock);
    }
  };

  const submitTicket = (event) => {
    event.preventDefault();
    console.log(blockRef.current)
    if (blockRef.current.value) {
      alert('Please save or clear current field first');      
      return;
    };
    console.log(newTicket)
    if (window.confirm('save?')) {
      ticketSubmitHandler(newTicket);
      window.scrollTo(0, 0);
    }
  };

  console.log(newTicket)

  return (
    <React.Fragment>
      <Divider color="primary">{ labels.divider }</Divider>
        <Exercise exercise={ newTicket.exercise } exercises={ exercises } setExercise={ setExercise } />
        <BlockEditor ref={ blockRef } submitBlockHandler={ saveBlock } user={ user } block={ block }/>
        <Field>
          <Control>
            <Button color="primary" onClick={submitTicket}>
              { labels.submit }
            </Button>
          </Control>
        </Field>
    </React.Fragment>
  );
  }

ResponseEditor.propTypes = {
  block: PropTypes.object,
  labels: PropTypes.objectOf( PropTypes.string ).isRequired,
  exercises: PropTypes.object.isRequired,
  ticket: PropTypes.object.isRequired,
  ticketSubmitHandler: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default ResponseEditor;
