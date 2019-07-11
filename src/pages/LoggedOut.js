import React from 'react';
import 'rbx/index.css';
import { Notification } from 'rbx';
import Banner from 'components/Banner';

const LoggedOut = () => (
  <>
    <Banner />
    <Notification>
      You are logged out. Return to Code Clinic via Canvas.
    </Notification>
  </>
);

export default LoggedOut;
