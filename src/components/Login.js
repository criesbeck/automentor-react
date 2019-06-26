import React from 'react';
import 'rbx/index.css';
import { Button, Column, Container, Control, Field, Input, Section } from 'rbx';
import { useForm } from "../utils/utils";

const isMentor = netid => ['ckr'].includes(netid);

const Login = ({ state }) => {
  const [context, setContext] = state;

  const [ values, handleChange,] = useForm(['netid', 'password']);

  function login(event) {
    event.preventDefault();
    const { netid } = values;
    setContext({...context, netid, isMentor: isMentor(netid) });
  }

  return (
    <Section>
      <Container>
        <Column.Group>
          <Column size={4} offset={4}>
            <form onSubmit={login}>
              <Field>
                <Control>
                  <Input type="netid" placeholder="netid" name="netid" onChange={handleChange} value={values.netid} required />
                </Control>
              </Field>
              <Field>
                <Control>
                  <Input type="password" placeholder="Password" name="password" onChange={handleChange} value={values.password} required />
                </Control>
              </Field>
              <Field>
                <Control>
                  <Button type="submit" color="primary">Submit</Button>
                </Control>
              </Field>
            </form>
          </Column>
        </Column.Group>
      </Container>
    </Section>
  );
};

export default Login;
