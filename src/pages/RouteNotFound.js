import React from 'react';
import 'rbx/index.css';
import { Notification } from 'rbx';
import { usePath } from 'hookrouter';
import Banner from 'components/Banner';

const RouteNotFound = () => (
  <>
    <Banner />
    <Notification>
      Internal error. { usePath() } is an unknown page.
    </Notification>
  </>
);

export default RouteNotFound;
