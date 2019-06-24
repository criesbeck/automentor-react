import React from 'react';
import useForm from '../utils/useForm';
import 'rbx/index.css';
import { Button, Checkbox, Column, Control, Field, Input, Label, Textarea } from 'rbx';

const BlockEditor = ({submitBlockHandler}) => {
  const [ values, handleChange ] = useForm(['isCode', 'source', 'text']);
  const placeholder = isCode => (isCode ? 'Code or output' : 'A message');
  const fontFamily = isCode => (isCode ? 'Courier New' : 'Arial');

  return (
    <Column.Group>
      <Column size={12}>
        <Field>
          <Control>
            <Label>
              Source
              <Input type="text" name="source" placeholder="[Optional] E.g., source code file, console output, ..."
                onChange={handleChange} value={values.source} />
            </Label>
          </Control>
        </Field>
        <Label>
          <Checkbox name="isCode" onChange={handleChange} checked={values.isCode} /> This is code or code output
        </Label>
        <Field>
          <Control>
            <Textarea rows={5} size="small" name="text" 
              placeholder={ placeholder(values.isCode) } style={ { fontFamily: fontFamily(values.isCode) } }
              onChange={handleChange} value={values.text} required />
          </Control>
        </Field>
        <Field>
          <Control>
            <Button color="outlined" onClick={(event) => submitBlockHandler(values, event)}>
              Save field
            </Button>
          </Control>
        </Field>
      </Column>
    </Column.Group>
  );
};

export default BlockEditor;