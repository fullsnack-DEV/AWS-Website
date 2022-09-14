import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {string} from 'prop-types';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import TCTextTableView from './TCTextTableView';
import {statsData} from '../../../../../utils/constant';
import {strings} from '../../../../../../Localization/translation';

const TopHeader = ({title}) => (
  <View
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 5,
      paddingHorizontal: 15,
    }}>
    <View style={styles.totalGameViewStyle}>
      <Text style={styles.totalGameTextStyle}>{title}</Text>
    </View>
  </View>
);

const PlayInTennisSingleFiveSetsGame = () => (
  <View style={{flex: 1}}>
    <TopHeader title={string.statsPerGame} />

    <View style={{padding: 15}}>
      <Text style={styles.mainTitle}>
        {strings.totalText} <Text style={{fontFamily: fonts.RBold}}>59</Text>{' '}
        {strings.games}
      </Text>

      <Text style={styles.mainTitle}>
        {strings.matchTime} :{' '}
        <Text style={{fontFamily: fonts.RBold}}>57 m</Text>
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
        <Text style={styles.detailText}>{strings.detailInfoRating}</Text>
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
