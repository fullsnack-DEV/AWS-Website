import React, { useState, useEffect } from 'react';
import {

  View,
  Text,
  Image,
  TextInput,
  FlatList,

} from 'react-native';

// import constants from '../../../config/constants';
// const {strings, colors, fonts, urls, PATH} = constants;
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PATH from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import Separator from '../../../../components/Separator';

import styles from './style';
import colors from '../../../../Constants/Colors';

function SearchLocationScreen({ navigation, route }) {
  const [cityData, setCityData] = useState([]);
  const [noData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    this.getLocationData(searchText);
  }, [searchText]);

  getLocationData = async (location, token) => {
    // if (searchText.length >= 3) {
    //   getCityList.request(searchText);
    //   setNoData(false);
    //   setCityData(getCityList.data.predictions);
    // } else {
    //   setNoData(true);
    //   setCityData([]);
    // }

    console.log('search Text', location);
    let headers;

    if (token === '' || token === null || token === undefined) {
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
    } else {
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      };
    }
    const completeUrl = Url.GET_LOCATION + location;
    console.log('completeUrl.........', completeUrl);

    const response = await fetch(completeUrl, {
      method: 'GET',
      headers,
    });

    const res = await response.json();
    console.log('ressssssponsse.................', res);
    setCityData(res.predictions);

    return res;
  };

  getTeamsData = async (item) => {
    // const queryParams = {
    //   state: item.terms[1].value,
    //   city: item.terms[0].value,
    // };
    const state = item.terms[1].value;
    console.log('state', state);
    const city = item.terms[0].value;
    console.log('city', city);
    // let stringData = JSON.stringify(getTeamListing.data);
    // let teamList = await JSON.parse(stringData);
    // let length = getTeamListing.data.payload.length;

    console.log('CITY::', item.terms[0].value);
    console.log('STATE::', item.terms[1].value);
    try {
      await Service.get(
        `${Url.GROUP_SEARCH}state=${state}&city=${city}`,
      );

      if (route.params.comeFrom === 'CreateTeamForm1') {
        navigation.navigate('CreateTeamForm1', {
          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
        });
      } else if (route.params.comeFrom === 'CreateClubForm1') {
        navigation.navigate('CreateClubForm1', {
          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
        });
      } else if (route.params.comeFrom === 'PersonalInformationScreen') {
        navigation.navigate('PersonalInformationScreen', {
          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
        });
      }
    } catch (error) {
      // alert('Error:', error);
    }
  };

  renderItem = ({ item, index }) => (
      <TouchableWithoutFeedback
        style={ styles.listItem }
        onPress={ () => this.getTeamsData(item) }>
          <Text style={ styles.cityList }>{cityData[index].description}</Text>

          <Separator />
      </TouchableWithoutFeedback>
  );

  return (
      <View style={ styles.mainContainer }>
          {/* <Loader visible={getTeamListing.loading} /> */}
          <Image style={ styles.background } source={ PATH.orangeLayer } />
          <Image style={ styles.background } source={ PATH.bgImage } />
          <Text style={ styles.LocationText }>{strings.locationText}</Text>

          <View style={ styles.sectionStyle }>
              <Image source={ PATH.searchLocation } style={ styles.searchImg } />
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
        renderItem={ this.renderItem }
        keyExtractor={ cityData.id }
      />
      </View>
  );
}

export default SearchLocationScreen;
