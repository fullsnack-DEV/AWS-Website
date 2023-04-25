// @flow
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const AccountProfileShimmer = () => (
  <View style={styles.parent}>
    <View style={{alignItems: 'center', marginBottom: 25}}>
      <ShimmerView width={60} height={60} borderRadius={30} />
    </View>
    <View style={{marginBottom: 35}}>
      <ShimmerView width={56} />
      <View style={styles.row}>
        <ShimmerView width={165} height={40} style={{marginRight: 15}} />
        <ShimmerView width={165} height={40} />
      </View>
    </View>

    <View style={{marginBottom: 35}}>
      <ShimmerView width={56} />
      <ShimmerView width={350} height={40} />
    </View>

    <View style={{marginBottom: 35}}>
      <ShimmerView width={56} />
      <ShimmerView width={350} height={100} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccountProfileShimmer;
