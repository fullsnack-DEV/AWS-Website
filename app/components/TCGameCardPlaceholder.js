import React from 'react';
import {Text, FlatList, View} from 'react-native';

import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import HorizontalsCards from '../screens/localhome/HorizontalsCards';

function TCGameCardPlaceholder({
  data,
  upComingMatch = false,
  placeholderText = '',
}) {
  return (
    <>
      <Text
        style={{
          fontSize: 14,
          color: colors.userPostTimeColor,
          fontFamily: fonts.RBold,
          marginBottom: 2.5,
          marginLeft: 15,
          textTransform: 'uppercase',
        }}>
        {placeholderText}
      </Text>
      <View style={{flex: 1}}>
        <FlatList
          data={data}
          style={{opacity: 0.3}}
          horizontal
          contentContainerStyle={{paddingVertical: 6}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <HorizontalsCards
              item={item}
              upComingMatch={upComingMatch}
              placeholder={true}
            />
          )}
        />
      </View>
    </>
  );
}

export default TCGameCardPlaceholder;
