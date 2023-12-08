// @flow
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import {format} from 'react-string-format';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import SearchTagList from './components/SearchTagList';
import {
  getCalendarIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import PeopleSection from './components/PeopleSection';
import SectionHeader from './components/SectionHeader';
import GroupsSection from './components/GroupsSection';
import Verbs from '../../Constants/Verbs';
import {
  filterEventForPrivacy,
  getEventOccuranceFromRule,
  getLocalSearchData,
  setSearchDataToLocal,
} from '../../utils';
import RecentSearchItem from './components/RecentSearchItem';
import AuthContext from '../../auth/context';
import SearchEventCard from './components/SearchEventCard';
import fonts from '../../Constants/Fonts';

const SearchScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [peoples, setPeoples] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventOwners, setEventOwners] = useState([]);
  const [showRecentResults, setShowRecentResults] = useState(false);
  const [recentSearchResults, setRecentSearchResults] = useState({});
  const [filterResult, setFilterResult] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [fetchingRecords, setFetchingRecords] = useState(false);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const inputRef = useRef();
  const timeoutRef = useRef();

  const getLocalData = useCallback(async () => {
    const localSearchData = await getLocalSearchData();
    setRecentSearchResults(localSearchData);
    const result = localSearchData[authContext.entity.uid] ?? [];
    setFilterResult(result);
  }, [authContext.entity.uid]);

  useEffect(() => {
    if (isFocused) {
      getLocalData();
    }
  }, [isFocused, getLocalData]);

  const getLists = useCallback(
    (searchData = '') => {
      const userQuery = {
        size: 1000,
        query: {
          bool: {
            must: [],
          },
        },
      };
      const groupQuery = {
        size: 1000,
        query: {
          bool: {
            must: [],
          },
        },
      };

      const upcomingEventsQuery = {
        size: 1000,
        query: {
          bool: {
            must: [
              {
                range: {
                  start_datetime: {
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

      if (searchData) {
        userQuery.query.bool.must.push({
          match_phrase_prefix: {
            full_name: `*${searchData.toLowerCase()}*`,
          },
        });
        groupQuery.query.bool.must.push({
          match_phrase_prefix: {
            group_name: `*${searchData.toLowerCase()}*`,
          },
        });
        upcomingEventsQuery.query.bool.must.push({
          match_phrase_prefix: {
            title: `*${searchData.toLowerCase()}*`,
          },
        });
        setFetchingRecords(true);
      }

      const proimseArr = [
        getUserIndex(userQuery),
        getGroupIndex(groupQuery),
        getCalendarIndex(upcomingEventsQuery),
      ];
      if (!searchData) {
        setLoading(true);
      }
      Promise.all(proimseArr)
        .then(async ([peopleList, groupList, eventList]) => {
          const event_list = await filterEventForPrivacy({
            list: eventList,
            loggedInEntityId: authContext.entity.uid,
          });

          if (event_list.owners.length > 0) {
            setEventOwners(event_list.owners);
          }

          let validEventList = [];
          if (event_list.validEventList.length > 0) {
            validEventList = event_list.validEventList;
          }

          let finalList = [];
          validEventList.forEach((item) => {
            if (item?.rrule) {
              const rEvents = getEventOccuranceFromRule(item);
              finalList = [...finalList, ...rEvents];
            } else {
              finalList.push(item);
            }
          });

          if (searchData) {
            setSearchResult([...peopleList, ...groupList, ...finalList]);
          } else {
            setPeoples(peopleList.splice(0, 3));
            setGroups(groupList.splice(0, 3));
            setEvents(finalList.splice(0, 3));
          }
          setLoading(false);
          setFetchingRecords(false);
        })
        .catch((err) => {
          console.log({err});
          setLoading(false);
          setFetchingRecords(false);
        });
    },
    [authContext.entity.uid],
  );

  useEffect(() => {
    if (isFocused) {
      getLists();
    }
  }, [isFocused, getLists]);

  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.navigate('App', {
        screen: 'LocalHome',
      });
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  const handleTagPress = (selectedTag = {}) => {
    if (selectedTag.parentTag === null) return;
    navigation.navigate('EntitySearchScreen', {
      activeTab: selectedTag.parentTag,
      activeSubTab: selectedTag.value,
    });
  };

  const removeFromLocal = (data = null) => {
    const obj = {...recentSearchResults};
    if (typeof data === 'string') {
      const list = (recentSearchResults[authContext.entity.uid] ?? []).filter(
        (item) => item !== data,
      );
      obj[authContext.entity.uid] = list;

      setFilterResult(list);
    } else {
      const list = (recentSearchResults[authContext.entity.uid] ?? []).filter(
        (item) =>
          item.group_id !== data.group_id ||
          item.user_id !== data.user_id ||
          item.owner_id !== data.owner_id,
      );
      obj[authContext.entity.uid] = list;

      setFilterResult(list);
    }
    setSearchDataToLocal(obj);
    setRecentSearchResults(obj);
  };

  const handleSearch = (value) => {
    getLists(value);
    const res = (recentSearchResults[authContext.entity.uid] ?? []).filter(
      (ele) =>
        typeof ele === 'string'
          ? ele.toLowerCase().includes(value.toLowerCase())
          : (ele.group_name ?? ele.full_name ?? '')
              .toLowerCase()
              .includes(value.toLowerCase()),
    );

    setFilterResult(res);
  };

  const handleListItemPress = (data = null) => {
    const localData = {...recentSearchResults};
    localData[authContext.entity.uid] = [
      ...(localData[authContext.entity.uid] ?? []),
      data,
    ];
    setSearchDataToLocal(localData);
    setRecentSearchResults(localData);

    if (typeof data === 'string') {
      navigation.navigate('EntitySearchScreen', {
        activeTab: 0,
        searchData: data,
      });
    } else if (data?.group_id || data?.user_id) {
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          uid: data.group_id ?? data.user_id,
          role: data.entity_type ?? Verbs.entityTypePlayer,
          comeFrom: 'EntitySearchScreen',
          backScreen: 'SearchScreen',
          parentStack: route.params?.parentStack,
          screen: route.params.screen,
        },
      });
    } else if (data?.cal_type === Verbs.eventVerb) {
      navigation.navigate('ScheduleStack', {
        screen: 'EventScreen',
        params: {
          data,
          gameData: data,
          comeFrom: 'UniversalSearchStack',
          screen: 'SearchScreen',
        },
      });
    }
  };

  const renderSearchedRecords = () => {
    if (showRecentResults) {
      if (fetchingRecords) {
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        );
      }
      if (filterResult.length > 0 || searchResult.length > 0) {
        return (
          <View style={{paddingHorizontal: 15, flex: 1}}>
            {filterResult.length > 0 && !searchText && (
              <SectionHeader title={strings.recentText} />
            )}

            <View style={{marginTop: 24, flex: 1}}>
              <FlatList
                data={searchText ? [...searchResult] : [...filterResult]}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <RecentSearchItem
                    data={item}
                    onRemove={removeFromLocal}
                    onPress={handleListItemPress}
                    eventOwnersList={eventOwners}
                  />
                )}
              />
            </View>
          </View>
        );
      }
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              color: colors.googleColor,
              fontSize: 16,
              lineHeight: 24,
            }}>
            {format(strings.noResultFoundFor, searchText)}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.searchText}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
      />
      <ActivityLoader visible={loading} />

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={searchText}
          style={styles.input}
          placeholder={strings.searchText}
          placeholderTextColor={colors.userPostTimeColor}
          onChangeText={(value) => {
            setSearchText(value);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              handleSearch(value);
            }, 300);
          }}
          onFocus={() => {
            setShowRecentResults(true);
          }}
          onBlur={() => {
            setShowRecentResults(false);
          }}
          onSubmitEditing={() => {
            if (searchText) {
              const obj = {...(recentSearchResults ?? {})};
              obj[authContext.entity.uid] = [
                ...(obj[authContext.entity.uid] ?? []),
                searchText,
              ];
              setSearchDataToLocal(obj);
              setRecentSearchResults(obj);
              if (!isFocused) {
                return;
              }
              navigation.navigate('EntitySearchScreen', {
                activeTab: 0,
                searchData: searchText,
              });
            }
          }}
        />

        <TouchableOpacity
          onPress={() => {
            setSearchText('');
            setSearchResult([]);
            inputRef.current.blur();
            setShowRecentResults(false);
            setFilterResult(recentSearchResults[authContext.entity.uid] ?? []);
          }}>
          <Image source={images.closeRound} style={{height: 15, width: 15}} />
        </TouchableOpacity>
      </View>
      {!showRecentResults && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <SearchTagList onPress={handleTagPress} />
          <View style={[styles.separator, {marginTop: 10}]} />

          {peoples.length > 0 || groups.length > 0 ? (
            <>
              <PeopleSection
                list={peoples}
                onPressSection={() => {
                  navigation.navigate('EntitySearchScreen', {
                    activeTab: 0,
                  });
                }}
                onPress={(data) => {
                  navigation.navigate('HomeStack', {
                    screen: 'HomeScreen',
                    params: {
                      uid: data.user_id,
                      role: data.entity_type ?? Verbs.entityTypePlayer,
                      comeFrom: 'EntitySearchScreen',
                      backScreen: 'SearchScreen',
                      parentStack: route.params?.parentStack,
                      screen: route.params.screen,
                    },
                  });
                }}
              />
              <View style={styles.separator} />

              <GroupsSection
                list={groups}
                onPressSection={() => {
                  navigation.navigate('EntitySearchScreen', {
                    activeTab: 1,
                  });
                }}
                onPress={(data) => {
                  navigation.navigate('HomeStack', {
                    screen: 'HomeScreen',
                    params: {
                      uid: data.group_id,
                      role: data.entity_type,
                      comeFrom: 'EntitySearchScreen',
                      backScreen: 'SearchScreen',
                      parentStack: route.params?.parentStack,
                      screen: route.params.screen,
                    },
                  });
                }}
              />
              <View style={styles.separator} />

              <View style={{paddingHorizontal: 15}}>
                <SectionHeader
                  title={strings.matchesTitleText}
                  onNext={() => {
                    navigation.navigate('EntitySearchScreen', {
                      activeTab: 2,
                    });
                  }}
                />
              </View>
              <View style={styles.separator} />

              <View style={{paddingHorizontal: 15}}>
                <SectionHeader
                  title={strings.eventsTitle}
                  onNext={() => {
                    navigation.navigate('EntitySearchScreen', {
                      activeTab: 3,
                    });
                  }}
                />
                <View style={{marginTop: 20}}>
                  {events.map((item, index) => {
                    const owner = eventOwners.find(
                      (event) =>
                        event.owner_id === item.group_id ||
                        event.owner_id === item.user_id,
                    );
                    return (
                      <View key={index}>
                        <SearchEventCard
                          event={item}
                          onPressEvent={() => {
                            navigation.navigate('ScheduleStack', {
                              screen: 'EventScreen',
                              params: {
                                data: item,
                                gameData: item,
                                comeFrom: 'UniversalSearchStack',
                                screen: 'SearchScreen',
                              },
                            });
                          }}
                          eventOwner={owner}
                        />
                        {index !== events.length - 1 && (
                          <View style={styles.cardSeparator} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={styles.separator} />
            </>
          ) : null}
        </ScrollView>
      )}
      {renderSearchedRecords()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  inputContainer: {
    height: 40,
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.textFieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  input: {
    flex: 1,
    padding: 0,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  separator: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  cardSeparator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
    marginLeft: 48,
  },
});
export default SearchScreen;
