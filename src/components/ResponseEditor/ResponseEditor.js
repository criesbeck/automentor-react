import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Checkbox, Control, Label, Divider, Field } from 'rbx';
import BlockEditor from 'components/BlockEditor';
import Exercise from 'components/Exercise';
import SubmitModal from 'components/SubmitModal';
import { addTimestamp } from 'utils/tickets';

const ResponseEditor = ({ block, labels, exercises, ticket, setTicketState, ticketSubmitHandler, user }) => {
  const [modalOpen, setModalOpen] = useState( false );
  const blockRef = useRef(null);

  const addBlock = block => {
    setTicketState(({ id, ticket }) => (
      { id,
        ticket: { ...ticket, blocks: [...ticket.blocks, block] }
      }
    ));
  };

  const setExercise = exercise => {
    setTicketState(({ id, ticket }) => (
      { id,
        ticket: { ...ticket, exercise }
      }
    ));
  };

  const addAuthor = block => (
    { ...block, [user.role === 'mentor' ? 'fromMentor' : 'author']: user.uid }
  );
  
  const saveBlock = (block) => {
    addBlock(addTimestamp(addAuthor(block)));
  };
  
  const toggleTicket = () => {
    setTicketState(({ id, ticket }) => (
      { id,
        ticket: { ...ticket, isClosed: !ticket.isClosed }
      }
    ));
  }

  // SubmitModal responses
  const reply = choice => {
    setModalOpen(false);
    switch (choice) {
      case 'cancel': return;
      case 'send': ticketSubmitHandler(); return;
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
      <Field>
        <Label>
          <Checkbox checked={ticket.isClosed ? 'checked' : null}
            onChange={ () => toggleTicket() }
          />
          Close ticket
        </Label>
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
