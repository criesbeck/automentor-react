import React from 'react';
import { useForm } from '../utils/utils';
import 'rbx/index.css';
import { Button, Checkbox, Column, Control, Field, Input, Textarea } from 'rbx';

const BlockEditor = ({context, submitBlockHandler}) => {
  const [ values, handleChange ] = useForm(['isCode', 'label', 'text']);
  const placeholder = isCode => (isCode ? 'Code or output' : 'A message');
  const fontFamily = isCode => (isCode ? 'Courier New' : 'Arial');

  const resetValues = () => {
    Object.keys(values).forEach(key => values[key] = '');
  };

  const submitBlock = (event) => {
    event.preventDefault();
    values[context.isMentor ? 'fromMentor' : 'author'] = context.netid;
    submitBlockHandler(values);
    resetValues()
  };

  return (
    <Column.Group>
      <Column size={10} offset={1}>
        <Field>
          <Control>
            <Textarea rows={5} size="small" name="text" 
              placeholder={ placeholder(values.isCode) } style={ { fontFamily: fontFamily(values.isCode) } }
              onChange={handleChange} value={values.text} required />
          </Control>
        </Field>
        <Field horizontal>
          <Field.Label as="label" htmlFor="isCode">Format as code</Field.Label>
          <Field>
            <Control>
              <Checkbox id="isCode" name="isCode" onChange={handleChange} checked={values.isCode} />
            </Control>
          </Field>
          <Field.Label>
            Helpful tag
          </Field.Label>
          <Field.Body>
            <Field>
              <Control>
                  <Input type="text" name="label" placeholder="[Optional] e.g., file name, console output, ..."
                    onChange={handleChange} value={values.label}
                  />
              </Control>
            </Field>
            <Field />
            <Field>
              <Control>
                <Button color="outlined" onClick={submitBlock}>
                  Save field
                </Button>
              </Control>
            </Field>
          </Field.Body>
        </Field>
      </Column>
    </Column.Group>
  );
};

export default BlockEditor;