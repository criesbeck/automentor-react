// https://github.com/criesbeck/custom-react-hooks-forms

import { useState } from 'react';

const useForm = (names) => {

  const [values, setValues]
     = useState(Object.fromEntries(names.map(name => [name, ''])));

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  return [ values, handleChange ];
};

export default useForm;
