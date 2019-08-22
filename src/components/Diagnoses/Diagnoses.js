import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Box, Card, Container, Content } from 'rbx';
import Resources from 'components/Resources';
import { diagnose, diagnosisRegExps, instances } from './diagnose';

const collect = (lst, fn) => (
  lst.reduce((lst, x) => {
    const y = fn(x);
    return (y !== null) ? [...lst, y] : lst;
  }, [])
);

const isOnPage = (term, page) => {
  const re = new RegExp(`\\${term}\\b`, 'i');
  return re.exec(page.summary) || re.exec(page.code);
};

const isRelevantPage = (page, diagnoses) => (
  diagnoses.some(diagnosis => (
    diagnosis.blists.some(blist => (
      Object.values(blist).some(term => isOnPage(term, page))
    ))
  ))
);

const relevantResources = (resource, diagnoses) => {
  const pages = resource.pages.filter(page => isRelevantPage(page, diagnoses));
  return (pages.length === 0) ? null : { resource, pages };
  };

const filterResources = (diagnoses, kb) => (
  collect(kb.resources, resource => relevantResources(resource, diagnoses))
);

// components

const Entry = ({ title, isSource, children }) => (
  <Card>
    <Card.Header>
      <Card.Header.Title>{ title }</Card.Header.Title>
    </Card.Header>
    <Card.Content>
      <Content data-is-source={isSource}>{ children }</Content>
    </Card.Content>
  </Card>  
);

const Diagnosis = ({ diagnosis, blists, setPattern }) => {
  const rexps = diagnosisRegExps(diagnosis);
  const highlight = () => setPattern({ diagnosis, rexps });
  const unhighlight = () => setPattern(null);
  return (
    <Box onMouseEnter={ highlight } onMouseLeave={ unhighlight } size={2} style={{ padding: '5px' }}>
      {instances(diagnosis.summary, blists)}
    </Box>
  ); 
};

const Diagnoses = ({ setPattern, ticket, kb }) => {
  const results = diagnose(ticket, kb);
  const resourcePages = filterResources(results, kb);
  const diagnoses = results.map(({name, diagnosis, blists}) => (
    <Diagnosis key={name} diagnosis={diagnosis} blists={blists} setPattern={setPattern} />
  ));
  
  return (
    <>
      <Entry title="Diagnoses">{ diagnoses }</Entry>
      <Container style={{ maxHeight: '20em', overflow: 'auto' }}>
        <Resources resourcePages={resourcePages} />
      </Container>
    </>
  );
};

Diagnoses.propTypes = {
  setPattern: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  kb: PropTypes.shape({
    concepts: PropTypes.object.isRequired,
    diagnoses: PropTypes.object.isRequired,
    resources: PropTypes.array.isRequired
  })
};

export default Diagnoses;