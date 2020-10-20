import React, { useState, useEffect } from 'react';
import {

  View,
  Text,
  Image,
  TextInput,
  FlatList,

} from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PATH from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import Separator from '../../../../components/Separator';
import { searchLocationList } from '../../../../api/Authapi';
import styles from './style';
import colors from '../../../../Constants/Colors';

export default function SearchLocationScreen({ navigation, route }) {
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
        renderItem={ renderItem }
        keyExtractor={ cityData.id }
      />
      </View>
  );
}
