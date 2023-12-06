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
  Dimensions,
  Share,
  ImageBackground,
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
  getSingleSportList,
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
  getNotificationCountHome,
  getSportsForHome,
  getTeamSportOnlyList,
  LocalHomeQuery,
} from './LocalHomeUtils';
import LocalHomeMenuItems from './LocalHomeMenuItems';
import SwitchAccountModal from '../../components/account/SwitchAccountModal';

import BottomSheet from '../../components/modals/BottomSheet';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import InviteMemberModal from '../../components/InviteMemberModal';
import {getGroupDetails} from '../../api/Groups';
import SportView from './SportView';
import {getCalendarIndex, getUserIndex} from '../../api/elasticSearch';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';

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
  const [newInTown, setNewInTown] = useState(false);
  const [moreThanHalfIsNonEmpty, setMoreThanHalfIsNonEmpty] = useState(true);
  const [nothingEmpty, setNothingEmpty] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState(1);
  const [location, setLocation] = useState(
    authContext?.entity?.obj?.city?.charAt(0).toUpperCase() +
      authContext?.entity?.obj?.city?.slice(1),
  );
  const [selectedSport, setSelectedSport] = useState(
    authContext.entity.obj.sport,
  );
  const [actionSheetForTeams, setActionSheetforTeams] = useState(false);
  const [actionSheetForClubs, setActionSheetforClubs] = useState(false);
  const [actionSheetForPlayers, setActionSheetforPlayers] = useState(false);

  const [sportType, setSportType] = useState();
  const [settingPopup, setSettingPopup] = useState(false);
  const [recentMatch, setRecentMatch] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState([]);
  const [challengeeMatch, setChallengeeMatch] = useState([]);
  const [hiringPlayers, setHiringPlayers] = useState([]);
  const [lookingTeam, setLookingTeam] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [contentHeight, setContentHeight] = useState('40%');

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
  const [teamsAvailble, setTeamsAvailable] = useState([]);
  const [visibleSportsModalForClub, setVisibleSportsModalForClub] =
    useState(false);
  const [visibleSportsModalForTeam, setVisibleSportsModalForTeam] =
    useState(false);
  const [eventList, setEventList] = useState([]);
  const [owners, setOwners] = useState([]);
  const [sportIconLoader, setSportIconLoader] = useState(true);
  const [cardLoader, setCardLoader] = useState(true);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playerDetailPopup, setPlayerDetailPopup] = useState();
  const [snapPoints, setSnapPoints] = useState([]);
  const [playerDetail, setPlayerDetail] = useState();
  const [players, setPlayers] = useState([]);
  const [teamSport, setTeamSport] = useState([]);
  const [filterLocalHomeMenuItems, setFilterLocalHomeMenuItems] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const generalsQuery = {
        size: 100,
        query: {bool: {must: [{bool: {should: []}}]}},
      };

      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await getUserIndex(generalsQuery);

      if (response.length > 0) {
        const result = response.map((obj) => ({
          ...obj,
          isChecked: false,
        }));

        const filteredResult = result.filter(
          (e) => e.user_id !== authContext.entity.auth.user.user_id,
        );

        setPlayers([...filteredResult]);
      }
    };

    getUsers();
  }, [authContext.entity.auth.user.user_id]);

  useEffect(() => {
    const TeamSportList = getTeamSportOnlyList(
      authContext,
      Verbs.entityTypeTeam,
    );

    const OnlyTeamSport = TeamSportList.filter(
      (item) => item.sport === item.sport_type,
    );

    setTeamSport(
      authContext.entity.role === Verbs.entityTypeClub
        ? OnlyTeamSport
        : TeamSportList,
    );

    return () => {
      setTeamSport([]);
    };
  }, [authContext]);

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
      setTeamsAvailable,
    );

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

      locationContext.setSelectedLoaction(location);
    }, [location, locationContext]),
  );

  const getEventdata = useCallback(() => {
    const upcomingEventsQuery = {
      size: 1000,
      query: {
        bool: {
          must: [
            {
              range: {
                actual_enddatetime: {
                  gt: Number(
                    parseFloat(new Date().getTime() / 1000).toFixed(0),
                  ),
                },
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };
    getCalendarIndex(upcomingEventsQuery)
      .then(async (response) => {
        const event_list = await Utility.filterEventForPrivacy({
          list: response,
          loggedInEntityId: authContext.entity.uid,
        });

        if (event_list.owners.length > 0) {
          setOwners(event_list.owners);
        }

        let validEventList = [];
        if (event_list.validEventList.length > 0) {
          validEventList = event_list.validEventList;
        }

        let finalList = [];
        validEventList.forEach((item) => {
          if (item?.rrule) {
            const rEvents = Utility.getEventOccuranceFromRule(item);
            finalList = [...finalList, ...rEvents];
          } else {
            finalList.push(item);
          }
        });
        const result = finalList.filter(
          (item) =>
            item.start_datetime >=
            Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
        );
        setEventList(result.splice(0, 5));
      })
      .catch((err) => {
        console.log('fetch event data error ==>', err);
      });
  }, [authContext.entity.uid]);

  useEffect(() => {
    if (isFocused) {
      getEventdata();
    }
  }, [isFocused, getEventdata]);

  const ITEM_HEIGHT = Verbs.ITEM_HEIGHT;

  const localHomeMenu = useMemo(
    () => [
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
        data: eventList,
        index: 3,
      },
      {
        key: strings.teamAvailableforChallenge,
        data: teamsAvailble,
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
    ],
    [
      recentMatch,
      upcomingMatch,
      eventList,
      teamsAvailble,
      challengeeMatch,
      referees,
      scorekeepers,
      hiringPlayers,
      lookingTeam,
    ],
  );

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

    const uniqueArray = data.filter(
      (value, index, self) =>
        self.findIndex((item) => item.sport === value.sport) === index,
    );

    setSports(uniqueArray);
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
    if (!cardLoader) {
      const isEveryDataEmptyArray = localHomeMenu.every(
        (item) => Array.isArray(item.data) && item.data.length === 0,
      );

      setNewInTown(isEveryDataEmptyArray);

      const nonEmptyDataCount = localHomeMenu.reduce((count, item) => {
        if (Array.isArray(item.data) && item.data.length > 0) {
          return count + 1;
        }
        return count;
      }, 0);

      const isMoreThanHalfNonEmpty =
        nonEmptyDataCount > localHomeMenu.length / 2;
      const allData = nonEmptyDataCount === localHomeMenu.length;
      setMoreThanHalfIsNonEmpty(isMoreThanHalfNonEmpty);
      setNothingEmpty(allData);

      if (!moreThanHalfIsNonEmpty) {
        const filteredLocalHomeMenu = localHomeMenu.filter(
          (item) => item.data.length > 0,
        );
        setFilterLocalHomeMenuItems(filteredLocalHomeMenu);
      }
    }
  }, [localHomeMenu, moreThanHalfIsNonEmpty, cardLoader]);

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
          setTeamsAvailable,
        );
      }
    }
  }, [
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
    setTeamsAvailable,
    memoizedLocalHomeQuery,
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
      return sportName ?? item.sport_name;
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
        extraData={sports}
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

  const onInviteFriendPress = async () => {
    try {
      const result = await Share.share({
        message: 'Hey Join TownCup!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const onTagPress = (label) => {
    if (label === strings.upcomingMatchesTitle) {
      onUpcomingAndCompletMatchPress(strings.upcomingMatchesTitle);
    } else if (label === strings.completedMatches) {
      onUpcomingAndCompletMatchPress(strings.upcomingMatchesTitle);
    } else if (label === strings.tournaments) {
      Alert.alert('This Feature is in Development');
    } else if (label === strings.teams) {
      setActionSheetforTeams(true);
    } else if (label === strings.clubsTitleText) {
      setActionSheetforClubs(true);
    } else if (label === strings.playersText) {
      setActionSheetforPlayers(true);
    } else if (label === strings.refreesText) {
      navigateToRefreeScreen();
    } else if (label === strings.scorekeepersText) {
      navigateToScoreKeeper();
    } else if (label === strings.rankingsText) {
      Alert.alert('This Feature is in Development');
    } else if (label === strings.venuesText) {
      Alert.alert('This Feature is in Development');
    }
  };

  // eslint-disable-next-line consistent-return
  const renderLocalHomeMenuItems = (item, index) => (
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
      cardLoader={cardLoader}
      openPlayerDetailsModal={(obj) => {
        setPlayerDetail(obj);
        setPlayerDetailPopup(true);
      }}
    />
  );

  const RenderFotterButtons = ({title, onPress = () => {}}) => (
    <TouchableOpacity
      onPress={() => onPress()}
      style={styles.fotterButtonContainer}>
      <Text style={styles.footerButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const onUpcomingAndCompletMatchPress = (title) => {
    const data = getDataForNextScreen(
      Verbs.SPORT_DATA,
      filters,
      location,
      selectedLocationOption,
      authContext,
    );

    if (authContext.entity.role === Verbs.entityTypeTeam) {
      const teamData = getDataForNextScreen(
        Verbs.TEAM_DATA,
        filters,
        location,
        selectedLocationOption,
        authContext,
      );
      navigation.navigate('LocalHomeStack', {
        screen:
          title === strings.completedMatches
            ? 'RecentMatchScreen'
            : 'UpcomingMatchScreen',
        params: {
          filters: teamData.filters,
          teamSportData: teamData.teamSportData,
        },
      });
    } else {
      navigation.navigate('LocalHomeStack', {
        screen:
          title === strings.completedMatches
            ? 'RecentMatchScreen'
            : 'UpcomingMatchScreen',
        params: {
          filters: data,
        },
      });
    }
  };

  const footerArray = [
    {
      label: strings.upcomingMatchesTitle,
      index: 0,
    },
    {
      label: strings.completedMatches,
      index: 1,
    },
    {
      label: strings.tournaments,
      index: 2,
    },
    {
      label: strings.teams,
      index: 3,
    },

    {
      label: strings.clubsTitleText,
      index: 4,
    },

    {
      label: strings.playersText,
      index: 5,
    },

    {
      label: strings.refreesText,
      index: 6,
    },
    {
      label: strings.scorekeepersText,
      index: 7,
    },
    {
      label: strings.rankingsText,
      index: 8,
    },
    {
      label: strings.venuesText,
      index: 9,
    },
  ];

  const FooterComponent = useCallback(
    () => (
      <View style={{flex: 1, marginBottom: 10}}>
        <ImageBackground
          source={images.localHomeFooterImage}
          style={styles.bgImgeStyle}
          imageStyle={styles.imageBgstyle}>
          <View
            style={{
              flex: 1,
              flexShrink: 1,
              marginHorizontal: 15,
              zIndex: 100,
            }}>
            <Text style={styles.footerText1}>
              {strings.hereinString}
              <Text style={{fontFamily: fonts.RBold}}>
                {' '}
                {strings.townsCupApp}{' '}
              </Text>
              ,{strings.youCanView}
            </Text>
          </View>

          <View style={styles.containerStyles}>
            {footerArray.map((item) => (
              <RenderFotterButtons
                key={item.index}
                title={item.label}
                onPress={() => onTagPress(item.label)}
              />
            ))}
          </View>
        </ImageBackground>
      </View>
    ),
    [localHomeMenu],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {/* screen Header */}
        {LocalHeader}
        <View style={styles.separateLine} />
      </View>
      {/* sport list  */}

      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      <View>{RenderSportsListView()}</View>
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
            data={
              !moreThanHalfIsNonEmpty ? filterLocalHomeMenuItems : localHomeMenu
            }
            ref={listRef}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            removeClippedSubviews={true}
            renderToHardwareTextureAndroid
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListHeaderComponent={(
              {index}, // Memoize TopTileSection
            ) => (
              <>
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
                {(newInTown || !moreThanHalfIsNonEmpty) && (
                  <View style={styles.newinTownContainerStyle}>
                    <Text style={styles.inTownText1}>
                      <Text style={{color: colors.orangeColorCard}}>
                        {strings.weAreNewText}
                      </Text>
                      <Text> {strings.inYourTown}</Text>
                    </Text>
                    <Text style={styles.helpUsFooterTxt}>
                      {strings.helpUsFooterTest}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onInviteFriendPress()}
                      style={styles.inviteFriensContainer}>
                      <Text style={styles.inviteFrindTextButton}>
                        {strings.inviteYourFriends}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            renderItem={({item, index}) =>
              renderLocalHomeMenuItems(item, index)
            }
            ListFooterComponent={nothingEmpty ? null : <FooterComponent />}
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
        closeModal={() => {
          setLocationPopup(false);
        }}
        externalSnapPoints={[
          '50%',
          contentHeight,
          Dimensions.get('window').height - 40,
        ]}>
        <View
          onLayout={(event) => {
            const contentHeights = event.nativeEvent.layout.height + 80;
            setContentHeight(contentHeights);
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.setParams({locationText: null});
              setSelectedLocationOption(0);
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

          <Pressable
            onPress={() => {
              setTimeout(() => {
                setLocationPopup(false);
              }, 200);

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
            }}>
            {selectedLocationOption === 1 ? (
              <View style={styles.backgroundViewSelected}>
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  {strings.homeCityTitleText}
                </Text>
              </View>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>
                  {strings.homeCityTitleText}
                </Text>
              </View>
            )}
          </Pressable>
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
        </View>
      </CustomModalWrapper>

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.cityStateOrCountryTitle}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
        placeholder={strings.searchcitystatecountry}
        type={'country'}
      />

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

      <SportsListModal
        isVisible={visibleSportsModalForTeam}
        closeList={() => setTeamModal(false)}
        title={strings.createTeamText}
        sportsList={teamSport}
        forTeam={true}
        authContext={authContext}
        playerList={players}
      />

      {/* club Modal */}

      <SportListMultiModal
        isVisible={visibleSportsModalForClub}
        closeList={() => setClubModal(false)}
        title={strings.createClubNotes}
        onNext={(sportsList) => {
          setClubModal(false);

          const transformedSportArray = Object.keys(sportsList).map(
            (key) => sports[key],
          );

          navigation.navigate('AccountStack', {
            screen: 'CreateClubForm1',
            params: transformedSportArray,
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
        optionList={[strings.createTeamText, strings.inviteText]}
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
      <BottomSheet
        optionList={[
          strings.teamAvailableforChallenge,
          strings.teamRerutingMembersText,
          Platform.OS === 'android' ? strings.cancel : '',
        ]}
        isVisible={actionSheetForTeams}
        closeModal={() => setActionSheetforTeams(false)}
        onSelect={(option) => {
          if (option === strings.teamAvailableforChallenge) {
            const teamData = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filters,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen: 'LookingForChallengeScreen',
              params: {
                filters: teamData.filters,
                teamSportData: teamData.teamSportData,
                registerFavSports: sports,
                forTeams: true,
              },
            });
          } else if (option === strings.teamRerutingMembersText) {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filters,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen: 'RecruitingPlayerScreen',
              params: {
                filters: data,
              },
            });
          }
          setActionSheetforTeams(false);
        }}
      />
      <BottomSheet
        optionList={[strings.recruitingMembers]}
        isVisible={actionSheetForClubs}
        closeModal={() => setActionSheetforClubs(false)}
        onSelect={(option) => {
          setActionSheetforPlayers(false);
          if (option === strings.recruitingMembers) {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filters,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen: 'RecruitingPlayerScreen',
              params: {
                filters: data,
              },
            });
          }
        }}
      />

      <BottomSheet
        optionList={[
          strings.playersAvailableforChallenge,
          strings.playersLookingForGroupText,
        ]}
        isVisible={actionSheetForPlayers}
        closeModal={() => setActionSheetforPlayers(false)}
        onSelect={(option) => {
          console.log(option);
          // setActionSheetforPlayers(false);
          const data = getDataForNextScreen(
            Verbs.SPORT_DATA,
            filters,
            location,
            selectedLocationOption,
            authContext,
          );

          if (option === strings.playersAvailableforChallenge) {
            navigation.navigate('LocalHomeStack', {
              screen: 'LookingForChallengeScreen',
              params: {
                filters: data,
                registerFavSports: getSingleSportList(sports),
              },
            });
          }
          if (option === strings.playersLookingForGroupText) {
            if (authContext.entity.role === Verbs.entityTypeTeam) {
              const teamData = getDataForNextScreen(
                Verbs.TEAM_DATA,
                filters,
                location,
                selectedLocationOption,
                authContext,
              );
              navigation.navigate('LocalHomeStack', {
                screen: 'LookingTeamScreen',
                params: {
                  filters: teamData.filters,
                  teamSportData: teamData.teamSportData,
                },
              });
            } else {
              navigation.navigate('LocalHomeStack', {
                screen: 'LookingTeamScreen',
                params: {
                  filters: data,
                },
              });
            }
          }
        }}
      />

      <CustomModalWrapper
        isVisible={playerDetailPopup}
        closeModal={() => {
          setPlayerDetailPopup(false);
        }}
        modalType={ModalTypes.style2}
        externalSnapPoints={snapPoints}>
        <View
          style={{paddingTop: 0, paddingHorizontal: 0}}
          onLayout={(event) => {
            const contentHeights = event.nativeEvent.layout.height + 40;
            const screenHeight = Dimensions.get('window').height - 40;
            if (contentHeights <= screenHeight) {
              setSnapPoints(['50%', contentHeights, screenHeight]);
            }
          }}>
          <FlatList
            data={playerDetail?.sports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <SportView
                item={item}
                imageBaseUrl={image_base_url}
                onPress={() => {
                  // console.log({item});
                  setPlayerDetailPopup(false);
                  navigation.navigate('HomeStack', {
                    screen: 'SportActivityHome',
                    params: {
                      sport: item.sport,
                      sportType: item?.sport_type,
                      uid: playerDetail.user_id,
                      entityType: playerDetail.entity_type,
                      parentStack: 'App',
                      backScreen: 'LocalHome',
                    },
                  });
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </CustomModalWrapper>
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
  imageBgstyle: {
    opacity: 0.3,
  },
  bgImgeStyle: {
    height: '100%',
    width: '100%',
  },
  footerText1: {
    fontSize: 16,
    lineHeight: 24,

    marginTop: 25,
  },
  containerStyles: {
    paddingVertical: 10,
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  newinTownContainerStyle: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  inTownText1: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    lineHeight: 30,
    marginLeft: 10,
  },
  helpUsFooterTxt: {
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 10,
    marginTop: 5,
  },
  inviteFriensContainer: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 30,
  },
  inviteFrindTextButton: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.orangeColorCard,
    paddingVertical: 9,

    paddingHorizontal: 5,
  },
  fotterButtonContainer: {
    paddingHorizontal: 11,
    backgroundColor: colors.whiteColor,
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    lineHeight: 21,
    marginVertical: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
    flexShrink: 1,
  },
});
