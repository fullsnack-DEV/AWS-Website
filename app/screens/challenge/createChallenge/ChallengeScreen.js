/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import moment from 'moment';

import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {format} from 'react-string-format';
import TCFormProgress from '../../../components/TCFormProgress';
import {getFeesEstimation} from '../../../api/Challenge';
import {getNumberSuffix} from '../../../utils/gameUtils';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import AuthContext from '../../../auth/context';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import SecureRefereeView from '../../../components/SecureRefereeView';
import EventMapView from '../../../components/Schedule/EventMapView';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import TCArrowView from '../../../components/TCArrowView';
import TCGameDetailRules from '../../../components/TCGameDetailRules';
import Verbs from '../../../Constants/Verbs';

let entity = {};
const bodyParams = {};
export default function ChallengeScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);

  const [venue, setVenue] = useState();
  const [teams, setteams] = useState([]);
  const [totalZero, setTotalZero] = useState(false);
  const [feeObj, setFeeObj] = useState();

  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);
  const [settingObject] = useState(route?.params?.setting);
  const [isMore, setIsMore] = useState(false);
  const [groupObj] = useState(route?.params?.groupObj);

  console.log('setting object::=>', settingObject);

  useEffect(() => {
    entity = authContext.entity;
    if (groupObj) {
      setteams([{...entity.obj}, {...groupObj}]);
    }
    if (settingObject?.game_fee?.fee || settingObject?.game_fee?.fee >= 0) {
      getFeeDetail();
    }
  }, [authContext.entity, groupObj, settingObject?.game_fee?.fee]);

  useEffect(() => {
    if (route?.params?.selectedVenueObj) {
      setVenue(route?.params?.selectedVenueObj);
    }
    if (settingObject?.venue?.length === 1) {
      setVenue(settingObject?.venue?.[0]);
    }
  }, [route?.params?.selectedVenueObj, settingObject?.venue]);

  const getFeeDetail = () => {
    const feeBody = {};
    feeBody.payment_method_type = Verbs.card;
    feeBody.currency_type =
      settingObject?.game_fee?.currency_type?.toLowerCase();
    feeBody.total_game_fee = Number(settingObject?.game_fee?.fee?.toString());
    // setloading(true);
    getFeesEstimation(feeBody, authContext)
      .then((response) => {
        console.log('Body estimate fee:=>', response.payload);
        setFeeObj(response.payload);
        if (response.payload.total_game_fee === 0) {
          setTotalZero(true);
        } else {
          setTotalZero(false);
        }

        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const renderPeriod = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 15, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={strings.minuteText}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 15, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.period}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={strings.minuteText}
      />
    </>
  );

  const renderOverTime = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 15, marginTop: 5, marginBottom: 5}}
        title={strings.intervalText}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={strings.minuteText}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 15, marginTop: 5, marginBottom: 5}}
        title={format(strings.NoverTime, getNumberSuffix(index + 1))}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.overTime}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={strings.minuteText}
      />
    </>
  );

  const validation = () => {
    if (settingObject?.venue?.length === 1) {
      return false;
    }
    if (venue) {
      return false;
    }
    if (route?.params?.startTime === undefined) {
      return true;
    }
    if (route?.params?.endTime === undefined) {
      return true;
    }
    return true;
  };

  return (
    <ScrollView testID="challenge-scroll">
      <TCFormProgress totalSteps={4} curruentStep={1} />
      <ActivityLoader visible={loading} />
      <View>
        <View style={[styles.teamContainer, {marginTop: 20}]}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={
                sportType !== Verbs.singleSport
                  ? groupObj?.thumbnail
                    ? {uri: groupObj?.thumbnail}
                    : images.teamPlaceholder
                  : groupObj?.thumbnail
                  ? {uri: groupObj?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.imageView}
            />
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {groupObj?.full_name ?? groupObj?.group_name}
              </Text>
              <Text
                style={
                  styles.locationLable
                }>{`${groupObj?.city}, ${groupObj?.state_abbr}`}</Text>
              <Text style={styles.locationLable}>{strings.TCLevelPoints}</Text>
            </View>
          </View>
        </View>

        {!route?.params?.endTime && (
          <View>
            <TCThickDivider marginTop={25} />
            <TCChallengeTitle
              title={strings.dateAndTime.toUpperCase()}
              titleStyle={{...styles.titleText, marginTop: 10}}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChooseTimeSlotScreen', {
                  settingObject,
                  comeFrom: 'ChallengeScreen',
                });
              }}>
              <View style={[styles.borderButtonView, styles.shadowView]}>
                <View />
                <Text style={styles.detailButtonText}>
                  {strings.checkAvailibility}
                </Text>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TCThickDivider marginTop={25} />

        {route?.params?.endTime && (
          <View>
            <TCChallengeTitle
              title={strings.dateAndTime.toUpperCase()}
              titleStyle={{...styles.titleText}}
              isEdit={!!route?.params?.endTime}
              onEditPress={() => {
                navigation.navigate('ChooseTimeSlotScreen', {
                  settingObject,
                  comeFrom: 'ChallengeScreen',
                });
              }}
              containerStyle={{marginTop: 25}}
            />

            <View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>
                  {strings.start.toUpperCase()}
                </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.startTime).format(
                    'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>
                  {strings.end.toUpperCase()}
                </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.endTime).format(
                    'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}> </Text>
                <Text style={styles.timeZoneText}>
                  {`${strings.timezone} `}
                  <Text style={{fontFamily: fonts.RRegular}}>
                    {strings.vancouver}
                  </Text>
                </Text>
              </View>
            </View>

            <TCThickDivider marginTop={0} />
          </View>
        )}
        <TCChallengeTitle
          title={strings.typeOfGame.toUpperCase()}
          titleStyle={{...styles.titleText}}
          value={settingObject?.game_type}
          tooltipText={strings.gamePointsAffectText}
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
          containerStyle={{marginTop: 25, marginBottom: 25}}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={strings.matchFee.toUpperCase()}
          titleStyle={{...styles.titleText}}
          value={settingObject?.game_fee?.fee}
          staticValueText={format(
            strings.perGame,
            settingObject?.game_fee?.currency_type,
          )}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          containerStyle={{marginTop: 25, marginBottom: 25}}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={strings.refundPolicy.toUpperCase()}
          titleStyle={{...styles.titleText}}
          value={settingObject?.refund_policy}
          tooltipText={strings.cancellationPolicyDesc}
          tooltipHeight={hp('18%')}
          tooltipWidth={wp('50%')}
          containerStyle={{marginTop: 25, marginBottom: 25}}
        />
        <TCThickDivider />
      </View>

      <View>
        <TCChallengeTitle
          title={strings.homeAndAway.toUpperCase()}
          titleStyle={{...styles.titleText}}
          containerStyle={{marginTop: 25}}
        />
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>{strings.home}</Text>
          <View style={styles.teamViewStyle}>
            <Image
              source={
                settingObject?.home_away === 'Home'
                  ? groupObj?.thumbnail
                    ? {uri: groupObj?.thumbnail}
                    : groupObj?.full_name
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                  : authContext?.entity?.obj?.thumbnail
                  ? {uri: authContext?.entity?.obj?.thumbnail}
                  : authContext?.entity?.obj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.imageView}
            />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? groupObj?.full_name ?? groupObj?.group_name
                  : authContext?.entity?.obj?.full_name ??
                    authContext?.entity?.obj?.group_name}
              </Text>
              <Text style={styles.locationLable}>
                {settingObject?.home_away === 'Home'
                  ? `${groupObj?.city}, ${groupObj?.state_abbr}`
                  : `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>{strings.away}</Text>
          <View style={styles.teamViewStyle}>
            <Image
              source={
                settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.thumbnail
                    ? {uri: authContext?.entity?.obj?.thumbnail}
                    : authContext?.entity?.obj?.full_name
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                  : groupObj?.thumbnail
                  ? {uri: groupObj?.thumbnail}
                  : groupObj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.imageView}
            />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.full_name ??
                    authContext?.entity?.obj?.group_name
                  : groupObj?.full_name ?? groupObj?.group_name}
              </Text>
              <Text style={styles.locationLable}>
                {settingObject?.home_away === 'Home'
                  ? `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`
                  : `${groupObj?.city}, ${groupObj?.state_abbr}`}
              </Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={25} />
      </View>
      <View>
        {sportName?.toLowerCase() === 'tennis' ? (
          <View>
            <TCGameDetailRules
              gameRules={settingObject?.score_rules}
              isMore={isMore}
              onPressMoreLess={() => {
                setIsMore(!isMore);
              }}
            />
            <TCThickDivider marginTop={20} />
          </View>
        ) : (
          <View>
            <TCChallengeTitle
              title={strings.matchDuration.toUpperCase()}
              titleStyle={{...styles.titleText}}
              containerStyle={{marginTop: 25}}
            />
            <TCChallengeTitle
              containerStyle={{marginLeft: 15, marginTop: 15, marginBottom: 5}}
              title={strings.firstPeriodText}
              titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
              value={settingObject?.game_duration?.first_period}
              valueStyle={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: colors.greenColorCard,
                marginRight: 2,
              }}
              staticValueText={strings.minuteText}
            />

            <FlatList
              data={settingObject?.game_duration?.period}
              renderItem={renderPeriod}
              keyExtractor={(item, index) => index.toString()}
              style={{marginBottom: 15}}
            />
            {settingObject?.game_duration?.period?.length > 0 && (
              <Text style={styles.normalTextStyle}>
                {strings.gameDurationTitle2}
              </Text>
            )}

            <FlatList
              data={settingObject?.game_duration?.overtime}
              renderItem={renderOverTime}
              keyExtractor={(item, index) => index.toString()}
              style={{marginBottom: 15}}
            />
            <TCThickDivider marginTop={20} />
          </View>
        )}

        <View>
          <TCChallengeTitle
            title={strings.venue.toUpperCase()}
            titleStyle={{...styles.titleText}}
            isEdit={!!venue && settingObject?.venue?.length > 1}
            onEditPress={() => {
              navigation.navigate('ChooseVenueScreen', {
                venues: settingObject?.venue || [],
                comeFrom: 'ChallengeScreen',
              });
            }}
          />

          {venue || settingObject?.venue?.length === 1 ? (
            <View style={styles.venueContainer}>
              <Text
                style={{
                  fontFamily: fonts.RBold,
                  fontSize: 14,
                  color: colors.lightBlackColor,
                  marginBottom: 5,
                }}>
                {strings.venueName}
              </Text>
              <Text style={styles.venueTitle}>{venue?.name}</Text>
              <Text
                style={{
                  fontFamily: fonts.RBold,
                  fontSize: 14,
                  color: colors.lightBlackColor,
                  marginTop: 30,
                }}>
                {strings.address}
              </Text>
              <Text style={styles.venueAddress}>{venue?.address}</Text>

              <EventMapView
                coordinate={venue?.coordinate}
                region={venue?.region}
                style={styles.map}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChooseVenueScreen', {
                  venues: settingObject?.venue || [],
                  comeFrom: 'ChallengeScreen',
                });
              }}>
              <View style={[styles.borderButtonView, styles.shadowView]}>
                <View />
                <Text style={styles.detailButtonText}>CHOOSE A VENUE</Text>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowImage}
                />
              </View>
            </TouchableOpacity>
          )}

          <TCThickDivider marginTop={25} />
        </View>

        <TCChallengeTitle
          title={strings.matchrules.toUpperCase()}
          titleStyle={{...styles.titleText, marginTop: 10}}
        />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.general_rules}</Text>
        <View style={{marginBottom: 10}} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.special_rules}</Text>
        <TCThickDivider marginTop={25} />

        {/* <TCChallengeTitle
          title={'Referees'}
          value={settingObject?.responsible_for_referee?.who_secure?.length}
          staticValueText={'Referees'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
        />
        <FlatList
          data={settingObject?.responsible_for_referee?.who_secure}
          renderItem={renderReferees}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        />
        <TCThickDivider marginTop={20} /> */}

        {/* <TCChallengeTitle
          title={'Scorekeepers'}
          value={settingObject?.responsible_for_scorekeeper?.who_secure?.length}
          staticValueText={'Scorekeepers'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
        />
        <FlatList
          data={settingObject?.responsible_for_scorekeeper?.who_secure}
          renderItem={renderScorekeepers}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        />
        <TCThickDivider marginTop={20} /> */}

        {!totalZero && (
          <View>
            <TCLabel
              title={strings.payment.toUpperCase()}
              style={{marginBottom: 15, marginTop: 25}}
            />

            <GameFeeCard
              feeObject={feeObj}
              currency={settingObject?.game_fee?.currency_type}
              isChallenger={true}
            />

            <TCThickDivider marginTop={25} />
          </View>
        )}
      </View>

      <TCGradientButton
        isDisabled={
          !route?.params?.startTime ||
          !route?.params?.endTime ||
          // || settingObject?.venue?.length !== 1
          !venue
        }
        title={strings.nextTitle}
        onPress={() => {
          if (
            new Date(route?.params?.startTime).getTime() < new Date().getTime()
          ) {
            Alert.alert(strings.alertmessagetitle, strings.chooseFutureTime);
          } else {
            entity = authContext.entity;
            const body = {
              ...settingObject,
              ...feeObj,
              venue,
              sport: sportName,
              sport_type: sportType,
              start_datetime: route?.params?.startTime / 1000,
              end_datetime: route?.params?.endTime / 1000,
              challenger:
                sportType === Verbs.singleSport
                  ? teams?.[0]?.user_id
                  : teams?.[0]?.group_id,
              challengee:
                sportType === Verbs.singleSport
                  ? teams?.[1]?.user_id
                  : teams?.[1]?.group_id,
              home_team:
                settingObject?.home_away === 'Home' ? groupObj : entity?.obj,
              away_team:
                settingObject?.home_away === 'Home' ? entity?.obj : groupObj,
              user_challenge: sportType === Verbs.singleSport,
            };

            navigation.push('RefereeAgreementScreen', {
              challengeObj: body,
              groupObj,
              type: 'challenge',
            });

            // navigation.push('ChallengePaymentScreen', {
            //   challengeObj: body,
            //   groupObj,
            //   type: 'challenge',
            // });
          }

          // navigation.push('ChallengePreviewScreen');
          // sendChallenge()
        }}
        outerContainerStyle={{
          marginBottom: 45,
          width: '92%',
          alignSelf: 'center',
          marginTop: 15,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 15,
  },
  homeLableStyle: {
    flex: 0.14,
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flex: 0.86,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  arrowImage: {
    height: 12,
    width: 8,
    resizeMode: 'cover',
    tintColor: colors.themeColor,
  },

  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },

  dateTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 15,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  detailButtonText: {
    alignSelf: 'center',
    fontFamily: fonts.RBold,
    color: colors.themeColor,
    textAlign: 'center',
  },
  borderButtonView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 35,
    width: wp('86%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
    paddingRight: 15,
    paddingLeft: 15,
  },
  shadowView: {
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  normalTextStyle: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 25,
    marginBottom: 10,
    marginLeft: 0,
    marginTop: 0,
  },

  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,

    marginBottom: 5,
  },
  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
});
