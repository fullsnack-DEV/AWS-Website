import React from 'react';
import {View, ScrollView} from 'react-native';
import {
  ShimmerSeperator,
  ShimmerView,
} from '../commonComponents/ShimmerCommonComponents';

const ReservationMainScreenShimmer = () => (
  <ScrollView style={{padding: 15, width: '100%'}}>
    {Array(5)
      .fill('')
      .map((item, index) => (
        <View key={index} style={{marginBottom: 15}}>
          <ShimmerView
            style={{width: '60%', height: 15, alignSelf: 'flex-end'}}
          />
          <View key={index} style={{flexDirection: 'row', marginBottom: 10}}>
            <ShimmerView
              style={{marginRight: 15, borderRadius: 50}}
              width={50}
              height={50}
            />
            <View style={{flex: 1}}>
              <ShimmerView style={{width: '60%', height: 13}} />
              <ShimmerView style={{width: '40%', height: 13}} />
            </View>
          </View>
          <ShimmerView style={{width: '75%', height: 15}} />
          <ShimmerView
            style={{width: '100%'}}
            height={120}
            marginVertical={10}
          />
          <ShimmerView style={{width: '100%'}} height={40} />
          <ShimmerSeperator />
        </View>
      ))}
  </ScrollView>
);

export default ReservationMainScreenShimmer;
