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

  const initVal = (name, inits) =>  inits ? inits[name] : '';

  const [values, setValues] = useState(names.reduce((obj, name) => ({...obj, [name]: initVal(name)}), {}));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  const setValue = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const resetValues = (inits) => {
    Object.entries(inits).forEach(([name, val]) => { values[name] = val; });
    console.log(`reset ${JSON.stringify(values)}`)
  }
 
  return [ values, handleChange, resetValues ];
};

export { fetchJson, removeDuplicates, showObject, useForm };