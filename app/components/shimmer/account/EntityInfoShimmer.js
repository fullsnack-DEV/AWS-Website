// @flow
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const EntityInfoShimmer = () => (
  <View style={{paddingTop: 20}}>
    <View style={styles.parent}>
      <ShimmerView width={100} style={{marginBottom: 15}} />
      <ShimmerView style={{width: '100%'}} />
      <ShimmerView style={{width: '100%'}} />
      <ShimmerView style={{width: '100%', marginBottom: 10}} />
      <ShimmerView width={80} height={10} />
    </View>
    <ShimmerView height={7} style={{width: '100%', marginVertical: 25}} />

    <View style={styles.parent}>
      <ShimmerView width={150} style={{marginBottom: 15}} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <ShimmerView width={100} />
        </View>
        <View style={{flex: 1}}>
          <ShimmerView width={80} />
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <ShimmerView width={150} />
        </View>
        <View style={{flex: 1}}>
          <ShimmerView width={80} />
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <View style={{flex: 1}}>
          <ShimmerView width={110} />
        </View>
        <View style={{flex: 1}}>
          <ShimmerView style={{width: '100%'}} />
          <ShimmerView width={80} />
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <ShimmerView width={100} />
        </View>
        <View style={{flex: 1}}>
          <ShimmerView width={80} />
        </View>
      </View>
    </View>
    <ShimmerView height={7} style={{width: '100%', marginVertical: 25}} />

    <View style={styles.parent}>
      <ShimmerView width={100} style={{marginBottom: 15}} />
      <ShimmerView style={{width: '40%'}} />
      <ShimmerView style={{width: '80%'}} />
      <ShimmerView style={{width: '100%'}} height={150} />
    </View>
    <ShimmerView height={7} style={{width: '100%', marginVertical: 25}} />
  </View>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
  },
});
export default EntityInfoShimmer;
