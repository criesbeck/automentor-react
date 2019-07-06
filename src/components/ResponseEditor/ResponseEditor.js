import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Control, Divider, Field } from 'rbx';
import BlockEditor from 'components/BlockEditor';
import Exercise from 'components/Exercise';
import SubmitModal from 'components/SubmitModal';
import { addTimestamp } from 'utils/tickets';

const ResponseEditor = ({ block, labels, exercises, ticket, setTicketState, ticketSubmitHandler, user }) => {
  const [modalOpen, setModalOpen] = useState( false );
  const blockRef = useRef(null);

  // ticketstate x { key: value ... }= new ticketstate
  const updateTicketState = ({ id, ticket }, update) => (
    { id, ticket: {...ticket, ...update} }
  );

  const setBlocks = blocks => {
    setTicketState(ticketState => updateTicketState(ticketState, { blocks }));
    block = null;
  };

  const setExercise = exercise => {
    setTicketState(ticketState => updateTicketState(ticketState, { exercise }));
  }

  const addBlock = (block) => setBlocks([...ticket.blocks, block]);

  const addAuthor = block => (
    { ...block, [user.role === 'mentor' ? 'fromMentor' : 'author']: user.uid }
  );
  
  const saveBlock = (block) => {
    addBlock(addTimestamp(addAuthor(block)));
  };

  // SubmitModal responses
  const reply = choice => {
    setModalOpen(false);
    switch (choice) {
      case 'cancel': return;
      case 'send': ticketSubmitHandler(ticket); return;
      default: throw new Error(`Unknown response: ${choice}`)
    };
  };

  return (
    <>
      <Divider color="primary">{ labels.divider }</Divider>
      <Exercise exercise={ ticket.exercise } exercises={ exercises } setExercise={ setExercise } />
      <BlockEditor ref={ blockRef } submitBlockHandler={ saveBlock } user={ user } block={ block }/>
      <Field>
        <Control>
          <Button color="primary" onClick={ () => setModalOpen(true) }>
            { labels.submit }
          </Button>
        </Control>
      </Field>
      <SubmitModal isOpen={ modalOpen } blockRef={ blockRef  } reply= { reply } ticket={ ticket }/>
    </>
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
