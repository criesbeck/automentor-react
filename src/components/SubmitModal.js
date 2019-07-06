import React  from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Content } from 'rbx';

const SubmitModal = ({ isOpen, blockRef, reply, ticket }) => {
  const unsavedText = blockRef.current && blockRef.current.value;
  const message = unsavedText ? `Send, ignoring unsaved text "${unsavedText.slice(0, 20)} ..."?` : 'Are you sure?';
  const sendLabel = unsavedText ? 'Send anyway' : 'Send';

  return (
    <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
      onRequestClose={ () => reply('cancel') }
      style={ {
        content: { top: '20%', left: '20%', height: '30%', width: '60%' }, 
        overlay: { zIndex: 10 } 
      } }>
      <Content>{ message }</Content>
      <Button.Group>
        <Button onClick={ () => reply('cancel') }>Cancel</Button>
        <Button onClick={ () => reply('send') }>{ sendLabel }</Button>
      </Button.Group>
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
