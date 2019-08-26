import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'rbx/index.css';
import { Button, Divider, Level, Column } from 'rbx';
import Diagnoses from 'components/Diagnoses';
import ResponseEditor from 'components/ResponseEditor';
import TicketData from 'components/TicketData';
import { updateTicket } from 'utils/tickets';
import { useFirebaseRef } from 'hooks/useFirebase';
import KB from 'utils/kb';
import concepts from 'data/concepts.json';
import diagnoses from 'data/diagnoses.json';
import resources from 'data/cs111-index.json';
import KBrowserModal from 'components/KBrowserModal';

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

const TicketUpdater = ({user, offering, course, setTicketState, ticketState }) => {
  const { id, ticket } = ticketState;
  const [ block, setBlock ] = useState(null);
  const ticketRef = useFirebaseRef(`offerings/${offering}/tickets`);
  const kb = KB({ concepts, diagnoses, resources });
  const exercises = course.exercises;
  const [modalOpen, setModalOpen] = useState(false);

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
      updateTicket(ticketRef(), id, ticket);
    };

  const ifMentor = (x, y = null) => user.role === 'mentor' ? x : y;

  return (
    <Column.Group>
      <Column size={ ifMentor(8, 10) }>
        <TicketData ticket={ ticket } selectBlock={ selectBlock }  highlighter={ highlighter } />
        {
          user.role === 'mentor' && ticket.url
          ? <SampleSource url={ticket.url} /> 
          : null
        }
        <ResponseEditor labels={ labels } block={ block } exercises={ exercises } ticket={ ticket }
          setTicketState= { setTicketState }
          ticketSubmitHandler={ ticketSubmitHandler } user={ user } />
      </Column>
      {
        ifMentor(
          <Column size={4}>
            <Divider color="primary">diagnoses</Divider>
            <Diagnoses course={course} ticket={ticket} kb={kb} setPattern={setPattern} />
            <Level>
              <Level.Item>
                <Button onClick={() => setModalOpen(true)}>[KB]</Button>
              </Level.Item>
            </Level>

            <KBrowserModal isOpen={modalOpen} close={() => setModalOpen(false)} kb={kb} />
          </Column>
        )
      }
    </Column.Group>
  )
};

TicketUpdater.propTypes = {
  user: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  ticketState: PropTypes.object.isRequired,
  setTicketState: PropTypes.func.isRequired
};

SampleSource.propTypes = {
  url: PropTypes.string.isRequired
};

export default TicketUpdater;
