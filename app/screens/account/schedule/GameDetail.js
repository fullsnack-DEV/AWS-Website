import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import TCButton from '../../../components/TCButton';

export default function GameDetail({navigation}) {
  return (
    <TCButton
      title="NEXT"
      onPress={() => navigation.navigate('GameRecording')}
    />
  );
}
