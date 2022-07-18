import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCTextTableView from './TCTextTableView';

const TopHeader = ({title}) => (
  <View
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: 15,
    }}
  >
    <View style={styles.totalGameViewStyle}>
      <Text style={styles.totalGameTextStyle}>{title}</Text>
    </View>
  </View>
);

const statsData = [
  {key: 'Ace', value: '12'},
  {key: 'Double Faults', value: '4'},
  {key: '1st serve in %', value: '64%'},
  {key: '1st serve pts won %', value: '87%'},
  {key: '2nd serve pts won %', value: '52%'},
  {key: 'Winners ', value: '17'},
  {key: 'Unforced errors ', value: '12'},
  {key: 'Break Points Won ', value: '3/4'},
  {key: 'Total Points Won ', value: '57'},
];
const PlayInTennisSingleFiveSetsGame = () => (
  <View style={{flex: 1}}>
    <TopHeader title={'STATS Per game ( 5 sets )'} />

    <View style={{padding: 15}}>
      <Text style={styles.mainTitle}>
        Total <Text style={{fontFamily: fonts.RBold}}>59</Text> Games
      </Text>

      <Text style={styles.mainTitle}>
        Match Time : <Text style={{fontFamily: fonts.RBold}}>57 m</Text>
      </Text>

      <FlatList
        style={{paddingHorizontal: 10, paddingTop: 5}}
        data={statsData}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({item}) => (
          <View style={{paddingVertical: 5}}>
            <TCTextTableView leftTitle={item?.key} rightTitle={item?.value} />
          </View>
        )}
      />
      <TouchableOpacity>
        <Text style={styles.detailText}>Detail info about ratings</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainTitle: {
    marginVertical: 5,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  totalGameViewStyle: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  totalGameTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  detailText: {
    marginVertical: 5,
    marginRight: 5,
    color: colors.lightBlackColor,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: fonts.RLight,
    textDecorationLine: 'underline',
  },
});
export default PlayInTennisSingleFiveSetsGame;
