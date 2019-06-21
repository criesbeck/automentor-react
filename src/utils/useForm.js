import { useState } from 'react';

const useForm = (names) => {

  const [values, setValues]
     = useState(Object.fromEntries(names.map(name => [name, ''])));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return [ values, handleChange ];
};

export default useForm;
