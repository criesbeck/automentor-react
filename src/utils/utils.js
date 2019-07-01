import { useState } from 'react';

// general JSON fetcher
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw response;
  return response.json();
};

const removeDuplicates = lst => (
  lst.filter((x, i) => i === lst.lastIndexOf(x))
);

// for console debugging printing
const showObject = (tag, x) => { 
  console.log(tag)
  console.log(x); 
  return x;
};

// https://github.com/criesbeck/custom-react-hooks-forms
const useForm = (names, inits) => {

  const [values, setValues] 
     = useState(names.reduce((obj, name) => ({...obj, [name]: (inits || {})[name] || ''}), {}));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  return [ values, handleChange ];
};

export { fetchJson, removeDuplicates, showObject, useForm };