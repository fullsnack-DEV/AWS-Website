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
} from 'react-native';
import moment from 'moment';

import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TCFormProgress from '../../../components/TCFormProgress';
import {getFeesEstimation} from '../../../api/Challenge';
import {getNumberSuffix} from '../../../utils/gameUtils';

import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
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
    feeBody.payment_method_type = 'card';
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
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.period}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
    </>
  );

  const renderOverTime = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 1)} Over time`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
        value={item.overTime}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
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
    <TCKeyboardView>
      <TCFormProgress totalSteps={4} curruentStep={1} />
      <ActivityLoader visible={loading} />
      <View>
        <View style={[styles.teamContainer, {marginTop: 15}]}>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Image
              source={
                sportType !== 'single'
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
                style={styles.locationLable}
              >{`${groupObj?.city}, ${groupObj?.state_abbr}`}</Text>
              <Text style={styles.locationLable}>
                TC Level 15 TC points 3,000
              </Text>
            </View>
          </View>
        </View>
        {!route?.params?.endTime && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChooseTimeSlotScreen', {
                settingObject,
                comeFrom: 'ChallengeScreen',
              });
            }}
          >
            <View style={[styles.borderButtonView, styles.shadowView]}>
              <View />
              <Text style={styles.detailButtonText}>CHECK AVAILIBILITY</Text>
              <Image
                source={images.arrowGraterthan}
                style={styles.arrowImage}
              />
            </View>
          </TouchableOpacity>
        )}

        <TCThickDivider marginTop={15} />

        {route?.params?.endTime && (
          <View>
            <TCChallengeTitle
              title={'Date & Time'}
              isEdit={!!route?.params?.endTime}
              onEditPress={() => {
                navigation.navigate('ChooseTimeSlotScreen', {
                  settingObject,
                  comeFrom: 'ChallengeScreen',
                });
              }}
            />

            <View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>Start </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.startTime).format(
                    'MMM DD, YYYY hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>End </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.endTime).format(
                    'MMM DD, YYYY hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}> </Text>
                <Text style={styles.timeZoneText}>
                  Time zone{' '}
                  <Text style={{fontFamily: fonts.RRegular}}>Vancouver</Text>
                </Text>
              </View>
            </View>

            <TCThickDivider marginTop={10} />
          </View>
        )}
        <TCChallengeTitle
          title={'Type of Game'}
          value={settingObject?.game_type}
          tooltipText={
            'The game result has an effect on TC points of the challengee and you.'
          }
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Match Fee'}
          value={settingObject?.game_fee?.fee}
          staticValueText={`${settingObject?.game_fee?.currency_type} /Game`}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Refund Policy'}
          value={settingObject?.refund_policy}
          tooltipText={
            '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
          }
          tooltipHeight={hp('18%')}
          tooltipWidth={wp('50%')}
        />
        <TCThickDivider />
      </View>

      <View>
        <TCChallengeTitle title={'Home & Away'} />
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Home</Text>
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
          <Text style={styles.homeLableStyle}>Away</Text>
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
        <TCThickDivider marginTop={20} />
      </View>
      <View>
        {sportName.toLowerCase() === 'tennis' ? (
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
            <TCChallengeTitle title={'Game Duration'} />
            <TCChallengeTitle
              containerStyle={{marginLeft: 25, marginTop: 15, marginBottom: 5}}
              title={'1st period'}
              titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
              value={settingObject?.game_duration?.first_period}
              valueStyle={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: colors.greenColorCard,
                marginRight: 2,
              }}
              staticValueText={'min.'}
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
            title={'Venue'}
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
              <Text style={styles.venueTitle}>{venue?.name}</Text>
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
              }}
            >
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

          <TCThickDivider marginTop={10} />
        </View>

        <TCChallengeTitle title={'Game Rules'} />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.general_rules}</Text>
        <View style={{marginBottom: 10}} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.special_rules}</Text>
        <TCThickDivider marginTop={20} />

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
            <TCLabel title={'Payment'} style={{marginBottom: 15}} />
            <GameFeeCard
              feeObject={feeObj}
              currency={settingObject?.game_fee?.currency_type}
              isChallenger={true}
            />
            <TCThickDivider marginTop={20} />
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
            Alert.alert(
              strings.alertmessagetitle,
              'Please choose future time for challenge.',
            );
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
                sportType === 'single'
                  ? teams?.[0]?.user_id
                  : teams?.[0]?.group_id,
              challengee:
                sportType === 'single'
                  ? teams?.[1]?.user_id
                  : teams?.[1]?.group_id,
              home_team:
                settingObject?.home_away === 'Home' ? groupObj : entity?.obj,
              away_team:
                settingObject?.home_away === 'Home' ? entity?.obj : groupObj,
              user_challenge: sportType === 'single',
            };

            console.log('conti. challnege obj:=>', body);
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
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
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
    marginBottom: 5,
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
    marginTop: 15,
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
    marginLeft: 25,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 25,
    marginBottom: 10,
    marginLeft: 15,
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
});
