import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,

} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context'
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import { searchVenue } from '../../../api/External';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts'
import TCNoDataView from '../../../components/TCNoDataView';

export default function ChooseAddressScreen({ navigation, route }) {
  const authContext = useContext(AuthContext)
  const [cityData, setCityData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVenue, setSelectedVenue] = useState()

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => {
          if (selectedVenue) {
            console.log('VENUE::', JSON.stringify(selectedVenue));
            venueData()
          }
        }}>Done</Text>
      ),
    });
  }, [navigation, selectedVenue, cityData]);

  const getLocationData = async (searchLocationText) => {
    searchVenue(searchLocationText, authContext).then((response) => {
      // eslint-disable-next-line array-callback-return
      response.predictions.map((e) => {
        e.isSelected = false;
      });
      setCityData(response.predictions);
    });
  };

  const venueData = async () => {
    if (route.params.comeFrom === 'CreateChallengeForm1') {
      navigation.navigate('CreateChallengeForm1', {
        venueObj: selectedVenue,
      });
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => {
          // eslint-disable-next-line no-param-reassign

          if (cityData.indexOf(item) !== -1) {
            console.log('DATA MATCH');

            // eslint-disable-next-line array-callback-return
            cityData.map((e) => {
              if (e === item) {
                setSelectedVenue(item)
                e.isSelected = true
              } else {
                e.isSelected = false
              }
            });
            setCityData([...cityData])
          }
          // getTeamsData(item)
        } }>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
        <Text style={ styles.cityList } numberOfLines={1}>{cityData[index].description}</Text>
        <Image source={ cityData[index].isSelected && images.radioCheckGreenBG} style={{ height: 20, width: 20, alignSelf: 'center' }}/>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={ styles.mainContainer }>

      <View style={ styles.sectionStyle }>
        <Image source={ images.searchLocation } style={ styles.searchImg } />
        <TextInput
          style={ styles.textInput }
          placeholder={ strings.searchHereText }
          clearButtonMode="always"
          placeholderTextColor={ colors.lightgrayColor }
          onChangeText={ (text) => setSearchText(text) }
        />
      </View>

      {cityData.length > 0 ? <FlatList
        data={ cityData }
        renderItem={ renderItem }
        keyExtractor={(item, index) => index.toString()}
      /> : <TCNoDataView title={'No Venue Found'}/>}
    </View>
  );
}
const styles = StyleSheet.create({

  cityList: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('80%'),

  },
  //   listItem: {
  //     flexDirection: 'row',
  //     marginLeft: wp('10%'),
  //     width: wp('80%'),
  //     justifyContent: 'center',
  //     // backgroundColor: 'red',
  //   },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),
    tintColor: colors.lightgrayColor,
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
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
