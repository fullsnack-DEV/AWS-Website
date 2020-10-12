import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import Separator from '../../../components/Separator';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Loader from '../../../components/loader/Loader';
import styles from './style';
import colors from '../../../Constants/Colors';
import {searchLocationList, searchGroupList} from '../../../api/Authapi';

function ChooseLocationScreen({navigation, route}) {
  const [cityData, setCityData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    this.getLocationData(searchText);
  }, [searchText]);

  getLocationData = async (searchText) => {
    console.log('search Text', searchText);

    if (searchText.length >= 3) {
      searchLocationList(searchText).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };

  getTeamsData = async (item) => {
    const queryParams = {
      state: item.terms[1].value,
      city: item.terms[0].value,
    };

    searchGroupList(queryParams).then((response) => {
      if (response.status == true) {
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
        alert('Towns Cup', response.messages);
      }
    });
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
      {/* <Loader visible={getTeamListing.loading} /> */}
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
