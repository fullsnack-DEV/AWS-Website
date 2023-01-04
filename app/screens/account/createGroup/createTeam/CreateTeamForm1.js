import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Text,
  Dimensions,
  SafeAreaView,
  Keyboard,
  Platform,
  Linking,
  Pressable,
  KeyboardAvoidingView
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import Modal from 'react-native-modal';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  searchCityState,
  searchNearByCityState
} from '../../../../api/External';

import { getPlaceNameFromPlaceID, getGeocoordinatesWithPlaceName} from '../../../../utils/location';

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
import ActivityLoader from '../../../../components/loader/ActivityLoader';
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
  const [homeCity, setHomeCity] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [nearbyCities, setNearbyCities] = useState([]);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getSports();

      if (route?.params?.clubObject) {
        setParentGroupID(route.params.clubObject.group_id);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (searchText.length >= 3) {
      searchCityState(searchText)
        .then((response) => {
          setNoData(false);
          setCityData(
            response.predictions
          );
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      setNoData(true);
      setCityData([]);
    }
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
    if(!visibleLocationModal){
      setLoading(true);
      setUserDeniedLocPerm(false);      
      setSearchText('');
      setCityData([]);
      getGeocoordinatesWithPlaceName(Platform.OS)
        .then((location) => {
          setLocationFetch(true);
          if(location.position){
            setCurrentLocation(location);
            getNearbyCityData(
              location.position.coords.latitude,
              location.position.coords.longitude,
              100,
            );
          }
          else{
            setLoading(false);
            setCurrentLocation(null);
            setVisibleLocationModal(!visibleLocationModal);
          }
        })
        .catch((e) => {
          setLoading(false);
          setLocationFetch(true);
          if(e.name === Verbs.gpsErrorDeined){
            setCurrentLocation(null);
            setUserDeniedLocPerm(true);
          }
          else{
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, `${e.message}(Location fetch`);
            }, 10);
          }
          setVisibleLocationModal(!visibleLocationModal);
        });
    }
    else{
      setVisibleLocationModal(!visibleLocationModal);
    }

  };

  const renderLocationItem = ({item}) => (
    <Pressable      
      onPress={() => onSelectLocation(item)}>
      <View style={locationModelStyles.listItem}>
        <Text style={locationModelStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModelStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocationItem = ({item}) => (
    <Pressable    
      onPress={() => {onSelectNearByLocation(item)}}>
      <View style={locationModelStyles.listItem}>
        <Text style={locationModelStyles.cityText }>{[item.city, item.state, item.country]
        .filter((v) => v)
        .join(', ')}</Text>
      </View>
      <View style={locationModelStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocation = () => {
    let renderData
    if(currentLocation && currentLocation.city){
      renderData =  (<Pressable
        onPress={() => onSelectCurrentLocation()}>
        <View style={locationModelStyles.listItemCurrentLocation}>
          <Text style={locationModelStyles.cityText}>
            {[
            currentLocation?.city,
            currentLocation?.state,
            currentLocation?.country,
            ].filter((v) => v)
            .join(', ')}</Text>
          <Text style={locationModelStyles.curruentLocationText}>
            {strings.currentLocationText}
          </Text>
        </View>
        <View style={locationModelStyles.itemSeprater} />
      </Pressable>)
    }
    else{
      renderData =  <View/>
    }
    return renderData
  }

  const getNearbyCityData = (lat, long, radius) => {
    searchNearByCityState(radius, lat, long)
      .then((response) => {
        const list = response.filter(
          (obj) => !(obj.city === currentLocation?.city && obj.country === currentLocation?.country)
        );
        setNearbyCities(list);
        setLoading(false);
        setVisibleLocationModal(!visibleLocationModal);
      })
      .catch((e) => {
        setLoading(false);
        setNearbyCities([]);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, `${e.message}(getNearbyCityData),${lat},${long},${radius}`);
        }, 10);
        setVisibleLocationModal(!visibleLocationModal);
      });
  };

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((location) => {
      setLoading(false);
      if (location) {
        setCity(location.city);
        setState(location.state);
        setCountry(location.country);
        setHomeCity(
          [
            location.city,
            location.state,
            location.country,
            ].filter((v) => v)
            .join(', ')
        );
      }
      toggleLocationModal();
    });
};

  const onSelectCurrentLocation = async () => {
    setCity(currentLocation?.city);
    setState(currentLocation?.state);
    setCountry(currentLocation?.country);
    setHomeCity(
      [
        currentLocation?.city,
        currentLocation?.state,
        currentLocation?.country,
      ]
        .filter((v) => v)
        .join(', '),
    );
    toggleLocationModal();
  };

  const onSelectNoCurrentLocation = async () => {
    if(userDeniedLocPerm){
        Alert.alert(
          strings.locationSettingTitleText,
          strings.locationSettingText,
          [
            {
              text: strings.cancel,
              style: 'cancel',
            },
            {
              text: strings.settingsTitleText,
              onPress: () => { 
                if(Platform.OS === 'ios'){
                  Linking.openURL('app-settings:')
                }
                else{
                  Linking.openSettings();
                }
              }
            },
          ],
        );
    }
    else{
      Alert.alert(
        strings.noGpsErrorMsg,
        '',
        [
          {
            text: strings.OkText,
            style: 'cancel',
          },
        ],
      );
    }
  };

  const onSelectNearByLocation = async (item) => {
    setCity(item.city);
    setState( item.state);
    setCountry(item.country);
    setHomeCity(
      [
        item.city,
        item.state,
        item.country,
        ].filter((v) => v)
        .join(', ')
    );
    toggleLocationModal();
};

  return (
    <>
      <ActivityLoader visible={loading} />
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
          <TCLabel title={strings.homeCityTitleText} required={false} />
          <TouchableOpacity
            testID="choose-location-button"
            onPress={toggleLocationModal}>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={[styles.matchFeeTxt, {marginBottom: 5}]}
              value={homeCity}
              editable={false}
              pointerEvents="none"></TextInput>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}} />
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          isDisabled={!sportsSelection || teamName === '' || homeCity === ''}
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
        <KeyboardAvoidingView
        behavior='position'
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 3,
            maxHeight:Dimensions.get('window').height / 3,
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
        </KeyboardAvoidingView>
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
        <KeyboardAvoidingView
        behavior='height'
        enabled={false}
          style={[locationModelStyles.mainView, {flex:1}]}
          >
        
          <View
            style={locationModelStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text
              style={locationModelStyles.headerText}>
              {strings.homeCityTitleText}
            </Text>
            <View style={{paddingTop:20,height:'100%',}}>
              <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={locationModelStyles.closeButton}
              onPress={() => setVisibleLocationModal(false)}>
                <Image
                source={images.cancelImage}
                style={[locationModelStyles.closeButton,{marginLeft:0, marginRight:0}]}
              />
              </TouchableOpacity>
            </View>
            
          </View>
          <View style={locationModelStyles.separatorLine} />
          <View>
            <View style={locationModelStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModelStyles.searchTextInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {noData && searchText.length > 0 && (
              <Text style={locationModelStyles.noDataText}>{strings.enter3CharText}</Text>
            )}
            {noData && searchText.length === 0 && nearbyCities.length >= 0 && cityData.length === 0 && (
              <FlatList
                style={{marginTop:25}}
                data={nearbyCities}
                renderItem={renderCurrentLocationItem}
                ListHeaderComponent={renderCurrentLocation}
                keyExtractor={(index) => index.toString()}
              />
            )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <TouchableWithoutFeedback
                  style={styles.noLocationViewStyle}
                  onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={locationModelStyles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                  </View>
                  <View style={locationModelStyles.itemSeprater} />
                  <Text
                    style={[locationModelStyles.currentLocationTextStyle, {marginTop: 15}]}>
                    {strings.noLocationText}
                  </Text>
                </TouchableWithoutFeedback>
              )}
            {cityData.length > 0 && (
              <FlatList
                style={{marginTop:10}}
                data={cityData.filter((obj) => obj.terms.length === 3)}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const locationModelStyles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: Dimensions.get('window').height - 50,
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
  },
  headerView:{
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height:50,
  },
  headerText:{
    alignSelf: 'center',
    paddingTop:18,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  separatorLine: {
    // alignSelf: 'center',
    backgroundColor: colors.thinDividerColor,
    height: 1,
    width: '100%',
  },
  searchSectionStyle: {
    backgroundColor: colors.textFieldBackground,
    marginTop:25,
    marginHorizontal:15,
    borderRadius: 20,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 10,
  },
  searchTextInput: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 15,
  },
  noDataText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    marginLeft: 30,
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight:25,
    // backgroundColor:'#ADF234',
    // justifyContent:'center',
    paddingHorizontal:6,
    alignItems:'center',
    height:52
  },
  listItemCurrentLocation: {
    flexDirection: 'column',
    marginLeft: 25,
    marginRight:25,
    // backgroundColor:'#ADF234',
    // justifyContent:'center',
    paddingHorizontal:6,
    alignItems:'baseline',
    height:52
  },
  cityText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
  },
  itemSeprater:{ 
    backgroundColor: colors.grayBackgroundColor, 
    height: 1,
    marginLeft:25,
    marginRight:25
  },
  currentLocationTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    marginBottom:14,
    marginTop : 40,
    marginLeft: 35,
    marginRight: 35,
  },
  curruentLocationText: {
    color: colors.userPostTimeColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
  },
});