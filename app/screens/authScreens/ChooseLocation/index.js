import React, { useState, useEffect } from 'react';
import {

  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,

} from 'react-native';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import Separator from '../../../components/Separator';

import styles from './style';
import colors from '../../../Constants/Colors';

import { searchLocationList, searchGroupList } from '../../../api/Authapi';

function ChooseLocationScreen({ navigation }) {
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocationList(searchLocationText).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
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

    searchGroupList(queryParams).then((response) => {
      if (response.status === true) {
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
      } else {
        Alert.alert('Towns Cup', response.messages);
      }
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
        keyExtractor={ (item) => item.id }
      />
    </View>
  );
}

export default ChooseLocationScreen;
