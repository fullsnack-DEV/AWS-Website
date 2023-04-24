// @flow
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const AccountBasicInfoShimmer = () => (
  <View style={styles.parent}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{marginBottom: 35}}>
        <ShimmerView width={61} height={24} style={{marginBottom: 10}} />
        <ShimmerView width={35} height={24} />
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={71} height={24} style={{marginBottom: 10}} />
        <ShimmerView width={94} height={24} />
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={57} />
        <View style={styles.row}>
          <ShimmerView width={165} height={40} style={{marginRight: 15}} />
          <ShimmerView width={165} height={40} />
        </View>
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={57} />
        <View style={styles.row}>
          <ShimmerView width={165} height={40} style={{marginRight: 15}} />
          <ShimmerView width={165} height={40} />
        </View>
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={93} height={24} style={{marginBottom: 10}} />
        <ShimmerView width={345} height={40} />
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={57} />
        <View style={styles.row}>
          <ShimmerView width={165} height={40} style={{marginRight: 15}} />
          <ShimmerView width={165} height={40} />
        </View>
      </View>

      <View style={{marginBottom: 35}}>
        <ShimmerView width={140} height={24} style={{marginBottom: 10}} />
        <ShimmerView width={345} height={40} />
      </View>
    </ScrollView>
  </View>
);
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccountBasicInfoShimmer;
