import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Column, Content, Icon } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ExerciseModal from 'components/ExerciseModal';

const Exercise = ({ exercise, exercises, setExercise }) => {
  const [modalOpen, setModalOpen] = useState( false );
  const title = exercises[exercise.id].title;
  
  const reply = (id, define) => {
    setModalOpen(false);
    if (id && define) {
      setExercise({ id, define });
    }
  };

  return (
    <Column offset={2}>
      <Content>
        {title}: {exercise.define}
        <Icon onClick={ () => setModalOpen(true) }>
          <FontAwesomeIcon icon={ faEdit } />
        </Icon>
      </Content>
      <ExerciseModal isOpen={ modalOpen } reply={ reply } 
         exercise={ exercise } exercises={ exercises }
      />
    </Column>
  )
};

Exercise.propTypes = {
  exercise: PropTypes.object.isRequired,
  exercises: PropTypes.object.isRequired,
  setExercise: PropTypes.func.isRequired
};

export default Exercise;