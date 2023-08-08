// @flow
import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import colors from '../../../Constants/Colors';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const EventListShimmer = () => (
  <View>
    <ScrollView showsVerticalScrollIndicator={false}>
      {Array(5)
        .fill('')
        .map((item, index) => (
          <View
            style={{
              paddingHorizontal: 15,
              paddingTop: 20,
            }}
            key={index}>
            <ShimmerView height={20} width={160} />
            <View style={styles.container}>
              <ShimmerView
                style={{width: '100%', marginTop: 0}}
                height={80}
                borderRadius={5}
              />

              <View style={styles.box} />

              <View style={styles.middleBar} />

              <View style={{paddingHorizontal: 10}}>
                <View style={{flexDirection: 'row', paddingVertical: 5}}>
                  <ShimmerView width={100} />
                  <ShimmerView width={2} style={{marginHorizontal: 10}} />
                  <ShimmerView width={40} />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <ShimmerView width={30} />

                  <ShimmerView width={150} style={{marginLeft: 10}} />
                </View>
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  middleBar: {
    backgroundColor: colors.whiteColor,
    height: 20,

    position: 'absolute',
    width: '90%',
    top: 50,
    alignSelf: 'center',
    borderRadius: 10,
  },
  box: {
    backgroundColor: colors.whiteColor,
    height: 15,
    width: 15,
    position: 'absolute',
    right: 15,
    top: 15,
  },
  container: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 7,
    borderRadius: 5,
    marginTop: 15,
  },
});
export default EventListShimmer;
