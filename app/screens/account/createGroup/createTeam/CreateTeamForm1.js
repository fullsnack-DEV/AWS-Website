import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Dimensions,
  SafeAreaView,
  Keyboard,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import Modal from 'react-native-modal';

import TCGradientButton from '../../../../components/TCGradientButton';
import {getUserDoubleTeamFollower} from '../../../../api/Users';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';

import TCFormProgress from '../../../../components/TCFormProgress';

import TCThinDivider from '../../../../components/TCThinDivider';
import {getHitSlop, getSportName} from '../../../../utils';
import {
  searchCityState,
  searchLocationPlaceDetail,
} from '../../../../api/External';
import Verbs from '../../../../Constants/Verbs';
import styles from './style';

export default function CreateTeamForm1({navigation, route}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [sportsData, setSportsData] = useState([]);

  const [followersData, setFollowersData] = useState();

  const [parentGroupID, setParentGroupID] = useState();

  const [teamName, setTeamName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (isFocused) {
      getSports();

      if (route?.params?.clubObject) {
        setParentGroupID(route.params.clubObject.group_id);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
  }, [searchText]);

  const renderSports = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        setTimeout(() => {
          setVisibleSportsModal(false);
          if (
            item?.sport === Verbs.tennisSport &&
            item?.sport_type === Verbs.doubleSport &&
            authContext?.entity?.role ===
              (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ) {
            getUserDoubleTeamFollower(
              item?.sport,
              item?.sport_type,
              authContext,
            )
              .then((res) => {
                setFollowersData(res?.payload);
              })
              .catch((e) => {
                Alert.alert(strings.alertmessagetitle, e.message);
              });
          }
        }, 300);
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
          {sportsSelection?.sport === item?.sport ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      let filterFormat = [];
      if (authContext.entity.role === Verbs.entityTypeClub) {
        filterFormat = item.format.filter(
          (obj) =>
            obj.entity_type === Verbs.entityTypeTeam &&
            obj.sport_type !== Verbs.singleSport &&
            obj.sport_type !== Verbs.doubleSport,
        );
      } else {
        filterFormat = item.format.filter(
          (obj) => obj.entity_type === Verbs.entityTypeTeam,
        );
      }

      sportArr = [...sportArr, ...filterFormat];
      return null;
    });
    setSportsData([...sportArr]);
  };

  const nextOnPress = () => {
    const obj = {
      sport: sportsSelection.sport,
      sport_type: sportsSelection.sport_type,
      group_name: teamName,
      city,
      state_abbr: state,
      country,
      currency_type: authContext?.entity?.obj?.currency_type,
    };
    if (parentGroupID) {
      const tempIds = [];
      tempIds.push(parentGroupID);
      obj.parent_groups = tempIds;
    }

    if (
      sportsSelection.sport === Verbs.tennisSport &&
      sportsSelection.sport_type === Verbs.doubleSport &&
      authContext?.entity?.role ===
        (Verbs.entityTypeUser || Verbs.entityTypePlayer)
    ) {
      if (followersData?.length > 0) {
        navigation.navigate('CreateTeamForm2', {
          followersList: followersData,
          createTeamForm1: {
            ...obj,
          },
        });
      } else {
        Alert.alert(strings.noFollowersTocreateTeam);
      }
    } else {
      navigation.navigate('CreateTeamForm2', {
        createTeamForm1: {
          ...obj,
        },
      });
    }
  };

  const toggleLocationModal = () => {
    setVisibleLocationModal(!visibleLocationModal);
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

  const renderLocationItem = ({item}) => {
    console.log('Location item:=>', item);
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => getTeamsData(item)}>
        <Text style={styles.cityList}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={1} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          <TCLabel title={strings.SportsTextFieldTitle} required={false} />
          <TouchableOpacity onPress={() => setVisibleSportsModal(true)}>
            <View style={styles.searchView}>
              <TextInput
                testID="choose-sport"
                style={styles.searchTextField}
                placeholder={strings.selectSportPlaceholderPlayer}
                value={getSportName(sportsSelection, authContext)}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldView}>
          <TCLabel title={strings.teamNameTitle} required={false} />
          <TextInput
            testID="team-name-input"
            placeholder={strings.teamNamePlaceholder}
            style={styles.matchFeeTxt}
            maxLength={20}
            onChangeText={(text) => setTeamName(text)}
            value={teamName}></TextInput>
        </View>
        <View style={styles.fieldView}>
          <TCLabel title={strings.locationTitle} required={false} />
          <TouchableOpacity
            testID="choose-location-button"
            onPress={
              //   navigation.navigate('SearchLocationScreen', {
              //     comeFrom: 'CreateTeamForm1',
              //   })
              toggleLocationModal
            }>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={[styles.matchFeeTxt, {marginBottom: 5}]}
              value={location}
              editable={false}
              pointerEvents="none"></TextInput>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          isDisabled={!sportsSelection || teamName === '' || location === ''}
          title={strings.nextTitle}
          style={{marginBottom: 5}}
          onPress={nextOnPress}
        />
      </SafeAreaView>
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
              {strings.sportsTitleText}
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportsData}
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
              {strings.currentCityTitle}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.cityPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            <FlatList
              data={cityData.filter((obj) => obj.terms.length === 3)}
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
