// @flow
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import {getJSDate} from '../../../../utils';

const MatchCard = ({match = {}, teamsData = {}, onSendOffer = () => {}}) => {
  const [homeTeam, setHomeTeam] = useState({});
  const [awayTeam, setAwayTeam] = useState({});
  const [host, setHost] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && teamsData) {
      if (match.away_team) {
        setAwayTeam(teamsData[match.away_team]);
      }
      if (match.home_team) {
        setHomeTeam(teamsData[match.home_team]);
      }
      if (match.invited_by) {
        setHost(teamsData[match.invited_by]);
      }
    }
  }, [isFocused, match, teamsData]);

  return (
    <>
      <View style={styles.parent}>
        <View style={styles.row}>
          <Text style={styles.dateTime}>
            {moment(getJSDate(match.start_datetime).getTime()).format(
              'ddd, MMM DD · HH:mma',
            )}
          </Text>
          <View style={styles.verticalLineSeparator} />
          <View style={{flex: 1}}>
            <Text
              style={[styles.dateTime, {fontFamily: fonts.RRegular}]}
              numberOfLines={1}>
              {match.venue?.address}
            </Text>
          </View>
        </View>
        <View
          style={[styles.row, {justifyContent: 'space-between', marginTop: 8}]}>
          <View style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
            <View style={styles.logoContainer}>
              <Image
                source={
                  homeTeam?.thumbnail
                    ? {uri: homeTeam.thumbnail}
                    : images.teamPH
                }
                style={[styles.image, {borderRadius: 15}]}
              />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
                numberOfLines={2}>
                {homeTeam?.group_name ?? homeTeam?.full_name}
              </Text>
            </View>
          </View>

          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={[styles.dateTime, {fontFamily: fonts.RRegular}]}>
              VS
            </Text>
          </View>

          <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.dateTime,
                  {fontFamily: fonts.RMedium, textAlign: 'right'},
                ]}
                numberOfLines={2}>
                {awayTeam?.group_name ?? awayTeam?.full_name}
              </Text>
            </View>
            <View style={[styles.logoContainer, {marginLeft: 5}]}>
              <Image
                source={
                  awayTeam?.thumbnail
                    ? {uri: awayTeam.thumbnail}
                    : images.teamPH
                }
                style={[styles.image, {borderRadius: 15}]}
              />
            </View>
          </View>
        </View>
      </View>
      {/* Host */}
      <View
        style={[
          styles.row,
          {
            marginHorizontal: 25,
            justifyContent: 'space-between',
            marginBottom: 15,
          },
        ]}>
        <View style={styles.row}>
          <Text style={styles.host}>{strings.matchHostText}:</Text>
          <View style={styles.row}>
            <View
              style={[
                styles.logoContainer,
                {marginLeft: 5, width: 20, height: 20},
              ]}>
              <Image
                source={
                  awayTeam?.thumbnail ? {uri: host.thumbnail} : images.teamPH
                }
                style={[styles.image, {borderRadius: 15}]}
              />
            </View>
            <View>
              <Text style={styles.host} numberOfLines={1}>
                {host?.group_name ?? host?.full_name}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onSendOffer()}>
          <Text style={styles.buttonText}>{strings.sendOfferText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dividor} />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
    marginHorizontal: 25,
    marginTop: 19,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.greyBorderColor,
    borderRadius: 15,
    marginRight: 5,
  },
  dateTime: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  verticalLineSeparator: {
    width: 1,
    height: 10,
    backgroundColor: colors.darkGrey,
    marginLeft: 8,
    marginRight: 10,
  },
  host: {
    fontSize: 12,
    lineHeight: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  buttonContainer: {
    backgroundColor: colors.themeColor,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  dividor: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 25,
  },
});
export default MatchCard;
