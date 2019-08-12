import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import 'rbx/index.css';
import { Button, Content, Heading } from 'rbx';
import Resources from 'components/Resources';

const ResourcesModal = ({ isOpen, close, resources }) => (
  <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
    onRequestClose={ close }
    style={{
      content: { top: '20%', left: '10%', height: '60%', width: '80%' }, 
      overlay: { zIndex: 10 } 
    }}>
    <Content>
      <Heading>Available Resources</Heading>
      <Button.Group>
        <Button onClick={ close }>Cancel</Button>
      </Button.Group>
      <Resources resources={ resources} />
    </Content>
  </Modal>
);

ResourcesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  resources: PropTypes.array.isRequired,
};

export default ResourcesModal;
