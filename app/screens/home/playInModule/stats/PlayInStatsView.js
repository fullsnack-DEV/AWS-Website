import {View} from 'react-native';
import React from 'react';
import PlayInCommonStatsView from './commonViews/PlayInCommonStatsView';
import PlayInTennisSingleStatsView from './tennisSingle/PlayInTennisSingleStatsView';
import Verbs from '../../../../Constants/Verbs';

const PlayInStatsView = ({playInObject, currentUserData, sportName}) => {
  const renderStats = () => {
    if (sportName.toLowerCase() === Verbs.tennisSport) {
      return (
        <PlayInTennisSingleStatsView
          playInObject={playInObject}
          currentUserData={currentUserData}
          sportName={sportName}
        />
      );
    }
    return (
      <PlayInCommonStatsView
        playInObject={playInObject}
        currentUserData={currentUserData}
        sportName={sportName}
      />
    );
  };
  return <View style={{flex: 1}}>{renderStats()}</View>;
};

export default PlayInStatsView;
