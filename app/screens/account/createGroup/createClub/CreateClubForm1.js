/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCLabel from '../../../../components/TCLabel';
import TCThinDivider from '../../../../components/TCThinDivider';
import {getHitSlop, getSportName} from '../../../../utils';

export default function CreateClubForm1({navigation, route}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [sportList, setSportList] = useState([]);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsName, setSportsName] = useState('');

  useEffect(() => {
    getSports();
    if (route.params && route.params.city) {
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
      setLocation(
        `${route.params.city}, ${route.params.state}, ${route.params.country}`,
      );
    } else {
      setCity('');
      setState('');
      setCountry('');
      setLocation('');
    }
  }, [isFocused, route.params]);

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });

    const arr = [];
    for (const tempData of sportArr) {
      const obj = {};
      obj.entity_type = tempData.entity_type;
      obj.sport = tempData.sport;
      obj.sport_type = tempData.sport_type;
      obj.isChecked = false;
      arr.push(obj);
    }
    console.log('Sport array:=>', arr);
    setSportList(arr);
  };

  useEffect(() => {
    let sportText = '';
    console.log('selectedSports:=>', selectedSports);
    if (selectedSports.length > 0) {
      selectedSports.map((sportItem, index) => {
        sportText =
          sportText +
          (index ? ', ' : '') +
          getSportName(sportItem, authContext);
        return null;
      });
      setSportsName(sportText);
    }
  }, [authContext, selectedSports]);

  const isIconCheckedOrNot = ({item, index}) => {
    sportList[index].isChecked = !item.isChecked;
    setSportList([...sportList]);
  };

  const renderSports = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}
    >
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportList[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const toggleModal = () => {
    setVisibleSportsModal(!visibleSportsModal);
  };

  const onNextPressed = () => {
    console.log('selectedSports', selectedSports);
    const newArray = selectedSports.map((obj) => {
      delete obj.isChecked;
      delete obj.entity_type;
      return obj;
    });
    console.log('new sports:=>', newArray);
    const obj = {
      sports: newArray, // Object of sport
      sports_string: sportsName,
      group_name: clubName,
      city,
      state_abbr: state,
      country,
    };
    console.log('Form 1:=> ', obj);
    navigation.navigate('CreateClubForm2', {
      createClubForm1: {
        ...obj,
      },
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={1} />
      <ScrollView style={styles.mainContainer}>
        <View>
          <View style={styles.fieldView}>
            <TCLabel title={strings.clubNameTitle} />
            <TextInput
              placeholder={strings.clubNameplaceholder}
              style={styles.matchFeeTxt}
              maxLength={20}
              onChangeText={(text) => setClubName(text)}
              value={clubName}
            ></TextInput>
          </View>

          <View style={styles.fieldView}>
            <TCLabel title={strings.locationClubTitle} />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchLocationScreen', {
                  comeFrom: 'CreateClubForm1',
                })
              }
            >
              <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={styles.matchFeeTxt}
                value={location}
                editable={false}
                pointerEvents="none"
              ></TextInput>
            </TouchableOpacity>
          </View>
          <Text style={styles.fieldTitle}>
            {strings.SportsTextFieldClubTitle}
          </Text>
          <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
            <Text
              style={
                sportsName
                  ? styles.languageText
                  : styles.languagePlaceholderText
              }
              numberOfLines={50}
            >
              {sportsName || 'Sports'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft: 15}}>
          <Text style={styles.smallTxt}>{strings.createClubNotes}</Text>
        </View>

        <View style={{flex: 1}} />
      </ScrollView>
      <TCGradientButton
        isDisabled={clubName === '' || location === '' || sportsName === ''}
        title={strings.nextTitle}
        style={{marginBottom: 30}}
        onPress={onNextPressed}
      />

      <Modal
        isVisible={visibleSportsModal}
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}
      >
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}
            >
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}
            >
              Sports
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                setSelectedSports(filterChecked);
                toggleModal();
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fieldTitle: {
    marginTop: hp('2%'),

    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,

    color: colors.lightBlackColor,
  },
  fieldView: {
    marginTop: 15,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },

  smallTxt: {
    color: colors.grayColor,
    fontSize: wp('2.8%'),
    marginTop: hp('2%'),

    textAlign: 'left',
  },
  languageView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  languageText: {
    backgroundColor: colors.whiteColor,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  languagePlaceholderText: {
    backgroundColor: colors.whiteColor,
    color: colors.userPostTimeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },

  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
