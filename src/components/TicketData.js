import React from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Box, Column, Divider } from 'rbx';

const MentorField = ({block}) => (
  <Column size={10} offset={0}>
    <Box as={block.isCode ? 'pre' : 'div'} style={{ backgroundColor: 'honeydew'}}>
      { block.text }
    </Box>
  </Column>
);

const StudentField = ({ block, selectBlock, highlighter }) => (
  <Column size={10} offset={2}>
    <Box as={ block.isCode ? 'pre' : 'div' } style={ { backgroundColor: 'lightyellow' } } 
      data-student-text={ true } onClick={ () => selectBlock(block) } >
      {
        highlighter
        ? <span dangerouslySetInnerHTML={ {__html: highlighter(block.text)} } /> 
        : block.text
      }
    </Box>
  </Column>
);

const FilledField = ({author, block, selectBlock, highlighter }) => (
  block.fromMentor
  ? <MentorField block={ block } />
  : <StudentField block={ block } selectBlock={ selectBlock } highlighter={ highlighter }/>
);

const TicketData = ({ ticket, selectBlock, highlighter  }) => {
  const boxes = (ticket.blocks || []).map(block => (
    <FilledField key={ block.timestamp } author={ ticket.author } block={ block }
      selectBlock={ selectBlock } highlighter={ highlighter } />
  ));

  return (
    boxes.length > 0
    ?  <React.Fragment>
        <Divider color="primary" id="ticket-editor">Problem report</Divider>
        { boxes }
      </React.Fragment>
    : null
  )
};

StudentField.propTypes = {
  block: PropTypes.object.isRequired,
  selectBlock: PropTypes.func,
  highlighter: PropTypes.func
};

MentorField.propTypes = {
  block: PropTypes.object.isRequired,
};

FilledField.propTypes = {
  author: PropTypes.string.isRequired,
  block: PropTypes.object.isRequired,
  selectBlock: PropTypes.func,
  highlighter: PropTypes.func
};

TicketData.propTypes = {
  ticket: PropTypes.object.isRequired,
  selectBlock: PropTypes.func,
  highlighter: PropTypes.func
};

export default TicketData;
