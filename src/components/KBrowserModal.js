import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import 'rbx/index.css';
import { Heading } from 'rbx';

const isEmpty = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};

const expToString = (exp, kb) => {
  const slots = isEmpty(exp.slots) ? '' : `${JSON.stringify(exp.slots)}`;
  if (!exp.phrase) debugger;
  const expecting = exp.phrase.map(focus => (
    typeof focus === 'string' ? [focus] : `${kb.filler(exp.base, focus)}`
  ));

  return (
    [...exp.matched, ...exp.phrase, '=>', exp.base, slots, expecting].join(' ')
  )
};

const KBrowserModal = ({ isOpen, close, kb }) => {
  // use ref to not parse on every key stroke
  const [text, setText] = useState('');
  const ref = useRef('');
  const parse = () => {
    setText(ref.current.value);
  }

  const exps = kb.dmap(text).filter(exp => exp.matched.length > 0);
  const refs = kb.references(exps)

  return (
    <Modal appElement={document.getElementById('root')} isOpen={isOpen}
        onRequestClose={close}
        style={{
          content: { top: '20%', left: '10%', height: '60%', width: '80%' },
          overlay: { zIndex: 10 }
        }}>
    <Heading>DMAP Tester</Heading>
    <div>
      <label htmlFor="parse-text">Text to parse:</label>
      <input id="parse-text" type="text" style={{ width: '10em' }} ref={ref} />
      <button id="parse-btn" onClick={parse}>Parse</button>
    </div>
    <hr />
    <div>
      References: 
      <span id="parse-refs">{ refs.join(', ') }</span>
    </div>
    <div>
      Expectations:
      <pre id="parse-exps">{ exps.map(exp => expToString(exp, kb)).join('\n') }</pre>
    </div>
  </Modal>
  );
};

export default KBrowserModal;