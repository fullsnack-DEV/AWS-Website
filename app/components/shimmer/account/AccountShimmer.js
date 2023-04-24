// @flow
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import colors from '../../../Constants/Colors';
import {
  ShimmerView,
  ShimmerSeperator,
} from '../commonComponents/ShimmerCommonComponents';

const List = ['', '', '', '', '', '', '', '', '', '', ''];

const AccountShimmer = () => (
  <View style={styles.parent}>
    <View style={styles.userDeailsContainer}>
      <View style={styles.row}>
        <ShimmerView
          width={55}
          height={55}
          borderRadius={30}
          style={{marginRight: 20}}
        />
        <View>
          <View style={styles.row}>
            <ShimmerView width={100} />
            <ShimmerView width={30} style={{marginLeft: 5}} />
          </View>
          <ShimmerView width={90} />
        </View>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <ShimmerView width={120} />
      </View>
    </View>

    <View style={{padding: 15}}>
      <FlatList
        data={List}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View
            style={[
              styles.row,
              {justifyContent: 'space-between', marginBottom: 30},
            ]}>
            <View style={styles.row}>
              <ShimmerView
                width={30}
                height={30}
                style={{marginRight: 10}}
                borderRadius={5}
              />
              <ShimmerView width={190} height={15} />
            </View>
            <ShimmerView width={30} height={30} borderRadius={5} />
          </View>
        )}
      />
    </View>
    <ShimmerSeperator />
    <View style={{paddingHorizontal: 15}}>
      <View
        style={[
          styles.row,
          {justifyContent: 'space-between', marginBottom: 30},
        ]}>
        <View style={styles.row}>
          <ShimmerView
            width={30}
            height={30}
            style={{marginRight: 10}}
            borderRadius={5}
          />
          <ShimmerView width={190} height={15} />
        </View>
        <ShimmerView width={30} height={30} borderRadius={5} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  userDeailsContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.linesepratorColor,
    paddingTop: 22,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default AccountShimmer;
