import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Content, Icon, Navbar } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

const LogOut = ({signOut}) => (
  <Button inverted outlined color="primary" onClick={ signOut }>
    Log out
  </Button>
);

const Banner = ({ user, signOut }) => (
  <Navbar backgroundColor={ user.role === 'mentor' ? 'info' : 'primary' } >
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
    { 
      user &&
      <Navbar.Menu>
        <Navbar.Segment align="start">
          <Navbar.Item as="div">
            <Content size="large" textColor="white">
              Welcome { user.displayName }!
            </Content>
          </Navbar.Item>
        </Navbar.Segment>
        <Navbar.Segment align="end">
          <Navbar.Item as="span">
            <LogOut signOut={ signOut } />
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    }
  </Navbar>
);

Banner.propTypes = {
  user: PropTypes.object,
  signOut: PropTypes.func
};

export default Banner;