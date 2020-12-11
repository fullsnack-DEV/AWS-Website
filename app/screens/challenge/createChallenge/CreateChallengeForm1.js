import React, {
  useEffect, useState, useContext, useLayoutEffect,
} from 'react';
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
import { getLatLong } from '../../../api/External';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCTextField from '../../../components/TCTextField';
import EventMapView from '../../../components/Schedule/EventMapView';
import AuthContext from '../../../auth/context'

let entity = {};
let bodyParams = {};
export default function CreateChallengeForm1({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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

  const [venueData, setVenueData] = useState({
    lat: null,
    long: null,
    title: null,
    address: null,
    venueType: null,
  });

  useLayoutEffect(() => {

  }, [venueTitle])
  useEffect(() => {
    entity = authContext.entity

    if (route && route.params && route.params.groupObj) {
      setteams([{ ...entity.obj }, { ...route.params.groupObj }])
      setTeamData([{ ...entity.obj }, { ...route.params.groupObj }])
    }
    if ((route && route.params && route.params.body) && ((route && route.params && route.params.editableAlter) || (route && route.params && route.params.editable))) {
      if (route && route.params && route.params.editableAlter) {
        setEditableAlter(true)
      }
      bodyParams = route.params.body
      setteams([{ ...route.params.body.home_team }, { ...route.params.body.away_team }])
      setVenueData(route.params.body.venue)
      setsecureVenue(route.params.body.responsible_to_secure_venue === entity.obj.group_name ? 0 : 1)
      setVenue((route.params.body.venue.venueType === 'HomeTeam' && 1) || (route.params.body.venue.venueType === 'AwayTeam' && 2) || (route.params.body.venue.venueType === 'other' && 0))
      if (route.params.body.home_team.group_id === entity.obj.group_id) {
        setTeamData([{ ...entity.obj }, { ...route.params.body.away_team }])
      } else {
        setTeamData([{ ...entity.obj }, { ...route.params.body.home_team }])
      }
    }

    if (route && route.params && route.params.venueObj) {
      getLatLongData()
      setVenue(0)
      bodyParams = {
        ...bodyParams,
        venue: route.params.venueObj,
      }
      setVenueData(route.params.venueObj)
    }

    if (route && route.params && route.params.from) {
      bodyParams = {
        ...bodyParams,
        start_datetime: new Date(route.params.from).getTime(),
        end_datetime: new Date(route.params.to).getTime(),

      }
    }
  }, [isFocused]);

  const getLatLongData = () => {
    getLatLong(route.params.venueObj.description, authContext).then((response) => {
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
      setVenueData({
        ...venueData,
        address: route.params.venueObj.description,
        venueType: 'other',
        lat: response.results[0].geometry.location.lat,
        long: response.results[0].geometry.location.lng,
        title: venueTitle,
      });
      console.log('LAT LONG::', JSON.stringify(response));
    });
  };
  const swapTeam = () => {
    setteams([teams[1], teams[0]]);
  };
  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (from, to) => {
    let delta = Math.abs(
      new Date(from).getTime()
            - new Date(to).getTime(),
    ) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${hours} hours ${minutes} minutes`;
  };
  const tConvert = (timeString) => {
    const timeString12hr = new Date(
      `1970-01-01T${timeString}Z`,
    ).toLocaleTimeString(
      {},
      {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      },
    );
    return timeString12hr;
  };
  const time_format = (d) => {
    const hours = format_two_digits(d.getHours());
    const minutes = format_two_digits(d.getMinutes());
    const seconds = format_two_digits(d.getSeconds());
    return tConvert(`${hours}:${minutes}:${seconds}`);
  }
  const format_two_digits = (n) => (n < 10 ? `0${n}` : n)

  const checkValidation = () => {
    if (!route && !route.params && !route.params.from) {
      Alert.alert('Towns Cup', 'Please choose start and end time.');
      return false
    }
    if (venueData.title === '') {
      Alert.alert('Towns Cup', 'Venue title cannot be blank');
      return false
    }
    if (venueData.address === '') {
      Alert.alert('Towns Cup', 'Venue address cannot be blank');
      return false
    }
    return true
  };

  const configureParams = () => {
    if ((route && route.params && route.params.editable && route.params.body) || (route && route.params && route.params.editableAlter && route.params.body)) {
      bodyParams = { ...route.params.body }
    }
    bodyParams.home_team = teams[0]
    bodyParams.away_team = teams[1]
    bodyParams.venue = venueData
    bodyParams.sport = teamData[0].sport || teamData[1].sport
    bodyParams.responsible_to_secure_venue = secureVenue === 0 ? teamData[0].group_name || `${teamData[0].first_name} ${teamData[0].last_name}` : teamData[1].group_name || `${teamData[1].first_name} ${teamData[1].last_name}`

    console.log('FORM ! BODY PARAMS', bodyParams);
    return bodyParams
  }

  return (
    teams.length > 0 && (
      <TCKeyboardView>
        {!editableAlter && <View style={styles.formSteps}>
          <View style={styles.form1}></View>
          <View style={styles.form2}></View>
          <View style={styles.form3}></View>
          <View style={styles.form4}></View>
          <View style={styles.form5}></View>
        </View>}

        <View>
          <TCLabel title={`Match · ${teamData[0]?.sport || teamData[1]?.sport}`} />
          <TCThickDivider />
        </View>
        <View>
          <TCLabel title={'Home & Away'} />
          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>HOME</Text>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                  source={
                    teams[0].thumbnail
                      ? { uri: teams[0].thumbnail }
                      : images.teamPlaceholder
                  }
                  style={styles.imageView}
                />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>{teams[0].group_name || `${teams[0].first_name} ${teams[0].last_name}`}</Text>
                <Text style={styles.locationLable}>
                  {teams[0].city}, {teams[0].state_abbr}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.swapContainer}
            onPress={() => swapTeam()}>
            <Image source={images.swapTeam} style={styles.swapImageStyle} />
          </TouchableOpacity>
          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>AWAY</Text>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                  source={
                    teams[1].thumbnail
                      ? { uri: teams[1].thumbnail }
                      : images.teamPlaceholder
                  }
                  style={styles.imageView}
                />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>{teams[1].group_name || `${teams[1].first_name} ${teams[1].last_name}`}</Text>
                <Text style={styles.locationLable}>
                  {teams[1].city}, {teams[1].state_abbr}
                </Text>
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
                    otherTeam: route.params.groupObj || bodyParams,
                  })
                }}
                style={styles.containerStyle}>
                <TextInput
                  placeholder={'Choose Date & Time'}
                  multiline={true}
                  style={styles.textInput}
                  value={
                    (bodyParams && bodyParams.start_datetime && bodyParams.end_datetime
                      && `${getTimeDifferent(bodyParams.start_datetime, bodyParams.end_datetime)}\n${
                        monthNames[new Date(bodyParams.start_datetime).getMonth()]
                      } ${new Date(bodyParams.start_datetime).getDate()}, ${new Date(
                        bodyParams.start_datetime,
                      ).getFullYear()}  ${time_format(new Date(bodyParams.start_datetime))} - ${time_format(new Date(bodyParams.end_datetime))}`)
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
          <TCLabel title={'Venue'} required={true} />
          <View style={styles.viewContainer}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>{teamData[0].group_name || `${teamData[0].first_name} ${teamData[0].last_name}`}’s home</Text>
              <TouchableOpacity
                onPress={() => {
                  if (teamData[0].homefield_Address) {
                    setVenue(1);
                    setCordinate({
                      latitude: teamData[0].homefield_address_latitude,
                      longitude: teamData[0].homefield_address_longitude,
                    });
                    setRegion({
                      latitude: teamData[0].homefield_address_latitude,
                      longitude: teamData[0].homefield_address_longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    });
                    setVenueData({
                      ...venueData,
                      address: teamData[0].homefield_Address,
                      title: `${teamData[0].group_name}'s Home`,
                      venueType: 'HomeTeam',
                      lat: teamData[0].homefield_address_latitude,
                      long: teamData[0].homefield_address_longitude,
                    });
                  } else {
                    Alert.alert(
                      'The venue of this team has\'t been determine yet. Please determine it first',
                    );
                  }
                }}>
                <Image
                  source={
                    venue === 1
                      ? images.radioCheckGreenBG
                      : images.radioUnselect
                  }
                  style={styles.radioSelectStyle}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>{teamData[1].group_name || `${teamData[1].first_name} ${teamData[1].last_name}`}’s home</Text>
              <TouchableOpacity
                onPress={() => {
                  if (teamData[1].homefield_Address) {
                    setVenue(2);
                    setCordinate({
                      latitude: teamData[1].homefield_address_latitude,
                      longitude: teamData[1].homefield_address_longitude,
                    });
                    setRegion({
                      latitude: teamData[1].homefield_address_latitude,
                      longitude: teamData[1].homefield_address_longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    });
                    setVenueData({
                      ...venueData,
                      address: teamData[1].homefield_Address,
                      title: `${teamData[1].group_name}'s Home`,
                      venueType: 'AwayTeam',
                      lat: teamData[1].homefield_address_latitude,
                      long: teamData[1].homefield_address_longitude,
                    });
                  } else {
                    Alert.alert(
                      'The venue of this team has\'t been determine yet. Please determine it first',
                    );
                  }
                }}>
                <Image
                  source={
                    venue === 2
                      ? images.radioCheckGreenBG
                      : images.radioUnselect
                  }
                  style={styles.radioSelectStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>Other place</Text>
              <TouchableOpacity
                onPress={() => {
                  setVenue(0);
                  if (route && route.params && route.params.venueObj) {
                    getLatLongData()
                  }
                }}>
                <Image
                  source={
                    venue === 0
                      ? images.radioCheckGreenBG
                      : images.radioUnselect
                  }
                  style={styles.radioSelectStyle}
                />
              </TouchableOpacity>
            </View>
            {venue === 0 && (
              <TCTextField
                placeholder={'Venue name'}
                value={venueTitle}
                onChangeText={(text) => {
                  setVenueTitle(text)
                  setVenueData({ ...venueData, title: text })
                }
                }
              />
            )}
            {venue === 0 && (
              <TCTouchableLabel
              placeholder={'Address'}
                title={
                  route && route.params && route.params.venueObj
                    && route.params.venueObj.description

                }
                style={{ marginTop: 10, marginBottom: 10 }}
                onPress={() => navigation.navigate('ChooseAddressScreen', {
                  comeFrom: 'CreateChallengeForm1',
                })
                }
              />
            )}
          </View>
          <View style={styles.venueContainer}>
            <Text style={styles.venueTitle}>
              {(venue === 0 && venueData.title)
                || (venue === 1 && `${teamData[0].group_name}'s Home`)
                || (venue === 2 && `${teamData[1].group_name}'s Home`)}
            </Text>
            <Text style={styles.venueAddress}>
              {(venue === 0
                && route
                && route.params
                && route.params.venueObj
                && route.params.venueObj.description)
                || (venue === 1 && teamData[0].homefield_Address)
                || (venue === 2 && teamData[1].homefield_Address)}
            </Text>

            <EventMapView
              coordinate={cordinate}
              region={region}
              style={styles.map}
            />
          </View>
          <TCThickDivider marginTop={8} />
        </View>
        <View>
          <TCLabel title={'Responsibility To Secure Venue'} required={true} />
          <Text style={styles.responsibilityText}>
            Which team ought to secure and pay for the above venue for this
            game?{' '}
          </Text>
          <View style={styles.viewContainer}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>{teamData[0].group_name || `${teamData[0].first_name} ${teamData[0].last_name}`}’s home</Text>
              <TouchableOpacity onPress={() => setsecureVenue(0)}>
                <Image
                  source={
                    secureVenue === 0
                      ? images.radioCheckGreenBG
                      : images.radioUnselect
                  }
                  style={styles.radioSelectStyle}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.radioContainer}>
              <Text style={styles.radioText}>{teamData[1].group_name || `${teamData[1].first_name} ${teamData[1].last_name}`}’s home</Text>
              <TouchableOpacity onPress={() => setsecureVenue(1)}>
                <Image
                  source={
                    secureVenue === 1
                      ? images.radioCheckGreenBG
                      : images.radioUnselect
                  }
                  style={styles.radioSelectStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.responsibilityNote}>
            The match fee doesn’t include the{' '}
            <Text style={styles.responsibilityNoteMedium}>
              Match Place Fee, Referee Fee
            </Text>{' '}
            and{' '}
            <Text style={styles.responsibilityNoteMedium}>
              Scorekeeper Fee.
            </Text>{' '}
            The match place, referees and scorekeepers should be secured by the
            team who has charge of them at its own expense.
          </Text>
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
            if (checkValidation()) {
              if (route && route.params && route.params.editable) {
                navigation.navigate('CreateChallengeForm4', { teamData: teams, body: configureParams() })
              } else if (editableAlter) {
                navigation.navigate('AlterAcceptDeclineScreen', {
                  body: {
                    ...bodyParams,
                    home_team: teams[0],
                    away_team: teams[1],
                    venue: venueData,
                    sport: teamData[0].sport,
                    responsible_to_secure_venue: secureVenue === 0 ? teamData[0].group_name : teamData[1].group_name,
                  },
                })
              } else {
                navigation.navigate('CreateChallengeForm2', { teamData: teams, body: configureParams() })
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
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  homeLableStyle: {
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
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
  },
  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginTop: 5,
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
});
