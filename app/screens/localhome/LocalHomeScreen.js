import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';

import Modal from 'react-native-modal';
// import DraggableFlatList from 'react-native-draggable-flatlist';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import strings from '../../Constants/String';
import TCGameCard from '../../components/TCGameCard';
import { getSportsList } from '../../api/Games';

import { gameData } from '../../utils/constant';
import ShortsCard from '../../components/ShortsCard';
import { widthPercentageToDP } from '../../utils';
import TCChallengerCard from '../../components/TCChallengerCard';

import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';
import TCEntityView from '../../components/TCEntityView';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCThinDivider from '../../components/TCThinDivider';
import SportsListView from '../../components/localHome/SportsListView';
// import AuthContext from '../../auth/context';

let selectedSports = [];
export default function LocalHomeScreen({ navigation }) {
  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState([]);

  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  const [selectedSettingOption, setSelectedSettingOption] = useState();

  const [selectedPlace, setSelectedPlace] = useState('Soccer');
  const [settingPopup, setSettingPopup] = useState(false);

  const [sportsPopup, setSportsPopup] = useState(false);
  const [sportsListPopup, setSportsListPopup] = useState(false);
  // const [sportsSource, setSportsSource] = useState([
  //   'Soccer',
  //   'Baseball',
  //   'Basketball',
  //   'Tennis Single',
  //   'Tennis Double',
  // ]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    getSportsList(authContext)
      .then((response) => {
        const arr = [];
        for (const tempData of response.payload) {
          tempData.isChecked = false;
          arr.push(tempData);
        }
        setSports(arr);
        setTimeout(() => setloading(false), 1000);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext]);

  const isIconCheckedOrNot = useCallback(
    ({ item, index }) => {
      sports[index].isChecked = !item.isChecked;
      setSports([...sports]);
      selectedSports = sports.filter((e) => e.isChecked);
    },
    [sports],
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image source={images.townsCupIcon} style={styles.townsCupIcon} />
      ),
      headerTitle: () => (
        <TouchableOpacity
          style={styles.titleHeaderView}
          onPress={() => setLocationPopup(true)}
          hitSlop={{
            top: 15,
            bottom: 15,
            left: 15,
            right: 15,
          }}>
          <Text style={styles.headerTitle}>Vancuver</Text>
          <Image source={images.home_gps} style={styles.gpsIconStyle} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity>
            <Image source={images.home_search} style={styles.townsCupIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingPopup(true)}>
            <Image source={images.home_setting} style={styles.townsCupIcon} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const onSportSelect = ({ item }) => setSelectedPlace(item);
  const sportsListView = useCallback(
    ({ item }) => (
      <Text
        style={
          selectedPlace === item
            ? [
                styles.sportName,
                { color: colors.themeColor, fontFamily: fonts.RBlack },
              ]
            : styles.sportName
        }
        onPress={() => onSportSelect({ item })}>
        {item}
      </Text>
    ),
    [selectedPlace],
  );

  const renderSportsView = useCallback(
    ({ item, drag }) => (
      <View style={styles.sportsBackgroundView}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={images.gameGoal} style={styles.sportsIcon} />
          <Text
            style={styles.sportNameTitle}
            onPress={() => onSportSelect({ item })}>
            {item}
          </Text>
        </View>
        <TouchableOpacity onLongPress={drag} style={{ alignSelf: 'center' }}>
          <Image source={images.moveIcon} style={styles.moveIconStyle} />
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  const shortsListView = useCallback(() => <ShortsCard />, []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCRecentMatchCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderGameItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCGameCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderChallengerItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCChallengerCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderHiringPlayersItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderEntityListView = useCallback(
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView />
      </View>
    ),
    [],
  );

  const renderRefereesScorekeeperListView = useCallback(
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView showStar={true} />
      </View>
    ),
    [],
  );
  const renderSeparator = () => (
    <View
      style={{
        height: 50,
        width: 10,
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ActivityLoader visible={loading} />
      <View style={styles.sportsListView}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[
            'Soccer',
            'Baseball',
            'Basketball',
            'Tennis Single',
            'Tennis Double',
          ]}
          keyExtractor={keyExtractor}
          renderItem={sportsListView}
          style={{
            width: '100%',
            height: 50,
            alignContent: 'center',
          }}
        />
      </View>

      <ScrollView>
        <View>
          <TCTitleWithArrow
            title={strings.recentMatchesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('RecentMatchScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderRecentMatchItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
          {/* <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
          keyExtractor={keyExtractor}
          renderItem={renderRecentMatchItems}
          ItemSeparatorComponent={() => (<View
            style={{
              height: 50,
              width: 10,
            }}
          />)}
          style={{ marginLeft: 15 }}
        /> */}
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.upcomingMatchesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('UpcomingMatchScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderGameItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.shortsTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            keyExtractor={keyExtractor}
            renderItem={shortsListView}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.lookingForTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('LookingForChallengeScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderChallengerItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.hiringPlayerTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('HiringPlayerScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderHiringPlayersItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.lookingForTeamTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('LookingTeamScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderEntityListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.refereesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('RefereesListScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderRefereesScorekeeperListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.scorekeeperTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('ScorekeeperListScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderRefereesScorekeeperListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <Modal
          onBackdropPress={() => setLocationPopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={locationPopup}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setLocationPopup(false)}
                style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Location</Text>
              <Text style={styles.doneText}>{'    '}</Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableWithoutFeedback
              onPress={() => setSelectedLocationOption(0)}>
              {selectedLocationOption === 0 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text
                    style={[
                      styles.curruentLocationText,
                      { color: colors.whiteColor },
                    ]}>
                    Current location
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.curruentLocationText}>
                    Current location
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setSelectedLocationOption(1)}>
              {selectedLocationOption === 1 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.myCityText, { color: colors.whiteColor }]}>
                    Home city
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.myCityText}>Home city</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setSelectedLocationOption(2)}>
              {selectedLocationOption === 2 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.worldText, { color: colors.whiteColor }]}>
                    World
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.worldText}>World</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <Text style={styles.orText}>Or</Text>

            <TouchableOpacity
              style={styles.sectionStyle}
              onPress={() => {
                setLocationPopup(false);
                navigation.navigate('SearchCityScreen');
              }}>
              <Text style={styles.searchText}>{strings.searchTitle}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          onBackdropPress={() => setSettingPopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={settingPopup}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setSettingPopup(false)}
                style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Setting</Text>
              <Text
                style={styles.doneText}
                onPress={() => {
                  if (selectedSettingOption === 1) {
                    setSettingPopup(false);
                    setLocationPopup(true);
                  } else {
                    setSettingPopup(false);
                    setSportsPopup(true);
                  }
                }}>
                {'Done'}
              </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableWithoutFeedback
              onPress={() => setSelectedSettingOption(0)}>
              {selectedSettingOption === 0 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text
                    style={[
                      styles.curruentLocationText,
                      { color: colors.whiteColor },
                    ]}>
                    Sports
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.curruentLocationText}>Sports</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setSelectedSettingOption(1)}>
              {selectedSettingOption === 1 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.myCityText, { color: colors.whiteColor }]}>
                    Location
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.myCityText}>Location</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        <Modal
          onBackdropPress={() => setSportsPopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={sportsPopup}>
          <View style={[styles.bottomPopupContainer, { height: '80%' }]}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setSettingPopup(false)}
                style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Sports</Text>
              <Text
                style={styles.doneText}
                onPress={() => {
                  console.log('DONE::');
                }}>
                {'Done'}
              </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={[
                  'Soccer',
                  'Baseball',
                  'Basketball',
                  'Tennis Single',
                  'Tennis Double',
              ]}
              keyExtractor={keyExtractor}
              renderItem={renderSportsView}
              style={{
                width: '100%',
                alignContent: 'center',
                marginBottom: 15,
                paddingVertical: 15,
              }}
              // dragHitSlop={{
              //   top: 15,
              //   bottom: 15,
              //   left: 15,
              //   right: 15,
              // }}

              // onDragEnd={({ data }) => setSportsSource(data)}
            />
            <TouchableOpacity
              style={styles.addSportsView}
              onPress={() => {
                setSportsPopup(false);
                setSportsListPopup(true);
              }}>
              <Text style={styles.addSportsTitle}>Add or delete Sports</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          onBackdropPress={() => setSportsListPopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            flex: 1,
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={sportsListPopup}>
          <View style={[styles.bottomPopupContainer, { height: '80%' }]}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setSportsListPopup(false)}
                style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Add or delete Sports </Text>
              <Text
                style={styles.doneText}
                onPress={() => {
                  console.log('DONE::', selectedSports);
                }}>
                {'Apply'}
              </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <SportsListView sports={sports} onSelect={isIconCheckedOrNot} />
          </View>
        </Modal>
      </ScrollView>

    </View>
  );
}
const styles = StyleSheet.create({
  townsCupIcon: {
    resizeMode: 'cover',
    height: 30,
    width: 30,
    marginLeft: 15,
  },
  gpsIconStyle: {
    resizeMode: 'cover',
    height: 30,
    width: 30,
  },
  sportsIcon: {
    resizeMode: 'cover',
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  moveIconStyle: {
    resizeMode: 'cover',
    height: 13,
    width: 15,
    alignSelf: 'center',
    marginRight: 15,
  },
  titleHeaderView: {
    flexDirection: 'row',
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
  },
  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 15,
    color: colors.lightBlackColor,
  },
  sportName: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 15,
  },
  sportNameTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    // margin: 15,
  },
  addSportsTitle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
    // margin: 15,
    paddingHorizontal: 10,
  },
  sportsListView: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    marginBottom: 5,
    elevation: 5,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  sportsBackgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 40,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addSportsView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 25,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // width: widthPercentageToDP('86%'),
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 15,
  },
  orText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 15,
  },
  worldText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  doneText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,

  },
  sectionStyle: {
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.offwhite,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: widthPercentageToDP('86%'),
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignSelf: 'center',
    elevation: 2,
    marginBottom: 15,
  },
  searchText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
});
