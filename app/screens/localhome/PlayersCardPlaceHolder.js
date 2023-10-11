import {View, Text, FlatList} from 'react-native';
import React, {memo} from 'react';
import TeamCard from './TeamCard';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import PlayersCard from './PlayersCard';
import EventsCard from './EventsCard';

function PlayersCardPlaceHolder({
  data,
  placeholdertext,
  forTeams = false,
  forevent = false,
}) {
  const renderItem = (item) => {
    if (forTeams) {
      return <TeamCard item={item} placholder={true} />;
    }
    if (forevent) {
      return (
        <EventsCard
          data={item}
          forPlaceholder={true}
          owners={[]}
          allUserData={[]}
        />
      );
    }

    return <PlayersCard item={item} placholder={true} />;
  };

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontSize: 14,
          color: colors.userPostTimeColor,
          fontFamily: fonts.RBold,
          marginBottom: 15,
          marginLeft: 15,
          textTransform: 'uppercase',
        }}>
        {placeholdertext}
      </Text>

      <FlatList
        renderToHardwareTextureAndroid
        scrollEnabled={false}
        data={data}
        horizontal
        extraData={data}
        style={{
          opacity: 0.5,
          flexDirection: 'row',
          flex: 1,
          paddingVertical: 6,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
}

export default memo(PlayersCardPlaceHolder);
