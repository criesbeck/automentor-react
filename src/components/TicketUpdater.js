import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Divider, Level, Column } from 'rbx';
import Diagnoses from 'components/Diagnoses';
import ResponseEditor from 'components/ResponseEditor';
import TicketData from 'components/TicketData';
import { updateTicket } from 'utils/tickets';
import KB from 'utils/kb';
import concepts from 'data/concepts.json';
import diagnoses from 'data/diagnoses.json';

const SampleSource = ({ url }) => (
  url
  ? <Level>
      <Level.Item align="right">
        <a href={ url } target="_blank" rel="noopener noreferrer">
          <em>Piazza source</em>
        </a> 
      </Level.Item>
    </Level>
  : null
);

const TicketUpdater = ({user, course, setTicketState, ticketState }) => {
  const { id, ticket } = ticketState;
  const [ block, setBlock ] = useState(null);
  const kb = ({ concepts, diagnoses });
  const exNames = kb.search(['exercise'], { course });
  const exercises = kb.toObject(exNames, ['name']);

   // for highlighting matches
   const [ pattern, setPattern ] = useState(null);

  const highlightMatches = (text, rexps) =>  {
    const reducer = (html, rexp) => html.replace(rexp, '<span class="matched">$&</span>');
    return rexps.reduce(reducer, text);
  };
 
  const highlighter =  pattern ? text => highlightMatches(text, pattern.rexps) : null;
   
  const labels = { 
    divider: 'Update problem report', 
    submit: user.role === 'mentor' ? 'Send to student' : 'Send to mentors' 
  };
 
  const selectBlock = user.role === 'mentor' ? null : (block) => setBlock(block);

  const ticketSubmitHandler = () => {
      updateTicket(id, ticket);
    };

  const ifMentor = (x, y = null) => user.role === 'mentor' ? x : y;

  return (
    <Column.Group>
      <Column size={ ifMentor(8, 10) }>
        <TicketData ticket={ ticket } selectBlock={ selectBlock }  highlighter={ highlighter } />
        <ResponseEditor labels={ labels } block={ block } exercises={ exercises } ticket={ ticket }
          setTicketState= { setTicketState }
          ticketSubmitHandler={ ticketSubmitHandler } user={ user } />
      </Column>
      {
        ifMentor(
          <Column size={4}>
            <React.Fragment>
              <Divider color="primary">diagnoses</Divider>
              <Diagnoses ticket={ticket} kb={kb} setPattern={setPattern} />
              {ticket.url ? <SampleSource url={ticket.url} /> : null}
            </React.Fragment>
          </Column>
        )
      }
    </Column.Group>
  )
};

TicketUpdater.propTypes = {
  user: PropTypes.object.isRequired,
  course: PropTypes.string.isRequired,
  ticketState: PropTypes.object.isRequired,
  setTicketState: PropTypes.func.isRequired
};

SampleSource.propTypes = {
  url: PropTypes.string.isRequired
};

export default TicketUpdater;
