import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,

} from 'react-native';
import TimePicker from 'react-native-24h-timepicker';
import { getLatLong } from '../../../api/External';
import * as Utility from '../../../utils/index';
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

let entity = {};
export default function CreateChallengeForm1({ navigation, route }) {
  const timePicker = useRef();
  const [venue, setVenue] = useState(0)
  const [cordinate, setCordinate] = useState()
  const [teams, setteams] = useState([])
  const [region, setRegion] = useState()
  const [secureVenue, setsecureVenue] = useState(0)
  const [venueData, setVenueData] = useState({
    lat: null,
    long: null,
    title: null,
    address: null,
    venueType: null,

  })

  useEffect(() => {
    getAuthEntity();
    if (route && route.params && route.params.venueObj) {
      getLatLongData();
    }
  }, [])
  const getAuthEntity = async () => {
    entity = await Utility.getStorage('loggedInEntity');
    if (route && route.params && route.params.groupObj) {
      teams.push(entity.obj)
      teams.push(route.params.groupObj)
      setteams([...teams])
      console.log('TEAMS::', teams);
    }
  }
  const getLatLongData = async () => {
    getLatLong(route.params.venueObj.description).then((response) => {
      setCordinate({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      })
      setRegion({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      setVenueData({
        ...venueData, address: route.params.venueObj.description, venueType: 'other', lat: response.results[0].geometry.location.lat, long: response.results[0].geometry.location.lng,
      })
      console.log('LAT LONG::', JSON.stringify(response));
    });
  };
  const swapTeam = () => {
    setteams([teams[1], teams[0]])
  }
  return (

    (teams.length > 0
    && <TCKeyboardView>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
        <View style={styles.form4}></View>
        <View style={styles.form5}></View>
      </View>
      <View>
        <TCLabel title={`Match · ${teams[0].sport}`}/>
        <TCThickDivider/>
      </View>
      <View>
        <TCLabel title={'Home & Away'}/>
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>HOME</Text>
          <View style={styles.teamViewStyle}>
            <View style={styles.imageShadowView}>
              <Image source={teams[0].thumbnail ? teams[0].thumbnail : images.teamPlaceholder} style={styles.imageView}/>
            </View>
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>{teams[0].group_name}</Text>
              <Text style={styles.locationLable}>{teams[0].city}, {teams[0].state_abbr}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.swapContainer} onPress={() => swapTeam()}>
          <Image source={images.swapTeam} style={styles.swapImageStyle}/>
        </TouchableOpacity>
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>AWAY</Text>
          <View style={styles.teamViewStyle}>
            <View style={styles.imageShadowView}>
              <Image source={teams[1].thumbnail ? teams[1].thumbnail : images.teamPlaceholder} style={styles.imageView}/>
            </View>
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>{teams[1].group_name}</Text>
              <Text style={styles.locationLable}>{teams[1].city}, {teams[1].state_abbr}</Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={20}/>
      </View>
      <View>
        <TCLabel title={'Date & Time'} required={true}/>
        <View style={styles.viewContainer}>
          <TimePicker
          ref={timePicker}
          onCancel={() => timePicker.current.close()}
          onConfirm={(hour, minute) => {
            console.log('HHMM', hour, minute)
            timePicker.current.close()
          }}
          minuteInterval={5}
          minuteUnit={' min'}
        />
          <TCTouchableLabel
          title={'Choose Date & Time'}
          showNextArrow={true}

          onPress={() => navigation.navigate('ChooseDateTimeScreen')}/>
        </View>
        <TCThickDivider marginTop={20}/>
      </View>
      <View>
        <TCLabel title={'Venue'} required={true}/>
        <View style={styles.viewContainer}>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>{teams[0].group_name}’s home</Text>
            <TouchableOpacity onPress={() => {
              if (teams[0].home_address) {
                setVenue(1)
                setCordinate({
                  latitude: teams[0].homefield_address_latitude,
                  longitude: teams[0].homefield_address_longitude,
                })
                setRegion({
                  latitude: teams[0].homefield_address_latitude,
                  longitude: teams[0].homefield_address_longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                })
                setVenueData({
                  ...venueData,
                  address: teams[0].home_address,
                  title: `${teams[0].group_name}'s Home`,
                  venueType: 'HomeTeam',
                  lat: teams[0].homefield_address_latitude,
                  long: teams[0].homefield_address_longitude,
                })
              } else {
                Alert.alert('The venue of this team has\'t been determine yet. Please determine it first')
              }
            }}>
              <Image source={venue === 1 ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>{teams[1].group_name}’s home</Text>
            <TouchableOpacity onPress={() => {
              if (teams[1].home_address) {
                setVenue(2)
                setCordinate({
                  latitude: teams[1].homefield_address_latitude,
                  longitude: teams[1].homefield_address_longitude,
                })
                setRegion({
                  latitude: teams[1].homefield_address_latitude,
                  longitude: teams[1].homefield_address_longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                })
                setVenueData({
                  ...venueData,
                  address: teams[1].home_address,
                  title: `${teams[1].group_name}'s Home`,
                  venueType: 'AwayTeam',
                  lat: teams[1].homefield_address_latitude,
                  long: teams[1].homefield_address_longitude,
                })
              } else {
                Alert.alert('The venue of this team has\'t been determine yet. Please determine it first')
              }
            }}>
              <Image source={venue === 2 ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>Other place</Text>
            <TouchableOpacity onPress={() => setVenue(0)}>
              <Image source={venue === 0 ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
            </TouchableOpacity>
          </View>
          {venue === 0 && <TCTextField placeholder={'Venue name'} value={venueData.title && venueData.title} onChangeText={(text) => setVenueData({ ...venueData, title: text })} />}
          {venue === 0 && <TCTouchableLabel title={route && route.params && route.params.venueObj ? route.params.venueObj.description : 'Address'} style={{ marginTop: 10, marginBottom: 10 }} onPress={() => navigation.navigate('ChooseAddressScreen', { comeFrom: 'CreateChallengeForm1' })}/>}
        </View>
        <View style={styles.venueContainer}>
          <Text style={styles.venueTitle}>{(venue === 0 && venueData.title && venueData.title) || (venue === 1 && `${teams[0].group_name}'s Home`) || (venue === 2 && `${teams[1].group_name}'s Home`)}</Text>
          <Text style={styles.venueAddress}>{(venue === 0 && route && route.params && route.params.venueObj ? route.params.venueObj.description : 'Address') || (venue === 1 && teams[0].home_address) || (venue === 2 && teams[1].home_address)}</Text>

          <EventMapView coordinate={ cordinate}
          region={region}
          style = {styles.map}/>
        </View>
        <TCThickDivider marginTop={8}/>
      </View>
      <View>
        <TCLabel title={'Responsibility To Secure Venue'} required={true}/>
        <Text style={styles.responsibilityText}>Which team ought to secure and pay for the
          above venue for this game? </Text>
        <View style={styles.viewContainer}>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>{teams[0].group_name}’s home</Text>
            <TouchableOpacity onPress ={() => setsecureVenue(0)}>
              <Image source={secureVenue === 0 ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
            </TouchableOpacity>
          </View>

          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>{teams[0].group_name}’s home</Text>
            <TouchableOpacity onPress={() => setsecureVenue(1)}>
              <Image source={ secureVenue === 1 ? images.radioCheckGreenBG : images.radioUnselect} style={styles.radioSelectStyle}/>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.responsibilityNote}>
          The match fee doesn’t include the <Text style = {styles.responsibilityNoteMedium}>Match Place Fee, Referee Fee
          </Text> and <Text style = {styles.responsibilityNoteMedium}>Scorekeeper Fee.</Text> The match place, referees and
          scorekeepers should be secured by the team who has charge of
          them at its own expense.
        </Text>
      </View>
      <Text style={styles.smallTxt}>
        {' ('}<Text style={styles.mendatory}>{strings.star} </Text>
        {strings.requiredText}{')'}
      </Text>

      <TCGradientButton title={strings.nextTitle} onPress={() => navigation.navigate('CreateChallengeForm2')}/>
    </TCKeyboardView>)

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
    resizeMode: 'contain',
    borderRadius: 20,
  },
  swapImageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
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

});
