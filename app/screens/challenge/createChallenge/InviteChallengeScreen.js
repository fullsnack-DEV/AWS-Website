/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, {
 useEffect, useState, useContext, useCallback,
 } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import { getChallengeSetting } from '../../../api/Challenge';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import { getLatLong } from '../../../api/External';
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
import { getNumberSuffix } from '../../../utils/gameUtils';

let entity = {};
let bodyParams = {};
export default function InviteChallengeScreen({ navigation, route }) {
  const { sportName, groupObj } = route?.params;

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);

  const [venue, setVenue] = useState(0);
  const [cordinate, setCordinate] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });

  const [settingObject, setSettingObject] = useState();

  const [teams, setteams] = useState([]);
  const [region, setRegion] = useState();
  const [secureVenue, setsecureVenue] = useState(0);
  const [teamData, setTeamData] = useState();
  const [editableAlter, setEditableAlter] = useState(false);
  const [venueTitle, setVenueTitle] = useState('');
  const [sport, setSport] = useState(route?.params?.groupObj?.sport);
  const [venueData, setVenueData] = useState({
    lat: null,
    long: null,
    title: null,
    address: null,
    venueType: null,
    city: null,
    state: null,
    country: null,
  });

  const getSettings = useCallback(() => {
    setloading(true);
    getChallengeSetting(authContext?.entity?.uid, sportName, authContext)
      .then((response) => {
        setloading(false);
        console.log('manage challenge response:=>', response.payload);
        setSettingObject(response.payload[0]);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, sportName]);

  useEffect(() => {
    if (isFocused) {
      getSettings();
    }
  }, [getSettings, isFocused]);

  useEffect(() => {
    console.log(venue);
    if (isFocused) {
      entity = authContext.entity;
      if (groupObj) {
        setteams([{ ...entity.obj }, { ...groupObj }]);
        console.log('Home:::-', entity.obj);
        console.log('Away:::-', route.params.groupObj);
        setTeamData([{ ...entity.obj }, { ...route.params.groupObj }]);
      }
      if (
        route
        && route.params
        && route.params.body
        && ((route && route.params && route.params.editableAlter)
          || (route && route.params && route.params.editable))
      ) {
        if (route && route.params && route.params.editableAlter) {
          setEditableAlter(true);
        }
        bodyParams = { ...route.params.body };
        console.log('BODY::-', bodyParams);
        setteams([
          { ...route.params.body.home_team },
          { ...route.params.body.away_team },
        ]);
        setVenueTitle(route.params.body.venue.title);
        setVenueData(route.params.body.venue);
        getLatLongData(route.params.body.venue.address);
        setSport(route.params.body.sport);
        setsecureVenue(
          route.params.body.responsible_to_secure_venue
            === (entity.obj.group_name
              || `${entity.obj.first_name} ${entity.obj.last_name}`)
            ? 0
            : 1,
        );
        setVenue(
          (route.params.body.venue.venueType === 'HomeTeam' && 1)
            || (route.params.body.venue.venueType === 'AwayTeam' && 2)
            || (route.params.body.venue.venueType === 'other' && 0),
        );

        if (
          (route?.params?.body?.home_team?.user_id
            || route?.params?.body?.home_team?.group_id)
          === (entity.obj.user_id || entity.obj.group_id)
        ) {
          setTeamData([{ ...entity.obj }, { ...route.params.body.away_team }]);
        } else {
          setTeamData([{ ...entity.obj }, { ...route.params.body.home_team }]);
        }
      }
      if (route && route.params && route.params.venueObj) {
        getLatLongData(route.params.venueObj.description);
        setVenue(0);
        console.log('route.params.venueObj::=>', route.params.venueObj);
        bodyParams = {
          ...bodyParams,
          venue: route.params.venueObj,
        };
        setVenueData(route.params.venueObj);
      }

      if (route && route.params && route.params.from) {
        bodyParams = {
          ...bodyParams,
          start_datetime: new Date(route.params.from).getTime(),
          end_datetime: new Date(route.params.to).getTime(),
        };
      }
    }
  }, [isFocused]);

  const getLatLongData = (addressDescription) => {
    getLatLong(addressDescription, authContext).then((response) => {
      console.log('Lat/Long response::=>', response);
      setCordinate({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      });
      setRegion({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // const termLength = response.results[0].address_components.length;

      let cityObj, stateObj, countryObj;
      // eslint-disable-next-line array-callback-return
      response.results[0].address_components.map((e) => {
        if (e.types.includes('administrative_area_level_2')) {
          cityObj = e;
        }
        if (e.types.includes('administrative_area_level_1')) {
          stateObj = e;
        }
        if (e.types.includes('country')) {
          countryObj = e;
        }
      });
      setVenueData({
        ...venueData,
        address: addressDescription,
        venueType: 'other',
        lat: response.results[0].geometry.location.lat,
        long: response.results[0].geometry.location.lng,
        title: venueTitle,
        city: cityObj.long_name,
        state: stateObj.long_name,
        country: countryObj.long_name,
      });
    });
  };

const renderPeriod = ({ item, index }) => (
  <>
    <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
          title={'Interval'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
          containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
          title={ `${getNumberSuffix(index + 2)} Period`}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
  )

  const renderOverTime = ({ item, index }) => (
    <>
      <TCChallengeTitle
            containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
            title={'Interval'}
            titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
            containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
            title={ `${getNumberSuffix(index + 1)} Over time`}
            titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
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
    )
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      <View>
        <View
          style={{
            backgroundColor: colors.grayBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
              padding: 15,
            }}>
            {strings.inviteToChallengeText}
          </Text>
        </View>
        <ChallengeHeaderView
          challenger={teams[1]}
          challengee={teams[0]}
          role={
            route?.params?.role === 'user' || route?.params?.role === 'player'
              ? 'user'
              : 'team'
          }
        />

        <TCThickDivider marginTop={15} />

        <TCChallengeTitle
          title={'Type of Game'}
          value={settingObject?.game_type}
          tooltipText={
          'The game result has an effect on TC points of the challengee and you.'
          }
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameType', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Game Fee'}
          value={settingObject?.game_fee?.fee}
          staticValueText={`${settingObject?.game_fee?.currency_type} /Game`}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameFee', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Refund Policy'}
          value={settingObject?.refund_policy}
          tooltipText={
          '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
          }
          tooltipHeight={hp('18%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('RefundPolicy', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <TCThickDivider />
      </View>
      <View>
        <TCChallengeTitle
          title={'Home & Away'}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('HomeAway', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Home</Text>
          <View style={styles.teamViewStyle}>
            <Image
              source={
                settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.thumbnail
                    ? { uri: authContext?.entity?.obj?.thumbnail }
                    : authContext?.entity?.obj?.full_name
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                  : groupObj?.thumbnail
                  ? { uri: groupObj?.thumbnail }
                  : groupObj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.imageView}
            />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.full_name
                    ?? authContext?.entity?.obj?.group_name
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

        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Away</Text>
          <View style={styles.teamViewStyle}>
            <Image
            source={
              settingObject?.home_away === 'Home'
                ? groupObj?.thumbnail
                  ? { uri: groupObj?.thumbnail }
                  : groupObj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
                : authContext?.entity?.obj?.thumbnail
                ? { uri: authContext?.entity?.obj?.thumbnail }
                : authContext?.entity?.obj?.full_name
                ? images.profilePlaceHolder
                : images.teamPlaceholder
            }
             style={styles.imageView} />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? groupObj?.full_name ?? groupObj?.group_name
                  : authContext?.entity?.obj?.full_name
                    ?? authContext?.entity?.obj?.group_name}
              </Text>
              <Text style={styles.locationLable}>
                {settingObject?.home_away === 'Home'
                  ? `${groupObj?.city}, ${groupObj?.state_abbr}`
                  : `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`}
              </Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={20} />
      </View>
      <View>
        <TCChallengeTitle
          title={'Game Duration'}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameDuration', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
          title={'1st period'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
          value={settingObject?.game_duration?.first_period}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          staticValueText={'min.'}
        />
        {/* <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
          title={'Interval'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
          value={'35'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          staticValueText={'min.'}
        /> */}

        <FlatList
          data={settingObject?.game_duration?.period}
          renderItem={renderPeriod}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
        {settingObject?.game_duration?.period.length > 0 && <Text style={styles.normalTextStyle}>{strings.gameDurationTitle2}</Text>}

        <FlatList
          data={settingObject?.game_duration?.overtime}
          renderItem={renderOverTime}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
        <TCThickDivider marginTop={20} />

        <View>
          <TCChallengeTitle
            title={'Date & Time'}
            isEdit={true}
            onEditPress={() => Alert.alert('Edit Pressed')}
          />

          <View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}>Start </Text>
              <Text style={styles.dateTimeText}>Feb 17, 2020 12:00 pm</Text>
            </View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}>End </Text>
              <Text style={styles.dateTimeText}>Feb 17, 2020 12:00 pm</Text>
            </View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}> </Text>
              <Text style={styles.timeZoneText}>
                Time zone{' '}
                <Text style={{ fontFamily: fonts.RRegular }}>Vancouver</Text>
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChooseTimeSlotScreen');
            }}>
            <View style={[styles.borderButtonView, styles.shadowView]}>
              <View />
              <Text style={styles.detailButtonText}>{'CHOOSE DATE & TIME'}</Text>
              <Image
                source={images.arrowGraterthan}
                style={styles.arrowImage}
              />
            </View>
          </TouchableOpacity> */}
          <TCThickDivider marginTop={10} />
        </View>

        <View>
          <TCChallengeTitle
            title={'Venue'}
            isEdit={true}
            onEditPress={() => Alert.alert('Edit Pressed')}
          />

          {/* <Text style={styles.venueTitle}>Calgary stampede</Text>
            <View style={styles.venueContainer}>
              <Text style={styles.venueAddress}>
                555 Saddledome Rise SE, Calgary, AB T2G 2W1
              </Text>

              <EventMapView
              coordinate={cordinate}
              region={region}
              style={styles.map}
            />
            </View> */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChooseVenueScreen');
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
          <TCThickDivider marginTop={10} />
        </View>

        <TCChallengeTitle
          title={'Game Rules'}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <Text style={styles.venueTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>
          1. Tackle is not allowed 2. 3 times of 30 minute game for 90 minute
        </Text>
        <TCThickDivider marginTop={20} />

        <TCChallengeTitle
          title={'Referees'}
          value={'2'}
          staticValueText={'Referees'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <SecureRefereeView
          entityName={'Makani Team'}
          entity={'Referee'}
          entityNumber={1}
        />
        <TCThickDivider marginTop={20} />

        <TCChallengeTitle
          title={'Scorekeepers'}
          value={'2'}
          staticValueText={'Scorekeepers'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <SecureRefereeView
          entityName={'Kishan Team'}
          entity={'Scorekeeper'}
          entityNumber={1}
        />
        <TCThickDivider marginTop={20} />

        <TCLabel title={'Income'} style={{ marginBottom: 15 }} />
        <GameFeeCard />
        <TCThickDivider marginTop={20} />
      </View>

      <TCGradientButton
        title={strings.sendInviteTitle}
        onPress={() => {
          // navigation.push('ChallengePaymentScreen');
          navigation.push('InviteToChallengeSentScreen');
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
    shadowOffset: { width: 0, height: 1 },
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

  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
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
    shadowOffset: { width: 0, height: 1 },
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
});
