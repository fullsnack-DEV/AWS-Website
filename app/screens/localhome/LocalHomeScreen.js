import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import LocationContext from '../../context/LocationContext';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import {widthPercentageToDP} from '../../utils';
import TCThinDivider from '../../components/TCThinDivider';
import LocalHomeScreenShimmer from '../../components/shimmer/localHome/LocalHomeScreenShimmer';
import {getUserSettings} from '../../api/Users';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import LocationModal from '../../components/LocationModal/LocationModal';
import {
  getExcludedSportsList,
  getSportDetails,
  getTitleForRegister,
} from '../../utils/sportsActivityUtils';
import {getSportsList} from '../../api/Games';
import EditFilterModal from './EditFilterModal';
import SportsListModal from '../account/registerPlayer/modals/SportsListModal';
import LocalHomeHeader from './LocalHomeHeader';
import TopTileSection from './TopTileSection';
import {
  getDataForNextScreen,
  getEventsAndSlotsList,
  getNotificationCountHome,
  getSportsForHome,
  LocalHomeQuery,
} from './LocalHomeUtils';
import LocalHomeMenuItems from './LocalHomeMenuItems';
import SwitchAccountModal from '../../components/account/SwitchAccountModal';

import BottomSheet from '../../components/modals/BottomSheet';

const defaultPageSize = 10;

