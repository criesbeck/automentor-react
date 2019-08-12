import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Card, Container, Tile } from 'rbx';

const batchUp = (lst, n) => (
  lst.reduce((batches, x) => {
    const lastBatch = batches[batches.length -1];
    if (lastBatch.length < n) {
      lastBatch.push(x);
    } else {
      batches.push([x]);
    }
    return batches;
  }, [[]])
);

const Resource = ({ resource: { file, items } }) => (
  <Tile kind="parent">
    <Tile as={Card} kind="child">
      <Card.Header>
        <Card.Header.Title>{file}</Card.Header.Title>
      </Card.Header>
      <Card.Content>
        <ul>
          { 
            items.map(({ summary, page }) => (
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
    </Tile>
  </Tile>
);

const ResourceRow = ({ resources }) => (
  <Tile kind="ancestor">
    { resources.map(resource => <Resource key={ resource.file } resource={ resource } />) }
  </Tile>
);

const Resources = ({ resources }) => (
  <Container>
    { batchUp(resources, 4).map((batch, i) => <ResourceRow key={ i } resources={ batch } />)}
  </Container>
);

Resource.propTypes = {
  resource: PropTypes.object.isRequired,
};

ResourceRow.propTypes = {
  resources: PropTypes.array.isRequired,
};

Resources.propTypes = {
  resources: PropTypes.array.isRequired,
};

export default Resources;