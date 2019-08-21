import React, { useState } from 'react';
import KB from './kb.js';
      
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

const select = x => document.querySelector(x);

const KBrowser = () => {
  const [text, setText] = useState('');
  const testParse = () => {
    setText(select('#parse-text').value);
  }

  const exps = theKB.dmap(text);
  const refs = theKB.references(exps)

  return (
    <div>
      <h1>DMAP Tester</h1>
      <div>
        <label for="parse-text">Text to parse:</label>
        <input id="parse-text" type="text" style={{ width: '10em' }} value={text}/>
        <button id="parse-btn" onClick={testParse}>Parse</button>
      </div>
      <hr />
      <div>
        References: 
        <span id="parse-refs">
          { refs }
        </span>
      </div>
      <div>
        Expectations:
        <pre id="parse-exps">
          { exps }
        </pre>
      </div>
    </div>
  );
};

export default KBrowser;