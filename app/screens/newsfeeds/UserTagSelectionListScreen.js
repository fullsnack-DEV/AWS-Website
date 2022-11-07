/* eslint-disable array-callback-return */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable consistent-return */
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
} from 'react-native';
import _ from 'lodash';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCSearchBox from '../../components/TCSearchBox';
import TagItemView from '../../components/newsFeed/TagItemView';
import SelectedTagList from '../../components/newsFeed/SelectedTagList';
import ScrollableTabs from '../../components/ScrollableTabs';
import TagMatches from './TagMatches';
import {getAllGames} from '../../api/NewsFeeds';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import {strings} from '../../../Localization/translation';

let stopFetchMore = true;

export default function UserTagSelectionListScreen({navigation, route}) {
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentGrpupTab, setCurrentGroupTab] = useState('team');
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(
    route?.params?.taggedData ?? [],
  );
  const [selectedMatch, setSelectedMatch] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [loadMore, setLoadMore] = useState(false);
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.doneTextStyle}
          onPress={() => {
            if (route?.params?.comeFrom) {
              if (selectedMatch?.length > 0 && route?.params?.onSelectMatch) {
                route.params.onSelectMatch(selectedMatch);
              }
              navigation.navigate(route?.params?.comeFrom, {
                data: route?.params?.data,
                onPressDone: route?.params?.onPressDone,
                selectedTagList: selectedUsers.filter((obj) => !obj?.entity_id),
              });
            }
          }}>
          {strings.done}
        </Text>
      ),
    });
  }, [
    navigation,
    route.params,
    selectedMatch,
    selectedUsers,
    currentGrpupTab,
    pageFrom,
    userData,
    groupData,
    searchText,
    loading,
  ]);

  const getUsersData = useCallback(
    (text = '') => {
      const userQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [],
          },
        },
      };

      if (text !== '') {
        userQuery.query.bool.must.push({
          query_string: {
            query: `*${text}*`,
            fields: ['full_name'],
          },
        });
      }

      console.log('userQuery:=>', JSON.stringify(userQuery));

      // Referee query
      const userAddData = [];
      setLoading(true);
      getUserIndex(userQuery)
        .then((response) => {
          if (response.length > 0) {
            let fullName = '';
            response.map((userItem) => {
              if (userItem.full_name) {
                fullName = userItem.full_name;
              } else if (userItem.first_name && userItem.last_name) {
                fullName = `${userItem.first_name} ${userItem.last_name}`;
              }

              userAddData.push({
                ...userItem,
                id: userItem.user_id,
                title: fullName,
              });
              return null;
            });

            setUserData([...userData, ...userAddData]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          console.log('eeeee Get Users :-', e.response);
          Alert.alert('', e.messages);
        });
    },
    [pageFrom, pageSize, searchText, userData],
  );

  const getGroupsData = useCallback(
    (text = '') => {
      const groupQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [{term: {entity_type: currentGrpupTab}}],
          },
        },
      };

      if (text !== '') {
        groupQuery.query.bool.must.push({
          query_string: {
            query: `*${text}*`,
            fields: ['group_name'],
          },
        });
      }

      console.log('groupQuery:=>', JSON.stringify(groupQuery));

      const userAddData = [];
      getGroupIndex(groupQuery)
        .then((response) => {
          if (response.length > 0) {
            let fullName = '';
            response.map((groupItem) => {
              if (groupItem.group_name) {
                fullName = groupItem.group_name;
              }
              userAddData.push({
                ...groupItem,
                id: groupItem.group_id,
                title: fullName,
              });
              return null;
            });
            setGroupData([...groupData, ...userAddData]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((e) => {
          console.log('eeeee Get Group Users :-', e.response);
          Alert.alert('', e.messages);
        });
    },
    [currentGrpupTab, groupData, pageFrom, pageSize, searchText],
  );

  useEffect(() => {
    getUsersData('');
  }, []);

  useEffect(() => {
    getGroupsData('');
  }, [currentGrpupTab]);

  useEffect(() => {
    getAllGames(authContext.entity.uid, authContext)
      .then((res) => {
        console.log('All games:=>', res);
        setGamesData([...res?.payload]);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   if (searchText !== '') {
  //     const dataTabList = [userData, groupData]
  //     const data = dataTabList[currentTab]

  //     const escapeRegExp = (str) => {
  //       if (!_.isString(str)) {
  //         return '';
  //       }
  //       return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
  //     };
  //     const searchStr = escapeRegExp(searchText)
  //     const answer = data?.filter((a) => (a.title)
  //       .toLowerCase()
  //       .toString()
  //       .match(searchStr.toLowerCase().toString()));
  //     setSearchData([...answer])
  //   }
  // }, [searchText])

  const toggleSelection = useCallback(
    (isChecked, user) => {
      console.log('useessees', selectedUsers);
      const data = selectedUsers;
      if (isChecked) {
        const uIndex = data.findIndex(({id}) => user.id === id);
        if (uIndex !== -1) data.splice(uIndex, 1);
      } else {
        data.push(user);
      }
      setSelectedUsers([...data]);
    },
    [selectedUsers],
  );

  const renderItem = useCallback(
    ({item}) => {
      console.log('Users list :=>', item);
      let thumbnail = null;
      let fullName = '';
      let locationName = '-';
      if (item) {
        if (item.thumbnail) {
          thumbnail = item.thumbnail;
        }
        if (item.title) {
          fullName = item.title ?? item.full_name;
        }
        if (item.city) {
          locationName = item.city;
        }
      }
      const isChecked = selectedUsers.some((val) => {
        if ([val.entity_id, val.id].includes(item.id)) {
          return true;
        }
        return false;
      });
      return (
        <TagItemView
          source={thumbnail ? {uri: thumbnail} : images.profilePlaceHolder}
          userName={fullName}
          userLocation={locationName}
          checkUncheckSource={
            isChecked ? images.checkWhiteLanguage : images.uncheckWhite
          }
          onItemPress={() => toggleSelection(isChecked, item)}
        />
      );
    },
    [selectedUsers, toggleSelection],
  );

  const onSelectMatch = useCallback(
    (gameItem) => {
      const gData = _.cloneDeep(selectedMatch);
      const gIndex = gData?.findIndex(
        (item) => item?.game_id === gameItem?.game_id,
      );
      if (gIndex === -1) gData.push(gameItem);
      else gData.splice(gIndex, 1);
      setSelectedMatch([...gData]);
    },
    [selectedMatch],
  );

  const onScrollUserHandler = useCallback(() => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getUsersData('');

      stopFetchMore = true;
    }
    setLoadMore(false);
  }, [getUsersData]);
  const onScrollGroupHandler = useCallback(() => {
    setLoadMore(true);
    if (!stopFetchMore) {
      getGroupsData('');

      stopFetchMore = true;
    }
    setLoadMore(false);
  }, [getGroupsData]);

  const renderSingleTab = useCallback(() => {
    if (currentTab === 0) {
      return (
        <View>
          <FlatList
            ListEmptyComponent={
              !loading && (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: hp(2),
                    color: colors.userPostTimeColor,
                  }}>
                  {strings.noRecordFoundText}
                </Text>
              )
            }
            data={Array.from(new Set(userData))} // Array.from(new Set(userData))
            ListHeaderComponent={() => <View style={{height: 8}} />}
            ListFooterComponent={() => (
              <View style={{height: 8, marginBottom: 50}} />
            )}
            ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
            style={{paddingHorizontal: 15}}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onScroll={onScrollUserHandler}
            onEndReachedThreshold={0.01}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
          />
        </View>
      );
    }
    if (currentTab === 1) {
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: colors.lightgrayColor,
              borderBottomWidth: 1,
            }}>
            {['team', 'club', 'league'].map((item) => (
              <TouchableOpacity
                key={item}
                style={{padding: 10}}
                onPress={() => {
                  setCurrentGroupTab(item);
                  setPageFrom(0);
                  setGroupData([]);
                  getGroupsData('');
                }}>
                <Text
                  style={{
                    color:
                      item === currentGrpupTab
                        ? colors.themeColor
                        : colors.lightBlackColor,
                    fontFamily:
                      item === currentGrpupTab ? fonts.RBold : fonts.RRegular,
                  }}>
                  {_.startCase(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: hp(2),
                  color: colors.userPostTimeColor,
                }}>
                {strings.noRecordFoundText}
              </Text>
            }
            data={groupData}
            ListHeaderComponent={() => <View style={{height: 8}} />}
            ListFooterComponent={() => (
              <View style={{height: 8, marginBottom: 50}} />
            )}
            ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
            style={{paddingHorizontal: 15}}
            renderItem={renderItem}
            keyExtractor={(item) => item.group_id}
            onScroll={onScrollGroupHandler}
            onEndReachedThreshold={0.01}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
          />
        </View>
      );
    }
    if (currentTab === 2) {
      return (
        <TagMatches
          gamesData={gamesData}
          selectedMatch={selectedMatch}
          onSelectMatch={onSelectMatch}
        />
      );
    }
  }, [
    currentGrpupTab,
    currentTab,
    gamesData,
    getGroupsData,
    groupData,
    onScrollGroupHandler,
    onScrollUserHandler,
    onSelectMatch,
    renderItem,
    selectedMatch,
    userData,
  ]);

  const renderTabContain = useMemo(
    () => (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>{renderSingleTab()}</View>
      </SafeAreaView>
    ),
    [renderSingleTab],
  );

  const renderSearchBox = useMemo(
    () =>
      currentTab !== 2 ? (
        <TCSearchBox
          style={{alignSelf: 'center', marginVertical: 5}}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setPageFrom(0);
            if (currentTab === 0) {
              setUserData([]);
              getUsersData(text);
            } else if (currentTab === 1) {
              setGroupData([]);
              getGroupsData(text);
            }
          }}
        />
      ) : (
        <View></View>
      ),
    [currentTab, getGroupsData, getUsersData, searchText],
  );

  const renderSelectedEntity = useMemo(
    () =>
      selectedUsers.length > 0 && (
        <SelectedTagList
          dataSource={selectedUsers}
          onTagCancelPress={({item}) => {
            toggleSelection(true, item);
          }}
        />
      ),
    [selectedUsers, toggleSelection],
  );

  const onTabPress = useCallback((tab) => {
    setCurrentTab(tab);
    setSearchText('');
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderSearchBox}
      {renderSelectedEntity}
      <ScrollableTabs
        tabs={[
          strings.peopleTitleText,
          strings.groupsTitleText,
          strings.matchesTitleText,
        ]}
        onTabPress={onTabPress}
        currentTab={currentTab}
      />
      {renderTabContain}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },

  doneTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
    marginRight: 15,
  },
});
