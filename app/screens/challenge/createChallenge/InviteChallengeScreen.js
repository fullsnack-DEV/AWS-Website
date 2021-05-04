/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import TCThinDivider from '../../../components/TCThinDivider';

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

let entity = {};
let bodyParams = {};
export default function InviteChallengeScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [venue, setVenue] = useState(0);
  const [cordinate, setCordinate] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });

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

  useEffect(() => {
    bodyParams = {};
  }, []);
  useEffect(() => {
    console.log(venue);
    if (isFocused) {
      entity = authContext.entity;
      if (route && route.params && route.params.groupObj) {
        setteams([{ ...entity.obj }, { ...route.params.groupObj }]);
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

  return (
    <TCKeyboardView>
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
        <ChallengeHeaderView />

        <TCThickDivider marginTop={15} />

        <TCChallengeTitle
          title={'Type of Game'}
          value={'Official'}
          tooltipText={
          'The game result has an effect on TC points of the challengee and you.'
          }
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Game Fee'}
          value={'150'}
          staticValueText={'CAD /Game'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Refund Policy'}
          value={'Flexible'}
          tooltipText={
          '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
          }
          tooltipHeight={hp('18%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <TCThickDivider />
      </View>
      <View>
        <TCChallengeTitle
          title={'Home & Away'}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Home</Text>
          <View style={styles.teamViewStyle}>
            <Image source={images.teamPlaceholder} style={styles.imageView} />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>Kishan Team</Text>
              <Text style={styles.locationLable}>Surat, GJ</Text>
            </View>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Away</Text>
          <View style={styles.teamViewStyle}>
            <Image source={images.teamPlaceholder} style={styles.imageView} />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>Makani Team</Text>
              <Text style={styles.locationLable}>Mumbai, MH</Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={20} />
      </View>
      <View>
        <TCChallengeTitle
          title={'Game Duration'}
          isEdit={true}
          onEditPress={() => Alert.alert('Edit Pressed')}
        />
        <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
          title={'1st period'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
          value={'30'}
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
        />
        <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 20 }}
          title={'2nd period'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
          value={'25'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          staticValueText={'min.'}
        />
        <Text style={styles.normalTextStyle}>{strings.gameDurationTitle2}</Text>
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
        title={strings.sendInviteTitle }
        onPress={() => {
          // navigation.push('ChallengePaymentScreen');
          navigation.push('InviteToChallengeSentScreen');
        }}
        outerContainerStyle={{ marginBottom: 45 }}
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
