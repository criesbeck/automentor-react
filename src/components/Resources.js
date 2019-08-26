import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Card, Column } from 'rbx';

const Resource = ({ course, resource: { file }, pages }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{file}</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <ul>
        { 
          pages.map(({ summary, page }) => (
            <li key={ summary }>
              <a href={`courses/${course.name}/documents/${file}.pdf#page=${page}`}
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

const Resources = ({ course, resourcePages }) => (
  <Column>
  { 
    resourcePages.map(({resource, pages}) => (
      <Resource key={ resource.file } course={ course } resource={ resource } pages={ pages } />
    ))
  }
  </Column>
);

Resource.propTypes = {
  course: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
};

Resources.propTypes = {
  course: PropTypes.object.isRequired,
  resourcePages: PropTypes.array.isRequired,
};

export default Resources;