import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getLatLong } from '../../../api/External';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import EventMapView from '../../../components/Schedule/EventMapView';
import AuthContext from '../../../auth/context';
import { getTimeDifForReservation } from '../../../utils/Time';
import TCChallengeTitle from '../../../components/TCChallengeTitle';

let entity = {};
let bodyParams = {};
export default function ChallengeScreen({ navigation, route }) {
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

  const getDateFormat = (dateValue) => moment(new Date(dateValue * 1000)).format('MMM DD, yy');
  const time_format = (d) => moment(new Date(d)).format('hh:mm A');

  const checkValidation = () => {
    if (
      (route?.params?.body?.start_datetime === null
        && route?.params?.body?.end_datetime === null)
      || (!bodyParams?.start_datetime && !bodyParams?.end_datetime)
    ) {
      Alert.alert('Towns Cup', 'Please choose start and end time.');
      return false;
    }
    if (venueData.title === null) {
      Alert.alert('Towns Cup', 'Venue title cannot be blank');
      return false;
    }
    if (venueData.address === null || venueData.address === '') {
      Alert.alert('Towns Cup', 'Venue address cannot be blank');
      return false;
    }
    return true;
  };

  const configureParams = () => {
    // if ((route && route.params && route.params.editable && route.params.body) || (route && route.params && route.params.editableAlter && route.params.body)) {
    //   bodyParams = { ...route.params.body }
    // }

    console.log('Venue Object:', route?.params?.venueObj);
    console.log('Venue Data:', venueData);
    const termLength = route?.params?.venueObj?.terms?.length;
    bodyParams.home_team = teams[0];
    bodyParams.away_team = teams[1];
    bodyParams.hourly_game_fee = route?.params?.groupObj?.game_fee;
    bodyParams.currency_type = route?.params?.groupObj?.currency_type || 'CAD';
    bodyParams.venue = {
      ...venueData,
      title: venueTitle || venueData.title,
      city:
        route?.params?.venueObj?.terms[termLength - 3]?.value
        || venueData?.city,
      state:
        route?.params?.venueObj?.terms[termLength - 2]?.value
        || venueData?.state,
      country:
        route?.params?.venueObj?.terms[termLength - 1]?.value
        || venueData?.country,
      lat: cordinate?.latitude,
      long: cordinate?.longitude,
    };
    bodyParams.sport = sport;
    bodyParams.responsible_to_secure_venue = secureVenue === 0
        ? teamData[0].group_name
          || `${teamData[0].first_name} ${teamData[0].last_name}`
        : teamData[1].group_name
          || `${teamData[1].first_name} ${teamData[1].last_name}`;

    console.log('FORM ! BODY PARAMS', bodyParams);
    return bodyParams;
  };

  return (
    teams.length > 0 && (
      <TCKeyboardView>
        <View>
          <View style={[styles.teamContainer, { marginTop: 15 }]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image source={images.teamPlaceholder} style={styles.imageView} />
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>Kishan Team</Text>
                <Text style={styles.locationLable}>Surat, GJ</Text>
                <Text style={styles.locationLable}>
                  TC Level 15 TC points 3,000
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <View style={[styles.borderButtonView, styles.shadowView]}>
              <View/>
              <Text style={styles.detailButtonText}>CHECK AVAILIBILITY</Text>
              <Image
                source={images.arrowGraterthan}
                style={styles.arrowImage}
              />
            </View>
          </TouchableOpacity>
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

          <TCChallengeTitle title={'Game Fee'} value={'150 CAD /Game'} />
          <TCThickDivider />

          <TCChallengeTitle
            title={'Refund Policy'}
            value={'Flexible'}
            tooltipText={
            '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
            }
            tooltipHeight={hp('18%')}
            tooltipWidth={wp('50%')}
          />
          <TCThickDivider />
        </View>
        <View>
          <TCLabel title={'Home & Away'} style={{ marginBottom: 10 }} />
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
          <TCLabel title={'Date & Time'} required={true} />
          <View style={styles.viewContainer}>
            {/* <TCTouchableLabel
              title={route && route.params && route.params.from ? `${route.params.from}` : 'Choose Date & Time'}
              showNextArrow={true}

              onPress={() => navigation.navigate('ChooseDateTimeScreen', { otherTeam: route.params.groupObj })}/> */}
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChooseDateTimeScreen', {
                    otherTeam: route.params.groupObj,
                    body: bodyParams,
                    team: {
                      home_team: entity.obj,
                      away_team: route?.params?.groupObj,
                    },
                  });
                }}
                style={styles.containerStyle}>
                <TextInput
                  placeholder={'Choose Date & Time'}
                  multiline={true}
                  textAlignVertical={'top'}
                  style={styles.textInput}
                  value={
                    bodyParams
                    && bodyParams.start_datetime
                    && bodyParams.end_datetime
                    && `${getTimeDifForReservation(
                      bodyParams.start_datetime * 1000,
                      bodyParams.end_datetime * 1000,
                    )}\n${getDateFormat(
                      bodyParams.start_datetime,
                    )}  ${time_format(
                      new Date(bodyParams.start_datetime * 1000),
                    )} - ${time_format(
                      new Date(bodyParams.end_datetime * 1000),
                    )}`
                  }
                  editable={false}
                  pointerEvents="none"
                />
                <Image style={styles.nextIconStyle} source={images.nextArrow} />
              </TouchableOpacity>
            </View>
          </View>
          <TCThickDivider marginTop={20} />
        </View>
        <View>
          <TCLabel
            title={'Venue'}
            required={false}
            style={{ marginBottom: 20 }}
          />

          <Text style={styles.venueTitle}>Calgary stampede</Text>
          <View style={styles.venueContainer}>
            <Text style={styles.venueAddress}>
              555 Saddledome Rise SE, Calgary, AB T2G 2W1
            </Text>

            <EventMapView
              coordinate={cordinate}
              region={region}
              style={styles.map}
            />
          </View>
          <TCThickDivider marginTop={8} />
        </View>

        <Text style={styles.smallTxt}>
          {' ('}
          <Text style={styles.mendatory}>{strings.star} </Text>
          {strings.requiredText}
          {')'}
        </Text>

        <TCGradientButton
          title={editableAlter ? strings.doneTitle : strings.nextTitle}
          onPress={() => {
            console.log('Before Body params::', bodyParams);
            if (checkValidation()) {
              if (route && route.params && route.params.editable) {
                navigation.push('CreateChallengeForm4', {
                  teamData: teams,
                  body: configureParams(),
                });
              } else if (editableAlter) {
                navigation.navigate('EditChallenge', {
                  challengeObj: {
                    ...bodyParams,
                    home_team: teams[0],
                    away_team: teams[1],
                    venue: { ...venueData, title: venueTitle || venueData.title },
                    sport,
                    responsible_to_secure_venue:
                      secureVenue === 0
                        ? teamData[0].group_name
                          || `${teamData[0].first_name} ${teamData[0].last_name}`
                        : teamData[1].group_name
                          || `${teamData[1].first_name} ${teamData[1].last_name}`,
                  },
                });
              } else {
                navigation.push('CreateChallengeForm2', {
                  teamData: teams,
                  body: configureParams(),
                });
              }
            }
          }}
        />
      </TCKeyboardView>
    )
  );
}

const styles = StyleSheet.create({
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form4: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form5: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },

  smallTxt: {
    color: colors.grayColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
    marginLeft: 15,
    marginTop: 10,
  },
  mendatory: {
    color: colors.redColor,
  },

  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  homeLableStyle: {
    flex: 0.12,
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flex: 0.88,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageShadowView: {
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
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
  swapImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'cover',
    marginLeft: 20,
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
  swapContainer: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  radioSelectStyle: {
    resizeMode: 'cover',
    height: 22,
    width: 22,
    marginRight: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginTop: 25,
  },
  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
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
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
  },
  responsibilityText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
  responsibilityNote: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.orangeNotesColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  responsibilityNoteMedium: {
    fontFamily: fonts.RMedium,
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
    marginHorizontal: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 3,
  },

  textInput: {
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.lightBlackColor,
  },
  nextIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 18,
    width: 12,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },
  downIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 12,
    width: 18,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
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
});
