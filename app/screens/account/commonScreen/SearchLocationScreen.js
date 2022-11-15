import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Separator from '../../../components/Separator';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {
  searchCityState,
  searchLocationPlaceDetail,
} from '../../../api/External';

export default function SearchLocationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchCityState(searchLocationText).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  const onSelectLocation = async (item) => {
    searchLocationPlaceDetail(item.place_id, authContext).then((response) => {
      console.log('route.params.comeFrom', route.params.comeFrom)
      if (response) {
        if (route.params.comeFrom === 'CreateEventScreen') {
          navigation.navigate('CreateEventScreen', {
            locationName: item.description,
            locationDetail: response.result.geometry.location,
          });
        } else if (route.params.comeFrom === 'EditEventScreen') {
          navigation.navigate('EditEventScreen', {
            locationName: item.description,
            locationDetail: response.result.geometry.location,
          });
        } else if (route.params.comeFrom === 'HomeScreen') {
          navigation.navigate('HomeScreen', {
            locationName: item.description,
            locationDetail: response.result.geometry.location,
            locationCity: item.structured_formatting.main_text,
          });
        } else if (route.params.comeFrom === 'CreateTeamForm1') {
          navigation.navigate('CreateTeamForm1', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'CreateClubForm1') {
          navigation.navigate('CreateClubForm1', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'PersonalInformationScreen') {
          navigation.navigate('PersonalInformationScreen', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'EditPersonalProfileScreen') {
          navigation.navigate(route.params.comeFrom, {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'EditGroupProfileScreen') {
          navigation.navigate('EditGroupProfileScreen', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'CreateMemberProfileForm1') {
          navigation.navigate('CreateMemberProfileForm1', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'EditMemberBasicInfoScreen') {
          navigation.navigate('EditMemberBasicInfoScreen', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        } else if (route.params.comeFrom === 'RequestBasicInfoScreen') {
          navigation.navigate('RequestBasicInfoScreen', {
            city: item?.terms?.[0]?.value ?? '',
            state: item?.terms?.[1]?.value ?? '',
            country: item?.terms?.[2]?.value ?? '',
          });
        }
      }
    });
  };

  const renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => onSelectLocation(item)}>
      <Text style={styles.cityList}>{cityData[index].description}</Text>
      <Separator />
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <Text style={styles.LocationText}>{strings.locationText}</Text>
      <View style={styles.sectionStyle}>
        <Image source={images.searchLocation} style={styles.searchImg} />
        <TextInput
          testID="choose-location-input"
          style={styles.textInput}
          placeholder={strings.locationPlaceholderText}
          clearButtonMode="always"
          placeholderTextColor={colors.themeColor}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {noData && (
        <Text style={styles.noDataText}>{strings.enterThreeCharText}</Text>
      )}
      <FlatList
        data={cityData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Keyboard.dismiss}
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
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginTop: hp('1%'),

    textAlign: 'center',
    width: wp('55%'),
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
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    paddingLeft: 10,
  },
});
