import React, { useEffect, useState } from 'react';
import { useQueryParams } from 'hookrouter';
import 'rbx/index.css';
import { Box, Button, Column, Content, Control, Divider, Field, Select } from 'rbx';
import { emptyTicket, getTicket, updateTicket } from '../utils/tickets';
import { fetchJson, useForm } from '../utils/utils';
import KB from '../utils/kb';

import BlockEditor from './BlockEditor';
import Diagnoses from './Diagnoses';

const highlightMatches = (text, rexps) =>  {
  const reducer = (html, rexp) => html.replace(rexp, '<span class="matched">$&</span>');
  return rexps.reduce(reducer, text);
};

const MentorField = ({block, mentor}) => (
  <Column size={10} offset={0}>
    <Box as={block.isCode ? 'pre' : 'div'} style={{ backgroundColor: 'honeydew'}}>
      <Content as="span">{mentor}:</Content>
      { block.text }
    </Box>
  </Column>
);

const StudentField = ({block, pattern}) => (
  <Column size={10} offset={2}>
    <Box as={block.isCode ? 'pre' : 'div'} style={{ backgroundColor: 'lightyellow'}} data-student-text={true}>
      {pattern.rexps
        ? <span dangerouslySetInnerHTML={ {__html: highlightMatches(block.text, pattern.rexps)} } /> 
        : block.text}
    </Box>
  </Column>
);

const FilledField = ({block, mentor, pattern}) => (
  mentor 
  ? <MentorField block={block} mentor={mentor} /> 
  : <StudentField block={block} pattern={pattern} />
);

const TicketMaker = ({context}) => {
  const [ values, handleChange ] = useForm(['exercise', 'block']);
  const [ queryParams ] = useQueryParams();
  const { tid } = queryParams;
  const [ ticket, setTicket ] = useState(null);
  // for highlighting matches
  const [ pattern, setPattern ] = useState({});

  useEffect(() => {
    const fetchTicket = async (tid) => {
      const ticket = await (!tid ? null : tid === '*' ? emptyTicket() : getTicket(tid));
      setTicket(ticket);
      console.log(ticket)
    };
    fetchTicket(tid);
  }, [tid]);

  const [kb, setKb] = useState(new KB({}));
  const exercises = kb.search(['exercise'], { course: 'cs111' });

  useEffect(() => {
    const fetchKb = async () => {
      const [diagnoses, concepts] = await Promise.all([
        fetchJson('./data/diagnoses.json'),
        fetchJson('./data/concepts.json')
      ]);
      setKb(new KB({ diagnoses, concepts }));
    };
    fetchKb();
  }, []);

  const setBlocks = (blocks) => {
    setTicket({...ticket, blocks: blocks});
  };

  const updateBlock = (oldBlock, newBlock) => {
    setBlocks(ticket.blocks.map(block => (
      block === oldBlock ? {...oldBlock, ...newBlock} : oldBlock))
    );
  };

  const addBlock = (block) => setBlocks([...ticket.blocks, block]);

  const timestamp = block => (
    {...block, timestamp: Date.now() }
  );

  const saveBlock = (block, oldBlock) => {
    const newBlock = timestamp(block);
    if (oldBlock) {
      updateBlock(oldBlock, newBlock);
    } else {
      addBlock(newBlock);
    }
  };

  const updatedTicket = () => {
    ticket.author = ticket.author || context.netid;
    ticket.exercise = values.exercise || ticket.exercise || 'ex-1';
    ticket.timestamp = Date.now();
    return ticket;
  }

  const blockIsUnsaved = () => (
    document.querySelector('textarea[name=text]').value
  );

  const submitTicket = (event) => {
    event.preventDefault();
    if (blockIsUnsaved()) {
      alert('Please save or clear current field first');
      return;
    };
    const id = tid && tid !== '*' ? tid : null;
    updateTicket(id, updatedTicket());
    window.scrollTo(0, 0);
  };

  const Exercise = () => (
    <Column size={10} offset={2}>
      <Field>
        <Control>
          <Select.Container>
            <Select name="exercise" onChange={handleChange} value={values.exercise}>
              {
                exercises.map(ex => (
                  <Select.Option key={ex} value={ex}>{kb.filler(ex, 'name')}</Select.Option>
                ))
              }
            </Select>
          </Select.Container>
        </Control>
      </Field>
    </Column>
  );

  const getBlocks = () => (
    (ticket && ticket.blocks) || []
  );

  const boxes = getBlocks().map(block => (
    <FilledField key={block.timestamp} block={block}
     mentor={block.fromMentor} pattern={pattern} />
  ));

  const ResponseEditor = ({ dividerLabel, buttonLabel }) => (
    <React.Fragment>
      <Divider color="primary">{dividerLabel}</Divider>
        <BlockEditor submitBlockHandler={saveBlock} context={context} />
        <Field>
          <Control>
            <Button color="primary" onClick={submitTicket}>
              {buttonLabel}
            </Button>
          </Control>
        </Field>
    </React.Fragment>
  );

  // reset exercise to previous setting, if any
  values.exercise = ticket && ticket.exercise;

  return (
    (!ticket || !kb) ? null : (
      <React.Fragment>
        <Divider color="primary">problem report</Divider>
        <Exercise />
        { boxes }
        {
          context.isMentor ? (
            <React.Fragment>
              <Divider color="primary">diagnoses</Divider>
              <Diagnoses ticket={ticket} kb={kb} setPattern={setPattern}/>
              <ResponseEditor dividerLabel="respond" buttonLabel="Send to student" />
            </React.Fragment>
          ) : (
            <ResponseEditor dividerLabel="update problem report" buttonLabel="Send to mentors" />
          )
         }
      </React.Fragment>
    )
  )
};

export default TicketMaker;
