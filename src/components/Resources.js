import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Card, Column } from 'rbx';

const Resource = ({ resource: { file }, pages }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{file}</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <ul>
        { 
          pages.map(({ summary, page }) => (
            <li key={ summary }>
              <a href={`courses/cs111/documents/${file}.pdf#page=${page}`}
                target="_blank" rel="noopener noreferrer">
                { summary }
              </a>
            </li>
          ))
        }
      </ul>
    </Card.Content>
  </Card>
);

const Resources = ({ resourcePages }) => (
  <Column>
  { 
    resourcePages.map(({resource, pages}) => (
      <Resource key={ resource.file } resource={ resource } pages={ pages } />
    ))
  }
  </Column>
);

Resource.propTypes = {
  resource: PropTypes.object.isRequired,
};

Resources.propTypes = {
  resourcePages: PropTypes.array.isRequired,
};

export default Resources;