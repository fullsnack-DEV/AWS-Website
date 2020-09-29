import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TextInput, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {create} from 'apisauce';

import constants from '../../../config/constants';
const {strings, colors, fonts, urls, PATH} = constants;

import Separator from '../../../components/Separator';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import useApi from '../../../hooks/useApi';
import listing from '../../../api/listing';
import Loader from '../../../components/loader/Loader';
import styles from "./style"
function ChooseLocationScreen({navigation, route}) {
  const getCityList = useApi(listing.getCityList);
  const getTeamListing = useApi(listing.getTeamList);
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    this.getLocationData(searchText);
  }, [searchText]);

  getLocationData = (searchText) => {
    if (searchText.length >= 3) {
      getCityList.request(searchText);
      setNoData(false);
      setCityData(getCityList.data.predictions);
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  getTeamsData = (item) => {
    const queryParams = {
      state: item.terms[1].value,
      city: item.terms[0].value,
    };
    // let stringData = JSON.stringify(getTeamListing.data);
    // let teamList = await JSON.parse(stringData);
    // let length = getTeamListing.data.payload.length;

    console.log('CITY::', item.terms[0].value);
    console.log('STATE::', item.terms[1].value);
    try {
      getTeamListing.request(queryParams).then(() => {
        console.log('TEAM DATA::', getTeamListing.data);
        console.log('TEAM LENGTH::', getTeamListing.data.payload.length);

        navigation.navigate('TotalTeamsScreen', {
          city: item.terms[0].value,
          state: item.terms[1].value,
          country: item.terms[2].value,
          totalTeams: getTeamListing.data.payload.length,
          teamData: getTeamListing.data.payload,
        });
      });
    } catch (error) {
      alert('Error:', error);
    }
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => this.getTeamsData(item)}>
        <Text style={styles.cityList}>{cityData[index].description}</Text>

        <Separator />
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Loader visible={getTeamListing.loading} />
      <Image style={styles.background} source={PATH.orangeLayer} />
      <Image style={styles.background} source={PATH.bgImage} />
      <Text style={styles.LocationText}>{strings.locationText}</Text>

      <View style={styles.sectionStyle}>
        <Image source={PATH.searchLocation} style={styles.searchImg} />
        <TextInput
          style={styles.textInput}
          placeholder={strings.locationPlaceholderText}
          clearButtonMode="always"
          placeholderTextColor={colors.themeColor}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {noData && (
        <Text style={styles.noDataText}>
          Please enter 3 characters to see cities
        </Text>
      )}
      <FlatList
        data={cityData}
        renderItem={this.renderItem}
        keyExtractor={(cityData) => cityData.id}
      />
    </View>
  );
}


export default ChooseLocationScreen;
