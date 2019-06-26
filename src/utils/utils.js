import { useState } from 'react';

// general JSON fetcher
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw response;
  return response.json();
};

// for console debugging printing
const showObject = (tag, x) => { 
  console.log(tag)
  console.log(x); 
  return x;
};

// https://github.com/criesbeck/custom-react-hooks-forms
const useForm = (names) => {

  const [values, setValues]
     = useState(Object.fromEntries(names.map(name => [name, ''])));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  return [ values, handleChange ];
};

export { fetchJson, showObject, useForm };