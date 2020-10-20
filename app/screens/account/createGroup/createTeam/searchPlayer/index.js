import React, { useState, useEffect, useLayoutEffect } from 'react';
import {

  View,
  Text,
  Image,
  TextInput,
  FlatList,

  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

// import constants from '../../../config/constants';
// const {strings, colors, fonts, urls, PATH} = constants;
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import PATH from '../../../../../Constants/ImagePath';
import strings from '../../../../../Constants/String';

import styles from './style';
import colors from '../../../../../Constants/Colors';
import * as Utility from '../../../../../utility/index';

function SearchPlayerScreen({ navigation, route }) {
  const [players, setPlayers] = useState([]);
  const [searchPlayers, setSearchPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  // const [searchText, searchFilterFunction] = useState('');

  useEffect(() => {
    getPlayerList();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Player ${route.params.player}`,
    });
  }, [navigation]);
  getPlayerList = async () => {
    const token = await Utility.getStorage('token');
    console.log('TOKEN IS:: ', token);
    const endPoint = GET_USERS;
    get(endPoint, JSON.parse(token)).then((response) => {
      if (response.status === true) {
        const arr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const tempData of response.payload) {
          tempData.isChecked = false;
          arr.push(tempData);
        }

        setPlayers(arr);
        setSearchPlayers(arr);
      }
    });
  };
  selectPlayer = (item) => {
    console.log('SELECTED ITEM RADIO ::', JSON.stringify(item));
    const arr = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tempData of players) {
      if (item.user_id === tempData.user_id) {
        tempData.isChecked = true;
        setSelectedPlayer(tempData);
        arr.push(tempData);
      } else {
        tempData.isChecked = false;
        arr.push(tempData);
      }
    }

    setPlayers(arr);
  };
  searchFilterFunction = (text) => {
    const results = searchPlayers.filter(
      (x) => x.first_name.includes(text) || x.last_name.includes(text),
    );
    setPlayers(results);
  };
  renderItem = ({ item }) => (
      <View>
          <View style={ styles.listItemContainer }>
              {item.thumbnail === '' && (
              <Image style={ styles.teamImg } source={ PATH.profilePlaceHolder } />
              )}
              {item.thumbnail !== '' && (
              <Image style={ styles.teamImg } source={ { uri: item.thumbnail } } />
              )}

              <View
            style={ {
              width: wp('72%'),
            } }>
                  <Text style={ styles.teamNameText }>
                      {item.first_name} {item.last_name}
                  </Text>
                  <Text style={ styles.cityText }>
                      {item.city},{item.state_abbr}
                  </Text>
              </View>
              <View style={ styles.radioButtonView }>
                  <TouchableWithoutFeedback onPress={ () => selectPlayer(item) }>
                      {item.isChecked && (
                      <Image source={ PATH.radioSelect } style={ styles.radioImage } />
                      )}
                      {!item.isChecked && (
                      <Image
                  source={ PATH.radioUnselect }
                  style={ styles.unSelectRadioImage }
                />
                      )}
                  </TouchableWithoutFeedback>
              </View>
          </View>

          <View style={ styles.separatorLine }></View>
      </View>
  );

  return (
      <View style={ styles.mainContainer }>
          <ScrollView>
              <View style={ styles.sectionStyle }>
                  <Image source={ PATH.searchLocation } style={ styles.searchImg } />
                  <TextInput
            style={ styles.textInput }
            placeholder={ strings.searchHereText }
            clearButtonMode="always"
            placeholderTextColor={ colors.grayColor }
            onChangeText={ (text) => searchFilterFunction(text) }
          />
              </View>
              <FlatList
          data={ players }
          keyExtractor={ (item) => item.user_id }
          renderItem={ this.renderItem }
        />
          </ScrollView>
          <TouchableOpacity
        onPress={ () => {
          if (route.params.player === 1) {
            navigation.navigate('CreateTeamForm1', {
              user: selectedPlayer,
              selectedPlayer: 1,
            });
          } else {
            navigation.navigate('CreateTeamForm1', {
              user: selectedPlayer,
              selectedPlayer: 2,
            });
          }
        } }>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.nextButton }>
                  <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
              </LinearGradient>
          </TouchableOpacity>
      </View>
  );
}

export default SearchPlayerScreen;
