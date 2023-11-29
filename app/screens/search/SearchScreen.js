// @flow
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import SearchTagList from './components/SearchTagList';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import PeopleSection from './components/PeopleSection';
import SectionHeader from './components/SectionHeader';
import GroupsSection from './components/GroupsSection';
import Verbs from '../../Constants/Verbs';
import {getLocalSearchData, setSearchDataToLocal} from '../../utils';
import RecentSearchItem from './components/RecentSearchItem';

const SearchScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [peoples, setPeoples] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showRecentResults, setShowRecentResults] = useState(false);
  const [recentSearchResults, setRecentSearchResults] = useState([]);
  const [filterResult, setFilterResult] = useState([]);

  const isFocused = useIsFocused();
  const inputRef = useRef();
  let timeoutRef = useRef();

  const getLocalData = useCallback(async () => {
    const localSearchData = await getLocalSearchData();

    setRecentSearchResults(localSearchData);
    setFilterResult(localSearchData);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getLocalData();
    }
  }, [isFocused, getLocalData]);

  const getLists = useCallback(() => {
    const proimseArr = [getUserIndex({}), getGroupIndex({})];
    setLoading(true);
    Promise.all(proimseArr)
      .then(([peopleList, groupList]) => {
        setPeoples(peopleList.splice(0, 3));
        setGroups(groupList.splice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.log({err});
        setLoading(false);
      });
  }, []);

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
    if (typeof data === 'string') {
      const list = recentSearchResults.filter((item) => item !== data);

      setFilterResult(list);
      setSearchDataToLocal(list);
      setRecentSearchResults(list);
    }
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
            timeoutRef = setTimeout(() => {
              const res = recentSearchResults.filter((ele) =>
                (
                  ele.group_name?.toLowerCase() ??
                  ele.full_name?.toLowerCase() ??
                  ele?.toLowerCase()
                ).includes(value.toLowerCase()),
              );
              setFilterResult(res);
            }, 300);
          }}
          onFocus={() => {
            setShowRecentResults(true);
          }}
          onBlur={() => {
            setShowRecentResults(false);
          }}
          onEndEditing={() => {
            if (searchText) {
              const data = [...recentSearchResults, searchText];

              setSearchDataToLocal(data);
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
            inputRef.current.blur();
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
                  onPressSection={() => {
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
                  onPressSection={() => {
                    navigation.navigate('EntitySearchScreen', {
                      activeTab: 3,
                    });
                  }}
                />
              </View>
              <View style={styles.separator} />
            </>
          ) : null}
        </ScrollView>
      )}
      {showRecentResults && filterResult.length > 0 && (
        <View style={{paddingHorizontal: 15}}>
          <SectionHeader title={strings.recentText} />
          <View style={{marginTop: 24}}>
            <FlatList
              data={filterResult}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <RecentSearchItem
                  data={item}
                  onRemove={removeFromLocal}
                  onPress={(data) => {
                    if (typeof data === 'string') {
                      navigation.navigate('EntitySearchScreen', {
                        activeTab: 0,
                        searchData: data,
                      });
                    } else if (data.group_id || data.user_id) {
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
                    }
                  }}
                />
              )}
            />
          </View>
        </View>
      )}
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
});
export default SearchScreen;
