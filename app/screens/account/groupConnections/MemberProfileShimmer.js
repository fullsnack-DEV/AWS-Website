// @flow

import {View, StyleSheet} from 'react-native';
import React from 'react';
import {ShimmerView} from '../../../components/shimmer/commonComponents/ShimmerCommonComponents';

export default function MemberProfileShimmer() {
  return (
    <View style={styles.mainContainer}>
      {/* name container */}
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 40,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ShimmerView width={40} height={40} borderRadius={50} />
        <View>
          <ShimmerView
            width={150}
            height={10}
            style={{
              marginLeft: 13,
            }}
          />
          <ShimmerView
            width={70}
            height={10}
            style={{
              marginLeft: 13,
            }}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 40,
          paddingHorizontal: 20,
        }}>
        <ShimmerView width={250} height={10} />
        <ShimmerView width={250} height={10} />
      </View>

      <ShimmerView width={700} height={10} style={{marginTop: 70}} />
      <View style={{marginTop: 40, marginHorizontal: 20, flex: 1}}>
        <View style={styles.row}>
          <ShimmerView width={70} height={20} />
          <ShimmerView width={35} height={20} />
        </View>
        <View style={{marginTop: 40}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
        </View>
      </View>

      <ShimmerView width={700} height={10} style={{marginTop: 350}} />
      <View style={{marginTop: 40, marginHorizontal: 20, flex: 1}}>
        <View style={styles.row}>
          <ShimmerView width={70} height={20} />
          <ShimmerView width={35} height={20} />
        </View>
        <View style={{marginTop: 40}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View style={styles.rowText}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View style={styles.rowText}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View style={styles.rowText}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View style={styles.rowText}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
          <View style={styles.rowText}>
            <ShimmerView width={70} height={20} />
            <ShimmerView width={35} height={20} style={{marginLeft: 90}} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
});
