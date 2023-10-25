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
  BackHandler,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import LocationContext from '../../context/LocationContext';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import * as Utility from '../../utils';
import {widthPercentageToDP} from '../../utils';
import LocalHomeScreenShimmer from '../../components/shimmer/localHome/LocalHomeScreenShimmer';
import {getUserDetails, getUserSettings} from '../../api/Users';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
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
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import InviteMemberModal from '../../components/InviteMemberModal';
import {getGroupDetails} from '../../api/Groups';

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

  const [selectedLocationOption, setSelectedLocationOption] = useState(1);
  const [location, setLocation] = useState(
    authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
      authContext?.entity?.obj?.city?.slice(1),
  );
  const [selectedSport, setSelectedSport] = useState(
    authContext.entity.obj.sport,
  );
  const [sportType, setSportType] = useState();
  const [settingPopup, setSettingPopup] = useState(false);
  const [recentMatch, setRecentMatch] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);

  const [image_base_url, setImageBaseUrl] = useState('');
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  // const [pointEvent] = useState('auto');
  const [locationSelectedViaModal, setLocationSelectedViaModal] =
    useState(false);
  const [filters, setFilters] = useState({});
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
  const [sportIconLoader, setSportIconLoader] = useState(true);
  const [cardLoader, setCardLoader] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderTopSportBar = useCallback(async () => {
    try {
      if (authContext.entity.role !== Verbs.entityTypeTeam) {
        const [userSport] = await Promise.all([
          authContext.entity.role !== Verbs.entityTypeClub
            ? getUserDetails(authContext.entity.uid, authContext)
            : getGroupDetails(authContext.entity.uid, authContext),
        ]);

        getSportsForHome(
          userSport,
          authContext,
          setSportHandler,
          sports,
          setSportIconLoader,
        );
        setSportIconLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [authContext, sports]);

  // pull to refresh
  const handleRefresh = async () => {
    locationContext.setSelectedLoaction(location);
    Utility.getStorage('appSetting')
      .then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      })
      .catch((e) => {
        console.log(e);
      });

    await LocalHomeQuery(
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
    setSportIconLoader(true);

    renderTopSportBar();

    setIsRefreshing(false);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(strings.holdOn, strings.doYouWantToExit, [
        {
          text: strings.cancel,
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: strings.yes,
          onPress: () => BackHandler.exitApp(),
          style: 'destructive',
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      setSelectedSport(authContext.entity.obj.sport);
      setSportType(authContext.entity.obj.sport_type);
    }
    if (
      authContext.entity.role === Verbs.entityTypeUser ||
      authContext.entity.role === Verbs.entityTypePlayer
    ) {
      setSelectedSport(strings.all);
      setSportType(strings.allSport);

      return;
    }
    if (
      authContext.entity.role === Verbs.entityTypeClub &&
      authContext.entity.obj?.sports?.length !== 1
    ) {
      setSelectedSport(strings.all);
      setSportType(strings.allSport);
    }
  }, [
    authContext.entity.obj.sport,
    authContext.entity.obj.sport_type,
    authContext.entity.obj?.sports?.length,
    authContext.entity.role,
    showSwitchAccountModal,
  ]);

  useEffect(() => {
    setFilters({
      sport: selectedSport,
      sport_type: sportType,
      location,
    });
  }, [location, selectedSport, sportType]);
  const memoizedLocalHomeQuery = useMemo(() => LocalHomeQuery, []);

  useFocusEffect(
    React.useCallback(() => {
      Utility.getStorage('appSetting')
        .then((setting) => {
          setImageBaseUrl(setting.base_url_sporticon);
        })
        .catch((e) => {
          console.log(e);
        });
      listRef.current.scrollToOffset({offset: 0, animated: true});
      locationContext.setSelectedLoaction(location);
    }, [location, locationContext]),
  );

  const getEventdata = useMemo(
    () => async () => {
      await getEventsAndSlotsList(
        authContext,
        setAllUserData,
        setOwners,
        filterSetting,
        selectedOptions,
        setFilterData,
        allUserData,
      );
    },
    [
      authContext,
      setAllUserData,
      setOwners,
      filterSetting,
      selectedOptions,
      setFilterData,
      allUserData,
    ],
  );

  useEffect(() => {
    getEventdata();
  }, [isFocused]);

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
    renderTopSportBar();
  }, [authContext]);

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
    getSportsList(authContext)
      .then(async (res) => {
        const sport = [];
        res.payload.map((item) =>
          sport.push({
            label: item.sport_name,
            value: item.sport_name.toLowerCase(),
          }),
        );

        setCustomSports([...sport]);
      })
      .catch((e) => {
        console.log(e);
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
    // remove duplicate Items
    const filteredData = data.filter(
      (item) => item.sport !== undefined && item.sport_type !== undefined,
    );

    setSports(filteredData);
  };

  useEffect(() => {
    const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
    sportArr.sort((a, b) =>
      a.sport_name.normalize().localeCompare(b.sport_name.normalize()),
    );
    setSportsData([...sportArr]);
  }, [authContext, selectedMenuOptionType, visibleSportsModal]);

  const scrollToFirstItem = () => {
    if (refContainer.current) {
      refContainer.current.scrollToIndex({index: 0});
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (
        selectedSport !== undefined &&
        sportType !== undefined &&
        selectedSport !== null &&
        sportType !== null
      ) {
        memoizedLocalHomeQuery(
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
    }
  }, [
    isFocused,
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
    memoizedLocalHomeQuery,
    authContext,
  ]);

  // Call the scrollToFirstItem function when data changes
  useEffect(() => {
    scrollToFirstItem();
  }, [settingPopup]);

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
          <>
            {selectedSport === item.sport && sportType === item.sport_type ? (
              <FastImage
                resizeMode="cover"
                source={images.allSportOrangeIcon}
                style={{
                  height: 43,
                  width: 43,
                  top: 1,
                }}
              />
            ) : (
              <FastImage
                source={images.allSportIcon}
                style={styles.allSportIconStyle}
              />
            )}
          </>
        );
      }
      if (item.sport === strings.editType) {
        return (
          <FastImage
            source={images.editIconHome}
            style={styles.editIconstyel}
          />
        );
      }

      const sportDetails = getSportDetails(
        item.sport,
        item.sport_type,
        authContext.sports,
      );

      const sportImage = sportDetails?.sport_image || '';
      const sportOrangeImage = sportDetails?.sport_image_orange || '';

      return (
        <View>
          {sportImage.length < 1 || image_base_url === '' ? (
            <View style={{paddingHorizontal: 5}}>
              <ActivityIndicator
                style={styles.sportIconStyle}
                color={colors.orangeGradientColor}
              />
            </View>
          ) : (
            <>
              <FastImage
                source={{
                  uri:
                    selectedSport === item.sport &&
                    sportType === item.sport_type
                      ? `${image_base_url}${sportOrangeImage}`
                      : `${image_base_url}${sportImage}`,
                }}
                style={styles.sportIconStyle}
              />
            </>
          )}
        </View>
      );
    },
    [authContext.sports, image_base_url, selectedSport, sportType],
  );

  const navigateToRefreeScreen = () => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      const data = getDataForNextScreen(
        Verbs.TEAM_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );

      navigation.navigate('LocalHomeStack', {
        screen: 'RefereesListScreen',
        params: {
          filters: data.filters,
          teamSportData: data.teamSportData,
        },
      });
    } else {
      const data = getDataForNextScreen(
        Verbs.SPORT_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );

      navigation.navigate('LocalHomeStack', {
        screen: 'RefereesListScreen',
        params: {
          filters: data,
        },
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
      navigation.navigate('LocalHomeStack', {
        screen: 'ScorekeeperListScreen',
        params: {
          filters: data.filters,
          teamSportData: data.teamSportData,
        },
      });
    } else {
      const data = getDataForNextScreen(
        Verbs.SPORT_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );
      navigation.navigate('LocalHomeStack', {
        screen: 'ScorekeeperListScreen',
        params: {
          filters: data,
        },
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
        screen: 'EventScheduleScreen',
        params: {
          comeName: 'LocalHomeScreen',
        },
      });
      return;
    }
    if (item.title === strings.createevents) {
      navigation.navigate('Schedule', {
        screen: 'CreateEventScreen',
        params: {
          comeName: 'LocalHomeScreen',
        },
      });
    }
    if (item.title === strings.inviteMemberClub) {
      setShowInviteMember(true);
    }
  };

  const handlePress = useCallback(
    (item) => {
      listRef.current.scrollToOffset({offset: 0, animated: true});

      if (item.sport === strings.editType) {
        setSettingPopup(true);
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
    <TouchableOpacity
      disabled={authContext.isAccountDeactivated}
      onPress={() => handlePress(item, index)}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: authContext.isAccountDeactivated ? 0.5 : 1,
        height: 70,
        backgroundColor: colors.whiteColor,
        borderBottomWidth:
          selectedSport === item.sport && sportType === item.sport_type
            ? 3
            : StyleSheet.hairlineWidth,
        borderBottomColor:
          selectedSport === item.sport && sportType === item.sport_type
            ? colors.themeColor
            : colors.whiteColor,
      }}>
      {sportIconLoader ? (
        <ActivityIndicator
          style={styles.sportIconStyle}
          color={colors.orangeGradientColor}
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
    </TouchableOpacity>
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
    setSelectedLocationOption(3);
  };

  const getLayout = (_, index) => ({
    length: Verbs.ITEM_LENGTH,
    offset: Verbs.ITEM_LENGTH * index,
    index,
  });

  const SportList = () => (
    <>
      <FlatList
        ref={refContainer}
        extraData={settingPopup}
        style={{
          height: 70,
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
    </>
  );

  const RenderSportsListView = () => {
    if (authContext.entity.role === Verbs.entityTypeUser) {
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

  const setJoinTeamModalvisible = () => {
    navigation.navigate('LocalHomeStack', {
      screen: 'JoinTeamScreen',
      params: {
        locations: location,
        sport: selectedSport,
      },
    });
  };
  const setClubModalVisible = () => {
    navigation.navigate('LocalHomeStack', {
      screen: 'JoinClubScreen',
      params: {
        locations: location,
        sport: selectedSport,
        sporttype: sportType,
        sport_name: selectedSport,
      },
    });
  };

  const LocalHeader = useMemo(
    () => (
      <LocalHomeHeader
        setShowSwitchAccountModal={() => setShowSwitchAccountModal(true)}
        setLocationpopup={() => setLocationPopup(true)}
        location={location}
        notificationCount={notificationCount}
        customSports={customSports}
      />
    ),
    [customSports, location, notificationCount],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {/* screen Header */}
        {LocalHeader}
        <View style={styles.separateLine} />
      </View>
      {/* sport list  */}
      <View>{RenderSportsListView()}</View>

      {authContext.isAccountDeactivated && <TCAccountDeactivate />}

      {loading ? (
        <LocalHomeScreenShimmer />
      ) : (
        <View
          style={{
            flex: 1,
            opacity: authContext.isAccountDeactivated ? 0.5 : 1,
          }}>
          {/* Flatlist  */}
          <FlatList
            data={localHomeMenu}
            ref={listRef}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            removeClippedSubviews={true}
            renderToHardwareTextureAndroid
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListHeaderComponent={React.memo(
              (
                {index}, // Memoize TopTileSection
              ) => (
                <TopTileSection
                  key={index}
                  handleTileClick={(item) => handleTileClick(item)}
                  isdeactivated={authContext.isAccountDeactivated}
                  visibleSportsModalForClub={visibleSportsModalForClub}
                  visibleSportsModalForTeam={visibleSportsModalForTeam}
                  onRegisterAsTilePress={(item) => onRegisterAsTilePress(item)}
                  setSelectedMenuOptionType={(val) =>
                    setSelectedMenuOptionType(val)
                  }
                  setJoinTeamModalvisible={() => setJoinTeamModalvisible()}
                  setClubModalVisible={() => setClubModalVisible()}
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
                isdeactivated={authContext.isAccountDeactivated}
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
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </View>
      )}

      <CustomModalWrapper
        isVisible={locationPopup}
        modalType={ModalTypes.style2}
        ratio={1.53}
        closeModal={() => {
          setLocationPopup(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.setParams({locationText: null});
            setSelectedLocationOption(0);
            getLocation();
            setTimeout(() => {
              setLocationPopup(false);
            }, 500);
          }}>
          {selectedLocationOption === 0 ? (
            <View style={styles.backgroundViewSelected}>
              <Text
                style={[
                  styles.curruentLocationText,
                  {color: colors.whiteColor},
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
          setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
          onLocationSelect={handleSetLocationOptions}
          placeholder={strings.searchcitystatecountry}
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
              <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                {strings.homeCityTitleText}
              </Text>
            </View>
          ) : (
            <View style={styles.backgroundView}>
              <Text style={styles.myCityText}>{strings.homeCityTitleText}</Text>
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
              <Text style={[styles.worldText, {color: colors.whiteColor}]}>
                {strings.world}
              </Text>
            </View>
          ) : (
            <View style={styles.backgroundView}>
              <Text style={styles.worldText}>{strings.world}</Text>
            </View>
          )}
        </TouchableWithoutFeedback>
        {locationSelectedViaModal ? (
          <>
            {selectedLocationOption === 3 ? (
              <Pressable
                onPress={() => {
                  setVisibleLocationModal(true);
                }}
                style={[
                  styles.backgroundViewSelected,
                  {
                    alignItems: 'center',
                    borderRadius: 5,
                  },
                ]}>
                <Text style={[styles.worldText, {color: colors.whiteColor}]}>
                  {location}
                </Text>

                <Text
                  style={[styles.chnageWordText, {color: colors.whiteColor}]}>
                  {strings.changecapital}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.backgroundView, {borderRadius: 5}]}
                onPress={() => {
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
                setVisibleLocationModal(true);
              }}>
              <Text style={styles.searchText}>
                {strings.searchcitystatecountry}
              </Text>
            </Pressable>
          </>
        )}
      </CustomModalWrapper>

      {/* Edit Filter Modal */}

      <EditFilterModal
        visible={settingPopup}
        onClose={() => setSettingPopup(false)}
        sportList={sports}
        image_base_url={image_base_url}
        authContext={authContext}
        onApplyPress={(sport) => {
          setSports([...sport]);
        }}
      />

      {/* Sport List Modal */}

      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={getTitleForRegister(selectedMenuOptionType)}
        sportsList={sportsData}
        onNext={(sport) => {
          setVisibleSportsModal(false);

          navigation.navigate('AccountStack', {
            screen: navigationOptions.screenName,
            params: {
              ...sport,
              comeFrom: 'LocalHome',
            },
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
      <InviteMemberModal
        isVisible={showInviteMember}
        closeModal={() => setShowInviteMember(false)}
      />

      <BottomSheet
        optionList={[strings.createTeamText, strings.inviteTeam]}
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
    marginHorizontal: 20,
    lineHeight: 14,
  },

  backgroundViewSelected: {
    backgroundColor: colors.reservationAmountColor,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 5,
  },
  backgroundView: {
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
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

  sectionStyle: {
    alignItems: 'center',
    fontSize: 15,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: widthPercentageToDP('86%'),

    alignSelf: 'center',

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

  allSportIconStyle: {
    height: 25,
    width: 25,
    marginBottom: 10,
    marginTop: 5,
  },
  editIconstyel: {
    height: 40,
    width: 40,
  },
  sportIconStyle: {
    height: 40,
    width: 40,
  },
});
