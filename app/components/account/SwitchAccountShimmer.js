// @flow
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShimmerView} from '../shimmer/commonComponents/ShimmerCommonComponents';

const SwitchAccountShimmer = () =>
  Array(8)
    .fill('')
    .map((item, index) => (
      <View style={{paddingHorizontal: 15, marginTop: 15}} key={index}>
        <View
          key={index}
          style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <ShimmerView
              width={40}
              height={40}
              style={{marginRight: 10}}
              borderRadius={20}
            />
            <View>
              <ShimmerView width={190} height={15} />
              <ShimmerView width={100} height={15} />
            </View>
          </View>
          <ShimmerView width={22} height={22} borderRadius={11} />
        </View>
        <ShimmerView height={2} style={{marginVretical: 30}} />
      </View>
    ));

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default SwitchAccountShimmer;
