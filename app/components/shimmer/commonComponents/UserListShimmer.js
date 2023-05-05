import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {ShimmerView} from './ShimmerCommonComponents';

const UserListShimmer = ({count = 15}) => (
  <ScrollView style={{padding: 15, flex: 1}}>
    {Array(count)
      .fill('')
      .map((item, index) => (
        <View key={index} style={styles.parent}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '60%'}}>
            <ShimmerView
              style={{marginRight: 15, borderRadius: 20}}
              width={40}
              height={40}
            />
            <View style={{flex: 1}}>
              <ShimmerView style={{width: '80%'}} />
              <ShimmerView style={{width: '45%'}} />
            </View>
          </View>

          <ShimmerView style={{width: '20%'}} />
        </View>
      ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default UserListShimmer;
