import React from 'react';

import { useFormikContext } from 'formik';

import TCButton from './TCButton';

function TCFormSubmit({ title, ...otherProps }) {
  const { handleSubmit } = useFormikContext();
  return (
      <>
          <TCButton title={ title } onPress={ handleSubmit } { ...otherProps } />
      </>
  );
}

export default TCFormSubmit;
