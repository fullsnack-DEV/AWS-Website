// @flow
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getCalendarIndex} from '../../api/elasticSearch';
import EventList from '../search/components/EventList';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import SearchModal from '../../components/Filter/SearchModal';
import {filterType, locationType} from '../../utils/constant';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import {getSportList} from '../../utils/sportsActivityUtils';
import {getClubRegisterSportsList, getFiltersOpetions} from '../../utils';
import {getLocationNameWithLatLong} from '../../api/External';
import TCTagsFilter from '../../components/TCTagsFilter';

let stopFetchMore = true;
const pageSize = 10;

const LocalHomEventScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [pageFrom, setPageFrom] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [filters, setFilters] = useState({
    location: strings.worldTitleText,
    locationOption: locationType.WORLD,
    sport: strings.allSport,
    sport_type: strings.allSport,
    sport_name: strings.allSport,
    eventType: strings.upcomingTitleText,
  });
  const [settingPopup, setSettingPopup] = useState(false);
  const [sports, setSports] = useState([]);
  const [searchText, setSearchText] = useState('');

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const timeoutRef = useRef();

  useEffect(() => {
    const defaultSport = [
      {
        sport: strings.allSport,
        sport_name: strings.allSport,
        sport_type: strings.allSport,
      },
    ];
    if (authContext.entity.role === Verbs.entityTypeUser) {
      setSports([...defaultSport, ...getSportList(authContext.sports)]);
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      const clubSports = getClubRegisterSportsList(authContext);
      setSports([...defaultSport, ...clubSports]);
    }
  }, [authContext]);

  const getEventData = useCallback(() => {
    if (pageFrom === 0) {
      setLoading(true);
    }

    const eventsQuery = {
      size: pageSize,
      from: pageFrom,
      query: {
        bool: {
          must: [],
        },
      },
      sort: [{actual_enddatetime: 'desc'}],
    };

    if (filters.eventType === strings.upcomingTitleText) {
      eventsQuery.query.bool.must.push({
        range: {
          actual_enddatetime: {
            gt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
          },
        },
      });
    } else if (filters.eventType === strings.completedTitleText) {
      eventsQuery.query.bool.must.push({
        range: {
          actual_enddatetime: {
            lt: Number(parseFloat(new Date().getTime() / 1000).toFixed(0)),
          },
        },
      });
    }

    if (filters.location !== strings.worldTitleText) {
      eventsQuery.query.bool.must.push({
        term: {
          'location.location_name.keyword': `*${filters.location.toLowerCase()}*`,
        },
      });
    }

    if (filters.sport !== strings.allSport) {
      eventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport.keyword': `${filters.sport.toLowerCase()}`,
        },
      });
      eventsQuery.query.bool.must.push({
        term: {
          'selected_sport.sport_type.keyword': `${filters.sport_type.toLowerCase()}`,
        },
      });
    }

    if (filters?.searchText) {
      eventsQuery.query.bool.must.push({
        match_phrase_prefix: {
          title: `*${filters.searchText.toLowerCase()}*`,
        },
      });
    }

    getCalendarIndex(eventsQuery)
      .then((events) => {
        if (events.length > 0) {
          setEventList((prevProps) => [...prevProps, ...events]);
          stopFetchMore = true;
          setPageFrom((prevProps) => prevProps + pageSize);
        } else if (pageFrom === 0) {
          setEventList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log({err});
        setLoading(false);
      });
  }, [
    pageFrom,
    filters.eventType,
    filters.location,
    filters.sport,
    filters.sport_type,
    filters?.searchText,
  ]);

  useEffect(() => {
    if (isFocused) {
      getEventData();
    }
  }, [isFocused, getEventData]);

  const handleApplySearch = async (filterData) => {
    setPageFrom(0);
    setEventList([]);

    const tempFilter = {...filterData};

    if (filterData.locationOption === locationType.WORLD) {
      tempFilter.location = strings.worldTitleText;
    } else if (filterData.locationOption === locationType.HOME_CITY) {
      tempFilter.location =
        authContext?.entity?.obj?.city.charAt(0).toUpperCase() +
        authContext?.entity?.obj?.city.slice(1);
    } else if (filterData.locationOption === locationType.CURRENT_LOCATION) {
      const loc = await getLocationNameWithLatLong();
      tempFilter.location = loc;
    } else if (filterData.locationOption === locationType.SEARCH_CITY) {
      tempFilter.location = filterData.searchCityLoc;
    }

    setFilters({...tempFilter});
    setSettingPopup(false);
    setLoading(false);
  };

  const handleTagPress = ({item}) => {
    const key = Object.keys(item)[0];
    const tempFilter = {...filters};
    if (!key) return;
    if (key === Verbs.availableTime) {
      delete tempFilter.availableTime;
      delete tempFilter.fromDateTime;
      delete tempFilter.toDateTime;
    } else if (key === Verbs.fee) {
      delete tempFilter?.minFee;
      delete tempFilter?.maxFee;
      delete tempFilter?.currency;
      delete tempFilter?.fee;
    } else if (key === Verbs.locationType) {
      tempFilter.location = strings.worldTitleText;
      tempFilter.locationOption = locationType.WORLD;
      tempFilter.isSearchPlaceholder = true;
    } else if (key === Verbs.sportType) {
      tempFilter.sport = strings.allSport;
      tempFilter.sport_name = strings.allSport;
      tempFilter.sport_type = strings.allSport;
    } else {
      delete tempFilter[key];
    }
    setPageFrom(0);
    setEventList([]);
    setFilters({...tempFilter});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.eventsTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={strings.searchText}
          placeholderTextColor={colors.userPostTimeColor}
          style={styles.searchTxt}
          autoCorrect={false}
          onChangeText={(text) => {
            setSearchText(text);
            timeoutRef.current = setTimeout(() => {
              setPageFrom(0);
              setEventList([]);
              setFilters({
                ...filters,
                searchText: text,
              });
            }, 300);
          }}
          value={searchText}
        />
        {searchText?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
              setFilters({
                ...filters,
                searchText: '',
              });
            }}>
            <Image source={images.closeRound} style={styles.closeBtn} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setSettingPopup(true);
          }}>
          <Image source={images.homeSetting} style={styles.settingImage} />
        </TouchableOpacity>
      </View>

      <TCTagsFilter
        filter={filters}
        authContext={authContext}
        dataSource={getFiltersOpetions(filters)}
        onTagCancelPress={handleTagPress}
      />

      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <EventList
            list={eventList}
            isUpcoming={filters.eventType === strings.upcomingTitleText}
            onItemPress={(item) => {
              navigation.navigate('ScheduleStack', {
                screen: 'EventScreen',
                params: {
                  data: item,
                  gameData: item,
                  comeFrom: 'LocalHomeStack',
                  screen: 'LocalHomeEventScreen',
                },
              });
            }}
            onScrollHandler={() => {
              if (!stopFetchMore && eventList.length >= pageSize) {
                getEventData(filters);
                stopFetchMore = true;
              }
            }}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
            filters={filters}
            eventType={filters.eventType}
          />
        </View>
      )}

      <SearchModal
        fType={filterType.UPCOMINGMATCHES}
        showSportOption
        showTimeComponent
        sports={sports}
        filterObject={filters}
        feeTitle={strings.refereeFee}
        isVisible={settingPopup}
        isEventFilter
        onPressApply={handleApplySearch}
        onPressCancel={() => {
          setSettingPopup(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    marginTop: 20,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    paddingHorizontal: 15,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  searchTxt: {
    flex: 1,
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  closeBtn: {
    height: 15,
    width: 15,
    resizeMode: 'cover',
    marginRight: 10,
  },
});

export default LocalHomEventScreen;
