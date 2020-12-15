import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,

} from 'react-native';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context'
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import { searchGroups } from '../../api/Groups';
import searchLocation from '../../api/External';

export default function ChooseLocationScreen({ navigation }) {
  const authContext = useContext(AuthContext)
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocation(searchLocationText, authContext).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      }).catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.7);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  const getTeamsData = async (item) => {
    const queryParams = {
      state: item.terms[1].value,
      city: item.terms[0].value,
    };

    searchGroups(queryParams, authContext).then((response) => {
      if (response.payload.length > 0) {
        navigation.navigate('TotalTeamsScreen', {
          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
          totalTeams: response.payload.length,
          teamData: response.payload,
        });
      } else {
        navigation.navigate('ChooseSportsScreen', {

          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
        });
      }
    }).catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 0.7);
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
      <FlatList
        data={ cityData }
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
