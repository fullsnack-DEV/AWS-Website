import React from 'react';
import {strings} from '../../../../Localization/translation';
import TCButton from '../../../components/TCButton';

export default function GameDetail({navigation}) {
  return (
    <TCButton
      title={strings.nextTitle}
      onPress={() => navigation.navigate('SoccerRecording')}
    />
  );
}
