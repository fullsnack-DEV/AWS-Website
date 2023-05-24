// @flow
import React from 'react';
import {View, Text, FlatList} from 'react-native';

import fonts from '../../../../Constants/Fonts';

const ServicableArea = ({avialableArea = null}) => (
  <View>
    <FlatList
      data={avialableArea?.address_list}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <Text
          style={{
            marginTop: index > 0 ? 15 : 0,
            fontSize: 16,
            fontFamily: fonts.RRegular,
            lineHeight: 24,
          }}>
          {item.address}
        </Text>
      )}
    />
  </View>
);

export default ServicableArea;
