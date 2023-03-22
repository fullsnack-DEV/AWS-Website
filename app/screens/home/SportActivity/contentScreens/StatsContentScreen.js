// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../../../Localization/translation';
import {getGameStatsData, getStatsRDMData} from '../../../../api/Games';
import BottomSheet from '../../../../components/modals/BottomSheet';
import TeamCard from '../../../../components/TeamCard';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import {getTCDate} from '../../../../utils';
import StatsGraph from '../components/StatsGraph';

const OptionsList = [
  format(strings.pastMonthsText, 3),
  format(strings.pastMonthsText, 6),
  format(strings.pastMonthsText, 9),
  format(strings.pastMonthsText, 12),
];
const val = {
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
  totalMatches: 0,
};
const defaultStats = {
  all: val,
  away: val,
  home: val,
};

const StatsContentScreen = ({sportType = '', sport, authContext, userId}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statsObject, setStatsObject] = useState(defaultStats);
  const [selectedMonths, setSelectedMonths] = useState(
    format(strings.pastMonthsText, 3),
  );
  const [dmRate, setDMRate] = useState({});

  const isFocused = useIsFocused();

  const loadStatsData = useCallback(
    (month = format(strings.pastMonthsText, 3)) => {
      setLoading(true);
      const date = new Date();

      if (month === format(strings.pastMonthsText, 3)) {
        date.setMonth(date.getMonth() - 3);
      } else if (month === format(strings.pastMonthsText, 6)) {
        date.setMonth(date.getMonth() - 6);
      } else if (month === format(strings.pastMonthsText, 9)) {
        date.setMonth(date.getMonth() - 9);
      } else if (month === format(strings.pastMonthsText, 12)) {
        date.setMonth(date.getMonth() - 12);
      }
      const chartParameter = {
        sport,
        fromDate: getTCDate(date),
      };
      getGameStatsData(userId, chartParameter, authContext)
        .then((res) => {
          const list = res.payload.filter((item) => item.sport_name === sport);
          const obj = {...defaultStats};
          list.forEach((item) => {
            let totalMatches = 0;
            let totalWins = 0;
            let totalLosses = 0;
            let totalDraws = 0;
            Object.keys(defaultStats).forEach((ele) => {
              totalMatches += item.stats[ele].total_games;
              totalWins += item.stats[ele].winner;
              totalLosses += item.stats[ele].looser;
              totalDraws += item.stats[ele].draw;
              obj[ele] = {
                totalMatches,
                totalWins,
                totalLosses,
                totalDraws,
              };
            });
          });

          setStatsObject(obj);
          setLoading(false);
        })
        .catch((err) => {
          console.log({err});
          setLoading(false);
        });

      getStatsRDMData(userId, chartParameter, authContext)
        .then((response) => {
          setDMRate(response.payload);
        })
        .catch((err) => {
          console.log({err});
        });
    },
    [authContext, sport, userId],
  );

  useEffect(() => {
    if (isFocused) {
      loadStatsData();
    }
  }, [loadStatsData, isFocused]);

  const getGraphTitle = (option) => {
    switch (option) {
      case Verbs.allText:
        return strings.total;

      case Verbs.homeText:
        return strings.home;

      case Verbs.awayText:
        return strings.away;

      default:
        return '';
    }
  };

  const dmPercentage = parseFloat(
    (dmRate?.approved_games / dmRate.total_games) * 100,
  ).toFixed(2);

  return loading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <ScrollView style={styles.parent}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>
              {sportType === Verbs.singleSport
                ? strings.totalMatches.toUpperCase()
                : strings.matchesTitleText.toUpperCase()}{' '}
              {statsObject.totalMatches}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dropDownContainer}
            onPress={() => setShowModal(true)}>
            <Text style={styles.dropDownLabel}>{selectedMonths}</Text>
            <Image
              source={images.dropDownArrow}
              style={{width: 10, height: 10, marginLeft: 5}}
            />
          </TouchableOpacity>
        </View>
        {Object.keys(statsObject).map((item, index) => (
          <View style={{marginTop: 20}} key={index}>
            {sportType === Verbs.singleSport ? (
              <Text style={styles.label}>
                {getGraphTitle(item)} {statsObject[item].totalMatches}
              </Text>
            ) : (
              <Text style={styles.label}>
                {format(strings.playedMatches, statsObject.totalMatches)}
              </Text>
            )}

            <StatsGraph
              total={statsObject[item].totalMatches}
              wins={statsObject[item].totalWins}
              losses={statsObject[item].totalLosses}
              draws={statsObject[item].totalDraws}
              showTotalMatches={false}
              containerStyle={{alignItems: 'center'}}
            />
          </View>
        ))}
      </View>
      {sportType === Verbs.singleSport ? (
        <>
          <View style={styles.dividor} />
          {/* TC Level & Points */}
          <View style={[styles.container, {paddingTop: 0}]}>
            <Text style={[styles.title, {marginBottom: 15}]}>
              {strings.tcLevelPointsText}
            </Text>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.tcLevel}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  0
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.tcpoint}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  0
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dividor} />

          {/* TC Ranking */}
          <View style={[styles.container, {paddingTop: 0}]}>
            <Text style={[styles.title, {marginBottom: 15}]}>
              {strings.tcranking}
            </Text>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>Vancouver</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  7th
                </Text>
              </View>
            </View>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>BC</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  24th
                </Text>
              </View>
            </View>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>Canada</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  100th
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.world}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  -
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dividor} />

          {/* DM Rate */}
          <View style={[styles.container, {paddingTop: 0}]}>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={[styles.row, {justifyContent: 'center'}]}>
                <Text style={styles.title}>{strings.dmRate}</Text>
                <TouchableOpacity style={styles.infoIcon}>
                  <Image source={images.infoIcon} style={styles.image} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.dropDownContainer}>
                <Text style={styles.dropDownLabel}>{strings.past6Months}</Text>
                <Image
                  source={images.dropDownArrow}
                  style={{width: 10, height: 10, marginLeft: 5}}
                />
              </TouchableOpacity>
            </View>

            <View style={{alignItems: 'center', marginBottom: 15}}>
              <Text style={[styles.label, {marginBottom: 10}]}>
                {strings.dmsText}/{strings.dtsText}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${dmPercentage}%`,
                      backgroundColor: colors.googleColor,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.label, {marginTop: 10, marginBottom: 0}]}>
                {dmRate?.total_games ? dmPercentage : 0}%
              </Text>
            </View>

            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.totalMatches}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  {dmRate?.approved_games ?? '-'}
                </Text>
              </View>
            </View>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.dmsText}{' '}
                  <Text style={styles.lightText}>
                    ({strings.disputedMatches})
                  </Text>
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  {dmRate?.disapproved_games ?? '-'}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 2,
                backgroundColor: colors.grayBackgroundColor,
                marginBottom: 15,
              }}
            />
            <View style={styles.row}>
              <View>
                <Text style={(styles.label, {marginBottom: 0})}>
                  {strings.dtsText}{' '}
                  <Text style={styles.lightText}>
                    ({strings.dmsText} + {strings.totalMatches})
                  </Text>
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={(styles.label, {marginBottom: 0, textAlign: 'right'})}>
                  {dmRate?.total_games ?? '-'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dividor} />
        </>
      ) : (
        <View style={styles.teamList}>
          <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
            {format(strings.playedInTeams, 1)}
          </Text>

          <TeamCard
            item={{
              group_name: 'Volleyball Whitecaps FC',
              city: 'Bangkok, Thailand ',
            }}
            iconStyle={{backgroundColor: colors.whiteColor}}
            locationTextStyle={{fontFamily: fonts.RBold, lineHeight: 24}}
          />
        </View>
      )}

      <BottomSheet
        isVisible={showModal}
        optionList={OptionsList}
        closeModal={() => setShowModal(false)}
        onSelect={(value) => {
          setShowModal(false);
          loadStatsData(value);
          setSelectedMonths(value);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    // flex: 1,
  },
  container: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingTop: 22,
  },
  teamList: {
    marginTop: 25,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.lightGrayBackground,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  dropDownContainer: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.googleColor,
    marginBottom: 15,
  },
  dividor: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoIcon: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  lightText: {
    fontSize: 12,
    lineHeight: 24,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
  },
  progressBar: {
    width: '100%',
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.grayBackgroundColor,
  },
});
export default StatsContentScreen;
