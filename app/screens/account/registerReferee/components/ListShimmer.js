// @flow
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {ShimmerView} from '../../../../components/shimmer/commonComponents/ShimmerCommonComponents';
import colors from '../../../../Constants/Colors';

const ListShimmer = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.parent}>
      <ShimmerView width={325} height={88} style={{marginBottom: 15}} />
      <View style={styles.row}>
        <ShimmerView width={247} height={24} style={{marginRight: 10}} />
        <ShimmerView width={68} height={24} />
      </View>
      <View style={styles.dividor} />
    </View>
    <View style={styles.parent}>
      <ShimmerView width={325} height={88} style={{marginBottom: 15}} />
      <View style={styles.row}>
        <ShimmerView width={247} height={24} style={{marginRight: 10}} />
        <ShimmerView width={68} height={24} />
      </View>
      <View style={styles.dividor} />
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: 25,
    marginTop: 19,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  dividor: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
});
export default ListShimmer;
