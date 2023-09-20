import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  BackHandler,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TagItemView from '../../components/newsFeed/TagItemView';
import SelectedTagList from '../../components/newsFeed/SelectedTagList';
import TagMatches from './TagMatches';
import {
  getGameIndex,
  getGroupIndex,
  getUserIndex,
} from '../../api/elasticSearch';
import {strings} from '../../../Localization/translation';
import ScreenHeader from '../../components/ScreenHeader';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import {getGroupSportName} from '../../utils/sportsActivityUtils';
import Verbs from '../../Constants/Verbs';
import SelectedMatchList from '../../components/newsFeed/SelectedMatchList';
import {getTaggedEntityData, prepareTagName} from '../../utils';

const tabList = [
  strings.peopleTitleText,
  strings.groupsTitleText,
  strings.matchesTitleText,
];

const groupTabList = [strings.team, strings.club, strings.league];

export default function UserTagSelectionListScreen({navigation, route}) {
  const [searchText, setSearchText] = useState();
  const [currentTab, setCurrentTab] = useState(strings.peopleTitleText);
  const [currentGrpupTab, setCurrentGroupTab] = useState(strings.team);
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [seletedEntity, setSeletedEntity] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {postData} = route.params;
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const intervalRef = useRef();
  const scrollRef = useRef();

  const fetchData = useCallback(
    (searchValue = '') => {
      const query = {
        size: 1000,
        query: {
          bool: {
            must: [],
          },
        },
      };

      const gamesquery = {
        size: 1000,
        query: {
          bool: {
            should: [
              {
                match: {
                  city: {query: authContext.entity.obj.city, boost: 4},
                },
              },
              {
                match: {
                  country: {
                    query: authContext.entity.obj.country,
                    boost: 1,
                  },
                },
              },
            ],
          },
        },
        // sort: [{actual_enddatetime: 'desc'}],
      };

      if (authContext.entity.obj.state) {
        gamesquery.query.bool.should.push({
          match: {
            state: {query: authContext.entity.obj.state, boost: 3},
          },
        });
      } else if (authContext.entity.obj.state_abbr) {
        gamesquery.query.bool.should.push({
          match: {
            state_abbr: {
              query: authContext.entity.obj.state_abbr,
              boost: 2,
            },
          },
        });
      }

      if (searchValue) {
        query.query.bool.must.push({
          query_string: {
            query: `${searchValue.toLowerCase()}*`,
            fields: ['full_name', 'group_name'],
          },
        });
      }

      const promiseArr = [
        getUserIndex(query),
        getGroupIndex(query),
        getGameIndex(gamesquery),
      ];
      setLoading(true);
      Promise.all(promiseArr)
        .then((response) => {
          setUserData(response[0]);
          setGroupData(response[1]);
          setGamesData(response[2]);
          setLoading(false);
        })
        .catch((err) => {
          Alert.alert(strings.alertmessagetitle, err.message);
          setLoading(false);
        });
    },
    [authContext.entity.obj],
  );

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  useEffect(() => {
    if (isFocused && route.params.gameTags?.length > 0) {
      setSelectedMatch([...route.params.gameTags]);
    }
  }, [isFocused, route.params.gameTags]);

  useEffect(() => {
    if (isFocused && route.params.tagsOfEntity?.length > 0) {
      setSeletedEntity([...route.params.tagsOfEntity]);
    }
  }, [isFocused, route.params.tagsOfEntity]);

  const onSelectMatch = useCallback(
    (gameItem) => {
      const gData = _.cloneDeep(selectedMatch);
      const gIndex = gData?.findIndex(
        (item) => item.game_id === gameItem.game_id,
      );
      if (gIndex === -1) {
        gData.push(gameItem);
      } else {
        gData.splice(gIndex, 1);
      }

      setSelectedMatch([...gData]);
    },
    [selectedMatch],
  );

  const renderTopTabView = () => (
    <>
      <View style={[styles.row, {marginTop: 5}]}>
        {tabList.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabItem,
              currentTab === tab ? styles.activeTabItem : {},
            ]}
            onPress={() => {
              setCurrentTab(tab);
              fetchData(searchText);
            }}>
            <Text
              style={[
                styles.tabItemText,
                currentTab === tab ? styles.activeTabItemText : {},
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {currentTab === strings.groupsTitleText ? (
        <View style={styles.subTabView}>
          {groupTabList.map((groupTab) => (
            <TouchableOpacity
              key={groupTab}
              style={{marginLeft: 21}}
              onPress={() => setCurrentGroupTab(groupTab)}>
              <Text
                style={[
                  styles.subTabText,
                  currentGrpupTab === groupTab ? styles.activeSubTabText : {},
                ]}>
                {groupTab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </>
  );

  const getList = () => {
    let type = Verbs.entityTypeTeam;
    switch (currentTab) {
      case strings.peopleTitleText:
        return userData;

      case strings.groupsTitleText:
        if (currentGrpupTab === strings.club) {
          type = Verbs.entityTypeClub;
        }
        if (currentGrpupTab === strings.league) {
          type = Verbs.entityTypeLeague;
        }
        return groupData.filter((item) => item.entity_type === type);

      case strings.matchesTitleText:
        return gamesData;

      default:
        return [];
    }
  };

  const handleSelection = (data = {}) => {
    const list =
      currentTab === strings.matchesTitleText ? [] : [...seletedEntity];

    let newList = [...list];

    if (list.length > 0) {
      let obj = null;
      if (
        data.entity_type === Verbs.entityTypePlayer ||
        data.entity_type === Verbs.entityTypeUser
      ) {
        obj = list.find((item) => item.entity_id === data.user_id);
      } else {
        obj = list.find((item) => item.entity_id === data.group_id);
      }

      if (obj) {
        if (
          data.entity_type === Verbs.entityTypePlayer ||
          data.entity_type === Verbs.entityTypeUser
        ) {
          newList = newList.filter((item) => item.entity_id !== data.user_id);
        } else {
          newList = newList.filter((item) => item.entity_id !== data.group_id);
        }
      } else {
        const entity_data = getTaggedEntityData({}, data);
        entity_data.tagged_formatted_name = prepareTagName(data);
        const finalObj = {
          entity_data,
          entity_type: data.entity_type ?? Verbs.entityTypePlayer,
          entity_id: data.user_id ?? data.group_id,
        };

        newList = [...list, finalObj];
      }
    } else {
      const entity_data = getTaggedEntityData({}, data);
      entity_data.tagged_formatted_name = prepareTagName(data);
      const finalObj = {
        entity_data,
        entity_type: data.entity_type ?? Verbs.entityTypePlayer,
        entity_id: data.user_id ?? data.group_id,
      };
      newList.push(finalObj);
    }

    setSeletedEntity([...newList]);
  };

  const handleGameTagSelection = (item) => {
    const filteredMatchTagData = selectedMatch.filter(
      (match) => match.challenge_id !== item.challenge_id,
    );

    setSelectedMatch(filteredMatchTagData);
  };

  const renderTabContain = () => {
    if (loading) {
      return <UserListShimmer />;
    }
    const list = getList();
    if (list.length === 0) {
      return <Text style={styles.noDataText}>{strings.noRecordFoundText}</Text>;
    }

    if (currentTab === strings.matchesTitleText) {
      return (
        <TagMatches
          gamesData={list}
          selectedMatch={selectedMatch}
          onSelectMatch={onSelectMatch}
        />
      );
    }

    return (
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingHorizontal: 17, paddingTop: 20}}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <>
            <TagItemView
              source={item.thumbnail}
              entityName={item.full_name ?? item.group_name}
              userLocation={item.city}
              entityType={item.entity_type}
              onSelect={() => {
                handleSelection(item);
              }}
              onClickProfile={() => {
                navigation.navigate('HomeScreen', {
                  uid: item.user_id ?? item.group_id,
                  role: item.entity_type,
                  comeFrom: 'UserTagSelectionListScreen',
                  routeParams: {...route.params, tagsOfEntity: seletedEntity},
                });
              }}
              entityId={item.user_id ?? item.group_id}
              selectedList={seletedEntity}
              sportName={getGroupSportName(item, authContext.sports, 1)}
            />
            <View style={styles.sperateLine} />
          </>
        )}
      />
    );
  };

  const renderSelectedEntity = () =>
    seletedEntity.length > 0 ? (
      <SelectedTagList
        dataSource={seletedEntity}
        onTagCancelPress={({item}) => {
          const list =
            currentTab === strings.matchesTitleText ? [] : [...seletedEntity];
          const newList = list.filter(
            (ele) => ele.entity_id !== item.entity_id,
          );
          setSeletedEntity([...newList]);
        }}
      />
    ) : null;

  const renderSelectedMatchList = () =>
    selectedMatch.length > 0 ? (
      <SelectedMatchList
        matches={selectedMatch}
        onTagCancelPress={(item) => {
          handleGameTagSelection(item);
        }}
      />
    ) : null;

  useEffect(() => {
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(() => {
      fetchData(searchText);
    }, 300);
  }, [searchText, fetchData]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.tag}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() =>
          navigation.navigate(route.params.comeFrom, {
            selectedImageList: [],
            ...route.params.routeParams,
            postData,
            selectedTagList: seletedEntity,
            selectedMatchTags: selectedMatch,
          })
        }
      />
      <Pressable style={styles.inputContainer}>
        <TextInput
          placeholder={strings.searchText}
          placeholderTextColor={colors.userPostTimeColor}
          style={styles.inputField}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <Pressable
          onPress={() => {
            clearTimeout(intervalRef.current);
            setSearchText('');
          }}>
          <Image source={images.closeRound} style={{width: 15, height: 15}} />
        </Pressable>
      </Pressable>
      <View>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'flex-start',
            flexGrow: 1,
            paddingRight: 15,
          }}
          onContentSizeChange={() => {
            scrollRef.current.scrollToEnd({animated: true});
          }}>
          <View style={styles.scrollStyle}>
            {renderSelectedEntity()}
            {renderSelectedMatchList()}
          </View>
        </ScrollView>
      </View>

      {renderTopTabView()}
      <View style={{flex: 1}}>{renderTabContain()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    margin: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.bgColor,
    paddingBottom: 7,
  },
  tabItemText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
    paddingBottom: 5,
  },
  activeTabItemText: {
    color: colors.tabFontColor,
    fontFamily: fonts.RBlack,
  },
  sperateLine: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  noDataText: {
    fontSize: 16,
    marginTop: 20,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },
  subTabView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgColor,
  },
  subTabText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  activeSubTabText: {
    fontFamily: fonts.RBold,
    color: colors.tabFontColor,
  },
  scrollStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