function LocalHomeScreen({navigation, route}) {
  const refContainer = useRef();
  const listRef = useRef();
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const locationContext = useContext(LocationContext);
  const [loading, setloading] = useState(false);
  const [sports, setSports] = useState([]);
  const [customSports, setCustomSports] = useState([]);
  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  const [location, setLocation] = useState(
    authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
      authContext?.entity?.obj?.city?.slice(1),
  );
  const [selectedSport, setSelectedSport] = useState(strings.allType);
  const [sportType, setSportType] = useState(strings.allType);
  const [settingPopup, setSettingPopup] = useState(false);
  const [recentMatch, setRecentMatch] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [image_base_url, setImageBaseUrl] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [pointEvent] = useState('auto');
  const [locationSelectedViaModal, setLocationSelectedViaModal] =
    useState(false);
  const [filters, setFilters] = useState({
    sport: selectedSport,
    sport_type: sportType,
    location,
  });
  const [showBottomSheet, setBottomSheet] = useState(false);
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedMenuOptionType, setSelectedMenuOptionType] = useState(
    Verbs.entityTypePlayer,
  );
  const [sportsData, setSportsData] = useState([]);
  const [navigationOptions, setNavigationOptions] = useState({});
  const [visibleSportsModalForClub, setVisibleSportsModalForClub] =
    useState(false);
  const [visibleSportsModalForTeam, setVisibleSportsModalForTeam] =
    useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filterSetting] = useState({
    sort: 1,
    time: 0,
  });
  const [selectedOptions] = useState({
    option: 0,
    title: strings.all,
  });
  const [allUserData, setAllUserData] = useState([]);
  const [owners, setOwners] = useState([]);
  const [sportIconLoader, setSportIconLoader] = useState(false);
  const [cardLoader, setCardLoader] = useState(false);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: isFocused ? 'flex' : 'none',
      },
    });
  }, [navigation, isFocused]);

  useEffect(() => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      setSelectedSport(authContext.entity.obj.sport);
    }
  }, [
    authContext.entity.obj.sport,
    authContext.entity.role,
    showSwitchAccountModal,
  ]);

  useEffect(() => {
    const getEventdata = async () => {
      await getEventsAndSlotsList(
        authContext,
        setAllUserData,
        setOwners,

        filterSetting,
        selectedOptions,
        setFilterData,
        allUserData,
      );
    };
    getEventdata();
  }, [authContext]);

  useEffect(() => {
    if (isFocused) {
      locationContext.setSelectedLoaction(location);
      Utility.getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });

      LocalHomeQuery(
        location,
        defaultPageSize,
        selectedSport,
        sportType,
        authContext,
        setRecentMatch,
        setUpcomingMatch,
        setChallengeeMatch,
        setHiringPlayers,
        setLookingTeam,
        setReferees,
        setScorekeepers,
        setCardLoader,
      );
    }
  }, [
    authContext,
    selectedSport,
    location,
    sportType,
    setRecentMatch,
    setUpcomingMatch,
    setChallengeeMatch,
    setHiringPlayers,
    setLookingTeam,
    setReferees,
    setScorekeepers,
    isFocused,
    locationContext,
  ]);

  const ITEM_HEIGHT = Verbs.ITEM_HEIGHT;

  const localHomeMenu = [
    {
      key: strings.rankingInWorld,
      data: [],
      index: 0,
    },
    {
      key: strings.completedMatches,
      data: recentMatch,
      index: 1,
    },
    {
      key: strings.upcomingMatchesTitle,
      data: upcomingMatch,
      index: 2,
    },
    {
      key: strings.eventHometitle,
      data: filterData,
      index: 3,
    },
    {
      key: strings.teamAvailableforChallenge,
      data: challengeeMatch,
      index: 4,
    },
    {
      key: strings.playersAvailableforChallenge,
      data: challengeeMatch,
      index: 5,
    },
    {
      key: strings.refreesAvailable,
      data: referees,
      index: 6,
    },
    {
      key: strings.scorekeepersAvailable,
      data: scorekeepers,
      index: 7,
    },
    {
      key: strings.hiringPlayerTitle,
      data: hiringPlayers,
      index: 8,
    },
    {
      key: strings.lookingForTeamTitle,
      data: lookingTeam,
      index: 9,
    },
  ];

  useEffect(() => {
    if (isFocused) {
      const handleSetNotificationCount = (count) => {
        setNotificationCount(count);
      };

      getNotificationCountHome(authContext, handleSetNotificationCount);
      getUserSettings(authContext)
        .then(async (response) => {
          await Utility.setStorage('appSetting', response.payload.app);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    getSportsList(authContext).then(async (res) => {
      const sport = [];
      res.payload.map((item) =>
        sport.push({
          label: item.sport_name,
          value: item.sport_name.toLowerCase(),
        }),
      );

      setCustomSports([...sport]);
    });
  }, [authContext]);

  useEffect(() => {
    if (route.params?.locationText) {
      setLocation(route.params.locationText);
      setFilters({
        ...filters,
        location: route.params.locationText,
      });
    }
  }, [route.params?.locationText]);

  const setSportHandler = (data) => {
    setSports(data);
  };

  useEffect(() => {
    getSportsForHome(authContext, setSportHandler, sports, setSportIconLoader);
    setSelectedSport(strings.allType);
  }, [authContext.entity]);

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );
    setSportsData([...sportArr]);
  }, [authContext, selectedMenuOptionType, visibleSportsModal]);

  const editSportName = (line) => {
    const words = line?.split(' ');
    if (words?.length >= 2) {
      const secondWord = words[1];
      const truncatedSecondWord = secondWord.substring(0, 3);
      const modifiedSecondWord = `${truncatedSecondWord}...`;
      words[1] = modifiedSecondWord;
    }
    return words?.join(' ');
  };

  const renderSportName = useCallback(
    (item) => {
      let sportName = '';

      if (item.sport === strings.allType) {
        sportName = strings.allType;
      } else if (item.sport === strings.orText) {
        sportName = strings.orText;
      } else if (item.sport === strings.editType) {
        sportName = strings.editType;
      } else {
        sportName = editSportName(Utility.getSportName(item, authContext));
      }
      return sportName;
    },
    [authContext],
  );

  const renderImageforSport = useCallback(
    (item) => {
      if (item.sport === strings.allType) {
        return (
          <FastImage
            source={images.allSportIcon}
            style={{height: 25, width: 25, marginBottom: 10, marginTop: 5}}
          />
        );
      }
      if (item.sport === strings.editType) {
        return (
          <FastImage
            source={images.editIconHome}
            style={{height: 40, width: 40}}
          />
        );
      }
      const sportDetails = getSportDetails(
        item.sport,
        item.sport_type,
        authContext.sports,
      );
      const sportImage = sportDetails?.sport_image || '';

      return (
        <FastImage
          source={{uri: `${image_base_url}${sportImage}`}}
          style={{height: 40, width: 40}}
        />
      );
    },
    [authContext.sports, image_base_url],
  );

  const navigateToRefreeScreen = () => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      const data = getDataForNextScreen(
        'teamData',
        filters,
        location,
        selectedLocationOption,
        authContext,
      );

      navigation.navigate('RefereesListScreen', {
        filters: {
          location: data.location,
          locationOption: data.locationOption,
        },
        teamSportData: data.teamSportData,
      });
    } else {
      const data = getDataForNextScreen(
        'sportData',
        filters,
        location,
        selectedLocationOption,
        authContext,
      );
      navigation.navigate('RefereesListScreen', {
        filters: data,
      });
    }
  };

  const navigateToScoreKeeper = () => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      const data = getDataForNextScreen(
        Verbs.TEAM_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );
      navigation.navigate('ScorekeeperListScreen', {
        filters: {
          location: data.location,
          locationOption: data.locationOption,
        },
        teamSportData: data.teamSportData,
      });
    } else {
      const data = getDataForNextScreen(
        Verbs.SPORT_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );
      navigation.navigate('ScorekeeperListScreen', {
        filters: data,
      });
    }
  };

  const handleTileClick = (item) => {
    if (item.title === strings.bookRefreesHomeTile) {
      navigateToRefreeScreen();
    }
    if (item.title === strings.bookSckorekeeperHomeTile) {
      navigateToScoreKeeper();
    }
    if (item.title === strings.addTeamClub) {
      setBottomSheet(true);
    }
    if (item.title === strings.createEventhomeTitle) {
      navigation.navigate('Schedule', {
        screen: 'CreateEventScreen',
        params: {
          comeName: 'HomeScreen',
        },
      });
    }
    if (item.title === strings.inviteMemberClub) {
      navigation.navigate('InviteMembersBySearchScreen');
    }
  };

  const handlePress = useCallback(
    (item) => {
      listRef.current.scrollToOffset({offset: 0, animated: true});

      if (item.sport === strings.editType) {
        // Handle editType logic
      } else {
        setSelectedSport(item.sport);
        setSportType(item.sport_type);
        setFilters((prevState) => ({
          ...prevState,
          sport: item.sport,
          sport_type: item.sport_type,
        }));
      }
    },
    [setSelectedSport, setSportType, setFilters],
  );

  const SportsListView = ({item, index}) => (
    <Pressable
      onPress={() => handlePress(item, index)}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.whiteColor,
        borderBottomWidth:
          selectedSport === item.sport && sportType === item.sport_type
            ? 3
            : StyleSheet.hairlineWidth,
        borderBottomColor:
          selectedSport === item.sport && sportType === item.sport_type
            ? colors.themeColor
            : colors.whiteColor,
        marginHorizontal: 3,
      }}>
      {sportIconLoader ? (
        <ActivityIndicator
          style={styles.imgloaderStyle}
          size="small"
          color="#000000"
        />
      ) : (
        renderImageforSport(item)
      )}

      <Text
        style={
          selectedSport === item.sport && sportType === item.sport_type
            ? [
                styles.sportName,
                {
                  color: colors.themeColor,
                  fontFamily: fonts.RBold,
                },
              ]
            : styles.sportName
        }>
        {renderSportName(item)}
      </Text>
    </Pressable>
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const getLocation = () => {
    setloading(true);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((currentLocation) => {
        setloading(false);
        if (currentLocation.position) {
          setLocation(
            currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          );
          setFilters({
            ...filters,
            location:
              currentLocation.city?.charAt(0).toUpperCase() +
              currentLocation.city?.slice(1),
          });
          setSelectedLocationOption(0);
        }
      })
      .catch((e) => {
        setloading(false);
        if (e.message !== strings.userdeniedgps) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  };

  const handleSetLocationOptions = (locations) => {
    if ('address' in locations) {
      setLocation(locations?.address);
    } else {
      setLocation(locations?.city);
    }
    setLocationSelectedViaModal(true);
    setLocationPopup(false);
  };

  const getLayout = (_, index) => ({
    length: Verbs.ITEM_LENGTH,
    offset: Verbs.ITEM_LENGTH * index,
    index,
  });

  const SportList = () => (
    <FlatList
      ref={refContainer}
      style={{
        height: 74,
        backgroundColor: colors.whiteColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.veryLightGray,
      }}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      windowSize={21}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={[
        ...[
          {
            sport: strings.allType,
            sport_type: strings.allType,
            icon: images.allSportIcon,
          },
        ],
        ...sports.slice(0, 12),
        {
          sport: strings.editType,
          sport_type: strings.editType,
        },
      ]}
      keyExtractor={keyExtractor}
      renderItem={SportsListView}
      getItemLayout={getLayout}
    />
  );

  const RenderSportsListView = () => {
    if (authContext.entity.role === Verbs.entityTypeGame) {
      return SportList();
    }
    if (
      authContext.entity.role === Verbs.entityTypeTeam ||
      (authContext.entity.role === Verbs.entityTypeClub &&
        authContext.entity.obj.sports.length === 1)
    ) {
      return null;
    }

    return SportList();
  };

  const onRegisterAsTilePress = (item) => {
    setVisibleSportsModal(true);
    setSelectedMenuOptionType(item?.enityType);
    setNavigationOptions({
      screenName: item?.screenName,
      data: null,
    });
  };

  const getItemLayout = (d, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const setTeamModal = (val) => {
    setVisibleSportsModalForTeam(val);
  };

  const setClubModal = (val) => {
    setVisibleSportsModalForClub(val);
  };

  const LocalHeader = useMemo(() => (
    <LocalHomeHeader
      setShowSwitchAccountModal={() => setShowSwitchAccountModal(true)}
      setLocationpopup={() => setLocationPopup(true)}
      location={location}
      notificationCount={notificationCount}
      customSports={customSports}
    />
  ));

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <View
        pointerEvents={pointEvent}
        style={{
          opacity: authContext.isAccountDeactivated ? 0.5 : 1,
        }}>
        {/* screen Header */}

        {LocalHeader}

        <View style={styles.separateLine} testID="local-home-screen" />

        {/* sport list  */}
        {RenderSportsListView()}
      </View>

      {authContext.isAccountDeactivated && <TCAccountDeactivate />}

      {loading ? (
        <LocalHomeScreenShimmer />
      ) : (
        <View
          pointerEvents={pointEvent}
          style={{
            flex: 1,
            opacity: authContext.isAccountDeactivated ? 0.8 : 1,
          }}>
          {/* Flatlist  */}
          <FlatList
            data={localHomeMenu}
            ref={listRef}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListHeaderComponent={React.memo(
              (
                {index}, // Memoize TopTileSection
              ) => (
                <TopTileSection
                  key={index}
                  handleTileClick={handleTileClick}
                  visibleSportsModalForClub={visibleSportsModalForClub}
                  visibleSportsModalForTeam={visibleSportsModalForTeam}
                  onRegisterAsTilePress={onRegisterAsTilePress}
                  setSelectedMenuOptionType={(val) =>
                    setSelectedMenuOptionType(val)
                  }
                  setTeamModal={setTeamModal}
                  setClubModal={setClubModal}
                  setNavigationOptions={(obj) => setNavigationOptions(obj)}
                />
              ),
            )}
            renderItem={({item, index}) => (
              <LocalHomeMenuItems
                key={index}
                item={item}
                sports={sports}
                location={location}
                filter={filters}
                selectedLocationOption={selectedLocationOption}
                navigateToRefreeScreen={navigateToRefreeScreen}
                navigateToScoreKeeper={navigateToScoreKeeper}
                selectedSport={selectedSport}
                sportType={sportType}
                owners={owners}
                allUserData={allUserData}
                cardLoader={cardLoader}
              />
            )}
            getItemLayout={getItemLayout}
          />
        </View>
      )}

      <Modal
        onBackdropPress={() => setLocationPopup(false)}
        style={{
          margin: 0,
        }}
        isVisible={locationPopup}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}>
        <View style={styles.bottomPopupContainer}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setLocationPopup(false)}
              style={styles.cancelText}>
              {strings.cancel}
            </Text>
            <Text style={styles.locationText}>Location</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.setParams({locationText: null});
              getLocation();
              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 0 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.locationTitle}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>
                  {strings.locationTitle}
                </Text>
              </View>
            )}
          </TouchableWithoutFeedback>

          <LocationModal
            visibleLocationModal={visibleLocationModal}
            title={strings.cityStateOrCountryTitle}
            setVisibleLocationModalhandler={() =>
              setVisibleLocationModal(false)
            }
            onLocationSelect={handleSetLocationOptions}
            placeholder={strings.searchTitle}
            type={'country'}
          />

          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(1);
              setLocation(
                authContext.entity.obj.city?.charAt(0).toUpperCase() +
                  authContext.entity.obj.city?.slice(1),
              );
              setFilters({
                ...filters,
                location:
                  authContext.entity.obj.city?.charAt(0).toUpperCase() +
                  authContext.entity.obj.city?.slice(1),
              });
              navigation.setParams({locationText: null});
              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 1 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.myCityText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.cityText}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>{strings.cityText}</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelectedLocationOption(2);
              navigation.setParams({locationText: null});
              setLocation(strings.worldTitleText);
              setFilters({
                ...filters,
                location: strings.worldTitleText,
              });

              setTimeout(() => {
                setLocationPopup(false);
              }, 300);
            }}>
            {selectedLocationOption === 2 ? (
              <View style={styles.backgroundViewSelected}>
                <Text
                  style={[
                    styles.worldText,
                    {color: colors.orangeGradientColor},
                  ]}>
                  {strings.world}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.worldText}>{strings.world}</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <Text style={styles.orText}>{strings.OrCaps}</Text>

          {locationSelectedViaModal ? (
            <>
              {selectedLocationOption === 3 ? (
                <Pressable
                  onPress={() => {
                    setSelectedLocationOption(3);
                    setVisibleLocationModal(true);
                  }}
                  style={[
                    styles.backgroundViewSelected,
                    {alignItems: 'center'},
                  ]}>
                  <Text
                    style={[
                      styles.worldText,
                      {color: colors.orangeGradientColor},
                    ]}>
                    {location}
                  </Text>

                  <Text style={styles.chnageWordText}>
                    {strings.changecapital}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.backgroundView}
                  onPress={() => {
                    setSelectedLocationOption(3);
                    setVisibleLocationModal(true);
                  }}>
                  <Text style={styles.worldText}>{location}</Text>
                  <Text style={styles.chnageWordText}>
                    {strings.changecapital}
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <>
              <Pressable
                style={styles.sectionStyle}
                onPress={() => {
                  setSelectedLocationOption(3);
                  setVisibleLocationModal(true);
                }}>
                <Text style={styles.searchText}>{strings.searchTitle}</Text>
              </Pressable>
            </>
          )}
        </View>
      </Modal>

      {/* Edit Filter Modal */}

      <EditFilterModal
        visible={settingPopup}
        onClose={() => setSettingPopup(false)}
      />

      {/* Sport List Modal */}

      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={getTitleForRegister(selectedMenuOptionType)}
        sportsList={sportsData}
        onNext={(sport) => {
          setVisibleSportsModal(false);

          navigation.navigate('Account', {
            screen: navigationOptions.screenName,
            params: sport,
          });
        }}
      />

      {/* Switch Account Modal */}

      <SwitchAccountModal
        isVisible={showSwitchAccountModal}
        closeModal={() => setShowSwitchAccountModal(false)}
        onCreate={(option) => {
          setShowSwitchAccountModal(false);
          if (option === strings.team) {
            setSelectedMenuOptionType(Verbs.entityTypeTeam);
            setTimeout(() => setVisibleSportsModalForTeam(true), 1000);

            setNavigationOptions({
              screenName: 'CreateTeamForm1',
            });
          } else if (option === strings.club) {
            setNavigationOptions({
              screenName: 'CreateClubForm1',
            });
            setTimeout(() => setVisibleSportsModalForClub(true), 1000);
          } else {
            console.log({option});
          }
        }}
      />

      <BottomSheet
        optionList={[strings.createTeamText, strings.addTeamClub]}
        isVisible={showBottomSheet}
        closeModal={() => setBottomSheet(false)}
        onSelect={(option) => {
          setBottomSheet(false);
          if (option === strings.createTeamText) {
            setTimeout(() => setVisibleSportsModalForTeam(true), 200);
          }
        }}
        title={strings.create}
      />
    </SafeAreaView>
  );
}

export default React.memo(LocalHomeScreen);

const styles = StyleSheet.create({
  sportName: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
    lineHeight: 14,
  },

  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundViewSelected: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.orangeGradientColor,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    alignItems: 'center',
    justifyContent: 'center',
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

  chnageWordText: {
    fontSize: 12,
    position: 'absolute',
    right: 18,

    color: colors.userPostTimeColor,
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
    shadowOffset: {width: 0, height: 3},
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

  separateLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.veryLightGray,
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
  imgloaderStyle: {
    height: 25,
    width: 25,
    marginBottom: 10,
    marginTop: 5,
  },
});
