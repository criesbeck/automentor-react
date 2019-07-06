import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Content, Control, Divider, Field } from 'rbx';
import BlockEditor from './BlockEditor';
import Exercise from 'components/Exercise';
import { addTimestamp } from 'utils/tickets';

const SubmitModal = ({ isOpen, blockRef, reply }) => {
  const unsavedText = blockRef.current && blockRef.current.value;
  const message = unsavedText ? 'What do you want to do with the unsaved text?' : 'Submit data?';

  return (
    <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
      onRequestClose={ () => reply('cancel') }
      style={ {
        content: { top: '20%', left: '20%', height: '40%', width: '60%' }, 
        overlay: { zIndex: 10 } 
      } }>
      <Content>{ message }</Content>
      <Button.Group>
        <Button onClick={ () => reply('cancel') }>Cancel</Button>
        {
          unsavedText
          ? <>
              <Button onClick={ () => reply('save') }>Save and send</Button>
              <Button onClick={ () => reply('clear') }>Erase and send</Button>
            </>
          : <Button onClick={ () => reply('clear') }>Send</Button>
        }
      </Button.Group>
    </Modal>
  );
};

const ResponseEditor = ({ block, labels, exercises, ticket, ticketSubmitHandler, user }) => {
  const [newTicket, setNewTicket] = useState(ticket);
  const [modalOpen, setModalOpen] = useState( false );
  const blockRef = useRef(null);

  const setBlocks = (blocks) => {
    setNewTicket({...newTicket, blocks});
    block = null;
  };

  const setExercise = exercise => {
    setNewTicket({...newTicket, exercise});
  }

  const addBlock = (block) => setBlocks([...ticket.blocks, block]);

  const addAuthor = block => (
    { ...block, [user.role === 'mentor' ? 'fromMentor' : 'author']: user.uid }
  );
  
  const saveBlock = (block) => {
    addBlock(addTimestamp(addAuthor(block)));
  };

  // SubmitModal
  // broken -- needs other block data to save
  const reply = choice => {
    setModalOpen(false);
    switch (choice) {
      case 'cancel': return;
      case 'clear': break;
      case 'save': saveBlock( { text: blockRef.current.value } ); break;
      default: throw new Error(`Unknown response: ${choice}`)
    };
    ticketSubmitHandler(newTicket);;
  };

  /*
  const submitTicket = (event) => {
    event.preventDefault();
    console.log(blockRef.current.value)
    setModalOpen(true)
    if (blockRef.current.value) {
      return;
    };
    console.log(newTicket)
    if (window.confirm('save?')) {
      ticketSubmitHandler(newTicket);
      window.scrollTo(0, 0);
    }
  };
*/

  console.log(newTicket)

  return (
    <>
      <Divider color="primary">{ labels.divider }</Divider>
      <Exercise exercise={ newTicket.exercise } exercises={ exercises } setExercise={ setExercise } />
      <BlockEditor ref={ blockRef } submitBlockHandler={ saveBlock } user={ user } block={ block }/>
      <Field>
        <Control>
          <Button color="primary" onClick={ () => setModalOpen(true) }>
            { labels.submit }
          </Button>
        </Control>
      </Field>
      <SubmitModal isOpen={ modalOpen } blockRef={ blockRef  } reply= { reply }/>
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
