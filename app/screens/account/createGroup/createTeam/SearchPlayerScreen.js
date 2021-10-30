import React, {
  useState, useEffect, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors'
import fonts from '../../../../Constants/Fonts'
import { getUserList } from '../../../../api/elasticSearch';

export default function SearchPlayerScreen({ navigation, route }) {
  const [players, setPlayers] = useState([]);
  const [searchPlayers, setSearchPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState({});

  useEffect(() => {
    getPlayerList();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Player ${route.params.player}`,
    });
  }, [navigation]);
  const getPlayerList = async () => {
    getUserList().then((response) => {
      const arr = [];
      for (const tempData of response) {
        tempData.isChecked = false;
        arr.push(tempData);
      }

      setPlayers(arr);
      setSearchPlayers(arr);
    }).catch((e) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };
  const selectPlayer = (item) => {
    const arr = [];
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
  const searchFilterFunction = (text) => {
    const results = searchPlayers.filter(
      (x) => x.first_name.includes(text) || x.last_name.includes(text),
    );
    setPlayers(results);
  };
  const renderItem = ({ item }) => (
    <View>
      <View style={ styles.listItemContainer }>
        {item.thumbnail === '' && (
          <Image style={ styles.teamImg } source={ images.profilePlaceHolder } />
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
              <Image source={ images.radioSelect } style={ styles.radioImage } />
            )}
            {!item.isChecked && (
              <Image
                  source={ images.radioUnselect }
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
          <Image source={ images.searchLocation } style={ styles.searchImg } />
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={ renderItem }
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
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    paddingLeft: 10,
  },
  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),
    resizeMode: 'contain',
    tintColor: colors.grayColor,
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

  teamNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBlack,
    fontSize: wp('4%'),
    marginLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('80%'),
  },
  cityText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('3.5%'),
    marginLeft: wp('4%'),

    textAlign: 'left',
    textAlignVertical: 'center',

    width: wp('70%'),
  },

  listItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
    paddingBottom: 15,
    paddingTop: 15,
  },
  teamImg: {
    alignSelf: 'center',
    borderRadius: 25,

    height: 50,
    resizeMode: 'stretch',
    width: 50,
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: wp('90%'),
  },
  radioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    // tintColor: colors.radioButtonColor,
    width: 22,
  },
  unSelectRadioImage: {
    alignSelf: 'center',
    height: 22,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 22,
  },
  radioButtonView: {
    flexDirection: 'row',
  },
  nextButton: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 45,
    marginBottom: 30,
    marginTop: wp('5%'),
    width: '90%',
  },
  nextButtonText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    marginVertical: 10,
  },
});
