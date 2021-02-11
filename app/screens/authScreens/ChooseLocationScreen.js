/* eslint-disable array-callback-return */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';

import { searchLocations, getLocationNameWithLatLong } from '../../api/External';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context'
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import { searchGroups } from '../../api/Groups';

export default function ChooseLocationScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  const [cityData, setCityData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState();
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  // const [locationPermissionResult, setLocationPermissionResult] = useState();
  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);
  useEffect(() => {
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log('Location Data::=>', JSON.stringify(position));
    //   },
    //   (error) => alert(JSON.stringify(error)),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    // );

    if (Platform.OS === 'android') {
      requestPermission();
    } else {
      getLocation();
    }
  }, []);

  const requestPermission = async () => {
    // const granted =
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]).then((result) => {
      console.log('Data :::::', JSON.stringify(result));
      if (
        result['android.permission.ACCESS_COARSE_LOCATION']
      && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      ) {
        getLocation();
        // this.setState({
        //   permissionsGranted: true,
        // });
      }
    }).catch((error) => {
      console.warn(error);
    })
  }

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        getLocationNameWithLatLong(position.coords.latitude, position.coords.longitude, authContext).then((res) => {
          console.log('Lat/long to address::=>', res.results[0].address_components);
          let stateAbbr, city, country
          res.results[0].address_components.map((e) => {
            if (e.types.includes('administrative_area_level_1')) {
              stateAbbr = e.short_name
            } else if (e.types.includes('administrative_area_level_2')) {
              city = e.short_name
            } else if (e.types.includes('country')) {
              country = e.long_name
            }
          })
          setCurrentLocation({ stateAbbr, city, country });
        })
        console.log(position.coords.latitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocations(searchLocationText).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      }).catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  const getTeamsDataByCurrentLocation = async () => {
    const queryParams = {
      state: currentLocation.stateAbbr,
      city: currentLocation.city,
    };

    searchGroups(queryParams, authContext).then((response) => {
      if (response.payload.length > 0) {
        navigation.navigate('TotalTeamsScreen', {
          city: currentLocation.city,
          state: currentLocation.stateAbbr,
          country: currentLocation.country,
          totalTeams: response.payload.length,
          teamData: response.payload,
        });
      } else {
        navigation.navigate('ChooseSportsScreen', {

          city: currentLocation.city,
          state: currentLocation.stateAbbr,
          country: currentLocation.country,
        });
      }
    }).catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const getTeamsData = async (item) => {
    const queryParams = {
      state: item.terms?.[1]?.value,
      city: item.terms?.[0]?.value,
    };

    searchGroups(queryParams, authContext).then((response) => {
      if (response.payload.length > 0) {
        navigation.navigate('TotalTeamsScreen', {
          city: item.terms?.[0]?.value,
          state: item.terms[1].value,
          country: item.terms?.[2]?.value,
          totalTeams: response.payload.length,
          teamData: response.payload,
        });
      } else {
        navigation.navigate('ChooseSportsScreen', {

          city: item.terms?.[0]?.value,
          state: item.terms?.[1]?.value,
          country: item.terms?.[2]?.value,
        });
      }
    }).catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => getTeamsData(item) }>
      <Text style={ styles.cityList }>{cityData[index].description}</Text>

      <Separator />
    </TouchableWithoutFeedback>
  );

  return (
    <View style={ styles.mainContainer }>
      {/* <Loader visible={getTeamListing.loading} /> */}
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />
      <Text style={ styles.LocationText }>{strings.locationText}</Text>

      <View style={ styles.sectionStyle }>
        <Image source={ images.searchLocation } style={ styles.searchImg } />
        <TextInput
          style={ styles.textInput }
          placeholder={ strings.locationPlaceholderText }
          clearButtonMode="always"
          placeholderTextColor={ colors.themeColor }
          onChangeText={ (text) => setSearchText(text) }
        />
      </View>
      {noData && (
        <Text style={ styles.noDataText }>
          Please enter 3 characters to see cities
        </Text>
      )}
      {currentLocation && <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => getTeamsDataByCurrentLocation() }>
        <View>
          <Text style={ [styles.cityList, { marginBottom: 3 }] }>{currentLocation.city}, {currentLocation.stateAbbr}, {currentLocation.country}</Text>
          <Text style={ styles.curruentLocationText }>Current Location</Text>
        </View>

        <Separator />
      </TouchableWithoutFeedback>}
      <FlatList
        data={ cityData}
        renderItem={ renderItem }
        keyExtractor={(index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.whiteColor,
    fontSize: wp('3%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    marginTop: wp('0%'),
    textAlignVertical: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  noDataText: {
    // alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 40,
    marginTop: 8,

    // marginTop: hp('1%'),
    // textAlign: 'center',
    // width: wp('55%'),
  },
  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),

    resizeMode: 'contain',
    width: wp('4%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: wp('8%'),
    marginBottom: wp('1%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    paddingLeft: 10,
  },
});
