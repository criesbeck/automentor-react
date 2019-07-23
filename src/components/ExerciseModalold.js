import React, { createRef, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Menu } from 'rbx';

const DefineItem = ({ active, reply, define }) => {
  const ref = createRef();

  useEffect(() => {
    if (active) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  return (
    <Menu.List.Item key={define} ref={ ref } active={ active }
      style={{ padding: '0.1em' }}
      onClick={() => reply()}>
      {define}
    </Menu.List.Item>
  );
};

const ExerciseItem = ({ isActive, reply, id, exercise }) => (
  <>
    <Menu.Label>{exercise.title}</Menu.Label>
    <Menu.List>
      { 
        exercise.defines.map(define => (
          <DefineItem key={ define } define={ define }
            active={ isActive(id, define) } reply={ () => reply(id, define ) }
          />
        ))
      }
    </Menu.List>
  </>
);

const ExerciseModal = ({ isOpen, reply, exercise, exercises }) => {

  const isActive = (id, define) => (
    exercise && exercise.define === define && exercise.id === id
  );

  const exerciseRefs = exercise => (
    exercise.defines.reduce((refs, define) => ({
      ...refs, [define]: createRef()
    }), {})
  );

  const refs = Object.entries(exercises).reduce((refs, [id, exercise]) => ({
    ...refs, [id]: exerciseRefs(exercise)
    }), {}
  );

  useEffect(() => {
    const ref = refs[exercise.id][exercise.define];
    if (ref && ref.current) {
      ref.current.scrollIntoView()
    }
  }, [refs, exercise]);

  return (
    <Modal appElement={document.getElementById('root')} isOpen={ isOpen }
      onRequestClose={ () => reply() }
      style={ {
        content: { top: '20%', left: '20%', height: '30%', width: '60%' }, 
        overlay: { zIndex: 10 } 
      } }>
      <Menu style={{ height: '20em', overflow: 'scroll' }}>
        { Object.entries(exercises).map(([id, exercise]) => (
          <ExerciseItem key={ id } id={ id } exercise={ exercise } 
            isActive={ isActive } reply={ reply } refs={ refs } />
        )) }
      </Menu>
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
