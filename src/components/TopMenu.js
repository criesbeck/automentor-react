import React from 'react';
import 'rbx/index.css';
import { Button, Content, Icon, Navbar } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

const LogOut = ({signOut}) => (
  <Button inverted outlined color="primary" onClick={ signOut }>
    Log out
  </Button>
);

const TopMenu = ({ userState }) => (
  <Navbar backgroundColor="primary">
    <Navbar.Brand >
      <Navbar.Item>
        <Content size="large" textColor="white">
          <Icon><FontAwesomeIcon icon={ faStethoscope } /></Icon>
        </Content>
      </Navbar.Item>
      <Navbar.Item>
        <Content size="large" textColor="white">
          Code Clinic
        </Content>
      </Navbar.Item>
    </Navbar.Brand>
    <Navbar.Menu>
      <Navbar.Segment align="start">
        <Navbar.Item as="div">
          <Content size="large" textColor="white">
            Welcome { userState.user.displayName }!
          </Content>
        </Navbar.Item>
      </Navbar.Segment>
      <Navbar.Segment align="end">
        <Navbar.Item as="span">
          <LogOut signOut={ userState.signOut } />
        </Navbar.Item>
      </Navbar.Segment>
    </Navbar.Menu>
  </Navbar>
);

export default TopMenu;