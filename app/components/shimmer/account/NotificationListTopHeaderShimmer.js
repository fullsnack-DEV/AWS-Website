import React from 'react';
import {View, ScrollView} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const NotificationListTopHeaderShimmer = ({count = 10}) => (
  <ScrollView
    style={{marginVertical: 5}}
    horizontal={true}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}>
    {Array(count)
      .fill('')
      .map((item, index) => (
        <View key={index} style={{marginHorizontal: 20}}>
          <View style={{flexDirection: 'row'}}>
            <ShimmerView
              style={{marginRight: 15, borderRadius: 50}}
              width={40}
              height={40}
            />
            <View style={{flex: 1}}>
              <ShimmerView style={{width: '50%'}} />
              <ShimmerView style={{width: '100%'}} height={10} />
            </View>
          </View>
        </View>
      ))}
  </ScrollView>
);

export default NotificationListTopHeaderShimmer;
