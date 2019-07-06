import React  from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Content } from 'rbx';

const SubmitModal = ({ isOpen, blockRef, reply, ticket }) => {
  const unsavedText = blockRef.current && blockRef.current.value;
  const message = unsavedText ? 'What do you want to do with the unsaved text?' : 'Submit data?';

  return (
    <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
      onRequestClose={ () => reply('cancel') }
      style={ {
        content: { top: '20%', left: '20%', height: '80%', width: '60%' }, 
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
      <Content as="pre">
        { JSON.stringify(ticket, null, 2) }
      </Content>
    </Modal>
  );
};

SubmitModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  blockRef: PropTypes.object.isRequired,
  reply: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired
};

export default SubmitModal;
