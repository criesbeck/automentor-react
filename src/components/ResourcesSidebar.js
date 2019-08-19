import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from "react-sidebar";
import Resources from 'components/Resources';

const SidebarContent = ({ close, resources }) => (
  <React.Fragment>
    <button onClick={ close }>Close</button>
    <Resources resources={ resources } /> 
  </React.Fragment>
)

const ResourcesSidebar = ({ isOpen, close, resources, children }) => (
  <Sidebar
    sidebar={ <SidebarContent resources={resources} close={close} /> }
    open={ isOpen }
    pullRight
    styles={{ root: { left: '50%' } }}
  >
    { children }
  </Sidebar>
);

ResourcesSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  resources: PropTypes.array.isRequired,
};

export default ResourcesSidebar;
