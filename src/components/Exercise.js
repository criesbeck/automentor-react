import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Column, Control, Field, Select } from 'rbx';

const Exercise = ({ exercise, exercises, setExercise }) => {
  
  const changeHandler = (event) => {
    const id = event.target.value;
    if (id) {
      setExercise(id);
    }
  };

  return (
    <Column offset={2}>
      <Field>
        <Control>
          <Select.Container>
            <Select name="exercise" onChange={changeHandler} value={exercise}>
              <Select.Option value=''>Select an exercise...</Select.Option>
              {
                Object.entries(exercises).map(([id, exercise]) => 
                  <Select.Option key={id} value={id}>{exercise.name}</Select.Option>
                )
              }
            </Select>
          </Select.Container>
        </Control>
      </Field>
    </Column>
  );
};


Exercise.propTypes = {
  exercise: PropTypes.string,
  exercises: PropTypes.object.isRequired,
  setExercise: PropTypes.func.isRequired
};

export default Exercise;