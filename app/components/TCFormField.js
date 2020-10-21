import React from 'react';

import { useFormikContext } from 'formik';

import TCTextField from './TCTextField';
import ErrorMessage from './ErrorMessage';

function TCFormField({ name, ...otherProps }) {
  const {
    touched,
    handleChange,
    errors,
    setFieldTouched,

    values,
  } = useFormikContext();
  return (
    <>
      <TCTextField
        onChangeText={ handleChange(name) }
        onBlur={ () => setFieldTouched(name) }
        value={ values[name] }
        // onBlur={handleBlur(name)}
        { ...otherProps }
      />
      <ErrorMessage error={ errors[name] } visible={ touched[name] } />
    </>
  );
}

export default TCFormField;
