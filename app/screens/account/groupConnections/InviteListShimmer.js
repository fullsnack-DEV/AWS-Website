// @flow

import {View, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {ShimmerView} from '../../../components/shimmer/commonComponents/ShimmerCommonComponents';

export default function InviteListShimmer() {
  const RenderShimmer = () => (
    <View style={styles.row}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <ShimmerView width={40} height={40} borderRadius={50} />
        <ShimmerView width={100} height={20} style={{marginLeft: 15}} />
      </View>
      <ShimmerView width={30} height={20} style={{marginRight: 19}} />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.listLines}>
        <FlatList
          data={new Array(20).fill('Dummy Val')}
          keyExtractor={(item, index) => index.toString()}
          renderItem={RenderShimmer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignContent: 'center',
    flex: 1,
  },

  listLines: {
    marginTop: 5,
    flex: 1,
  },
  row: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
