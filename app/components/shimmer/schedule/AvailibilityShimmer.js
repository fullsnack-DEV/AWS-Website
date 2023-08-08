// @flow
import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import colors from '../../../Constants/Colors';
import {ShimmerView} from '../commonComponents/ShimmerCommonComponents';

const AvailabilityShimmer = () => (
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <ShimmerView height={20} width={160} />
              <ShimmerView height={15} width={20} />
            </View>

            <View>
              <View style={styles.container}>
                <ShimmerView
                  style={{width: '100%', marginTop: 5}}
                  height={20}
                  colors={[
                    colors.whiteColor,
                    colors.lightWhite,
                    colors.lightWhite,
                  ]}
                  borderRadius={20}
                />
              </View>
              <View style={styles.container}>
                <ShimmerView
                  style={{width: '100%', marginTop: 5}}
                  height={20}
                  colors={[
                    colors.whiteColor,
                    colors.lightWhite,
                    colors.lightWhite,
                  ]}
                  borderRadius={20}
                />
              </View>
              <View style={styles.container}>
                <ShimmerView
                  style={{width: '100%', marginTop: 5}}
                  height={20}
                  colors={[
                    colors.whiteColor,
                    colors.lightWhite,
                    colors.lightWhite,
                  ]}
                  borderRadius={20}
                />
              </View>
            </View>
          </View>
        ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    marginTop: 15,
    paddingHorizontal: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AvailabilityShimmer;
