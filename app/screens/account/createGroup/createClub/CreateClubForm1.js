/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
} from 'react-native';

import Modal from 'react-native-modal';

import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCLabel from '../../../../components/TCLabel';
import TCThinDivider from '../../../../components/TCThinDivider';
import {getHitSlop, getSportName} from '../../../../utils';
import {
  searchCityState,
  searchLocationPlaceDetail,
} from '../../../../api/External';
import styles from './style';

export default function CreateClubForm1({navigation}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [sportList, setSportList] = useState([]);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsName, setSportsName] = useState('');

  const [cityData, setCityData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getSports();
  }, [isFocused]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
  }, [searchText]);

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
    setSportList(arr);
  };

  useEffect(() => {
    let sportText = '';
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
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
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

  const toggleLocationModal = () => {
    setVisibleLocationModal(!visibleLocationModal);
  };

  const onNextPressed = () => {
    const newArray = selectedSports.map((obj) => {
      delete obj.isChecked;
      delete obj.entity_type;
      return obj;
    });
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

  const getTeamsData = async (item) => {
    searchLocationPlaceDetail(item.place_id).then((response) => {
      if (response) {
        setCity(item?.terms?.[0]?.value ?? '');
        setState(item?.terms?.[1]?.value ?? '');
        setCountry(item?.terms?.[2]?.value ?? '');
        setLocation(
          `${item?.terms?.[0]?.value ?? ''}, ${
            item?.terms?.[1]?.value ?? ''
          }, ${item?.terms?.[2]?.value ?? ''}`,
        );
      }
      setVisibleLocationModal(false);
    });
  };

  const renderLocationItem = ({item, index}) => {
    console.log('Location item:=>', item);
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => getTeamsData(item)}>
        <Text style={styles.cityList}>{cityData[index].description}</Text>
      </TouchableOpacity>
    );
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
              value={clubName}></TextInput>
          </View>

          <View style={styles.fieldView}>
            <TCLabel title={strings.locationClubTitle} />
            <TouchableOpacity
              onPress={
                // navigation.navigate('SearchLocationScreen', {
                //   comeFrom: 'CreateClubForm1',
                // })
                toggleLocationModal
              }>
              <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={styles.matchFeeTxt}
                value={location}
                editable={false}
                pointerEvents="none"></TextInput>
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
              numberOfLines={50}>
              {sportsName || strings.sportsTitleText}
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
        }}>
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
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                setSelectedSports(filterChecked);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>
                {strings.apply}
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
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => setVisibleLocationModal(false)}
        onRequestClose={() => setVisibleLocationModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
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
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleLocationModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                setSelectedSports(filterChecked);
                toggleModal();
              }}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            <FlatList
              data={cityData}
              renderItem={renderLocationItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Keyboard.dismiss}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
