// @flow
import React from 'react';
import {View, ScrollView} from 'react-native';
import colors from '../../../Constants/Colors';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const EventListShimmer = () => (
  <View>
    {/* <View style={styles.row}>
      <ShimmerView width={100} style={{marginRight: 10}} />
      <ShimmerView width={130} />
    </View>
    <ShimmerView height={2} style={{width: '100%', margin: 0}} /> */}
    <ScrollView showsVerticalScrollIndicator={false}>
      {Array(5)
        .fill('')
        .map((item, index) => (
          <View style={{paddingHorizontal: 15, paddingTop: 20}} key={index}>
            <ShimmerView height={20} width={160} />
            <View
              style={{
                backgroundColor: colors.whiteColor,
                shadowColor: colors.googleColor,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 7,
                borderRadius: 5,
                marginTop: 15,
              }}>
              <ShimmerView
                style={{width: '100%', marginTop: 0}}
                height={90}
                borderRadius={5}
              />
              <View style={{padding: 15}}>
                <View style={{flexDirection: 'row'}}>
                  <ShimmerView />
                  <ShimmerView width={2} style={{marginHorizontal: 10}} />
                  <ShimmerView width={80} />
                </View>
                <ShimmerView />
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  </View>
);

// const styles = StyleSheet.create({
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 6,
//   },
// });
export default EventListShimmer;
