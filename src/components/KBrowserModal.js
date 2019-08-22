import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import 'rbx/index.css';
import { Heading } from 'rbx';
import KB from 'utils/kb';
      
const theKB = KB({
  concepts: {
    "overlay": {
      "absts": ["image-function"],
      "phrases": [
        ["overlay"]
      ]
    },
    "function-call": {
      "absts": ["code-action"],
      "slots": {"object": "function" },
      "phrases": [
        ["apply", ["object"]],
        ["call", ["object"]],
        ["run", ["object"]],
        ["use", ["object"]]
      ]
    },
    "image-function": {
      "absts": ["library-function"], "slots": {"library": "image.rkt" }
    },
    "library-function": {
      "absts": ["function"],
      "phrases": [
        ["library", "function"]
      ]
    },
    "function": {
      "phrases": [
        "function"
      ]
    },
    "image.rkt": {
      "absts": ["library"], "slots": {"language": "Racket" }
    },
    "cs111": {"absts": ["course"], "slots": {"name": "CS 111" } },
    "ex-1": {
      "absts": ["exercise"],
      "slots": {"course": "cs111", "name": "Exercise 1" }
    },
    "ex-2": {
      "absts": ["exercise"],
      "slots": {"course": "cs111", "name": "Exercise 2" }
    },
    "ex-2-1": {
      "absts": ["exercise"],
      "slots": {"course": "cs211", "name": "Exercise 2.1" }
    }
  }
});

const isEmpty = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};

const expToString = exp => {
  const slots = isEmpty(exp.slots) ? '' : ` slots: ${JSON.stringify(exp.slots)}`;
  const matched = isEmpty(exp.matched) ? '' : ` matched: ${exp.matched.join(', ')}`;

  return (
    `base: ${exp.base} phrase: ${exp.phrase}${slots}${matched}`
  )
};

const KBrowserModal = ({ isOpen, close, resources }) => {
  // use ref to not parse on every key stroke
  const [text, setText] = useState('');
  const ref = useRef('');
  const parse = () => {
    setText(ref.current.value);
  }

  const exps = theKB.dmap(text).filter(exp => exp.matched.length > 0);
  const refs = theKB.references(exps)

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
      <pre id="parse-exps">{ exps.map(expToString).join('\n') }</pre>
    </div>
  </Modal>
  );
};

export default KBrowserModal;