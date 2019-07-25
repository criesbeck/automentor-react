import React, { createRef, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Content, Message, Heading } from 'rbx';

const DefineItem = ({ active, reply, define }) => {
  const ref = createRef();

  useEffect(() => {
    if (active) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  return (
    <Button ref={ ref } color={ active ? 'success' : null }
      onClick={() => reply()}>
      {define}
    </Button>
  );
};

const ExerciseItem = ({ isActive, reply, id, exercise }) => (
  <Message color="light">
    <Message.Header>{exercise.title}</Message.Header>
    <Message.Body>
      <Button.Group>
      { 
        exercise.defines.map(define => (
          <DefineItem key={ define } define={ define }
            active={ isActive(id, define) } reply={ () => reply(id, define ) }
          />
        ))
      }
      </Button.Group>
    </Message.Body>
  </Message>
);

const ExerciseModal = ({ isOpen, reply, exercise, exercises }) => {

  const title = exercises[exercise.id].title;

  const isActive = (id, define) => (
    exercise && exercise.define === define && exercise.id === id
  );

  return (
    <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
      onRequestClose={ () => reply() }
      style={ {
        content: { top: '20%', left: '10%', height: '60%', width: '80%' }, 
        overlay: { zIndex: 10 } 
      } }>
      <Content>
        <Heading>Current thread topic: { title }: { exercise.define }</Heading>
        <Button.Group>
          <Button onClick={ ( ) => reply() }>Cancel</Button>
        </Button.Group>
      </Content>
      <Button.Group style={{ height: '80%', overflow: 'scroll' }}>
        { 
          Object.entries(exercises).map(([id, exercise]) => (
            <ExerciseItem key={ id } id={ id } exercise={ exercise } 
              isActive={ isActive } reply={ reply } />
          )) 
        }
      </Button.Group>
    </Modal>
  );
};

DefineItem.propTypes = {
  active: PropTypes.bool.isRequired,
  define: PropTypes.string.isRequired,
  reply: PropTypes.func.isRequired
};

ExerciseItem.propTypes = {
  isActive: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  exercise: PropTypes.object.isRequired
};

ExerciseModal.propTypes = {
  isOpen: PropTypes.any.isRequired,
  exercise: PropTypes.object.isRequired,
  exercises: PropTypes.object.isRequired,
  reply: PropTypes.func.isRequired
};

export default ExerciseModal;
