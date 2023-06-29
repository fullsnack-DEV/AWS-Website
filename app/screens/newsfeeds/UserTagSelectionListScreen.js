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

  const fetchData = useCallback(() => {
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
      sort: [{actual_enddatetime: 'desc'}],
    };

    if (authContext.entity.obj.state) {
      gamesquery.query.bool.should.push({
        match: {
          state: {query: authContext.entity.obj.state, boost: 3},
        },
      });
    } else {
      gamesquery.query.bool.should.push({
        match: {
          state_abbr: {
            query: authContext.entity.obj.state_abbr,
            boost: 2,
          },
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
  }, [authContext.entity.obj]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  useEffect(() => {
    if (isFocused && route.params.gameTags && route.params.tagsOfEntity) {
      setSeletedEntity([...route.params.tagsOfEntity]);
      setSelectedMatch([...route.params.gameTags]);
    }
  }, [isFocused, route.params]);

  const filterData = (searchValue = '') => {
    if (!searchValue) {
      fetchData();
    } else {
      const userList = userData.filter((item) =>
        item.full_name.includes(searchValue),
      );
      const groupList = groupData.filter((item) =>
        item.group_name.includes(searchValue),
      );

      setUserData([...userList]);
      setGroupData([...groupList]);
    }
  };

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
              if (searchText) {
                fetchData();
              }
              setSearchText('');
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
        obj = list.find((item) => item.user_id === data.user_id);
      } else {
        obj = list.find((item) => item.group_id === data.group_id);
      }

      if (obj) {
        if (
          data.entity_type === Verbs.entityTypePlayer ||
          data.entity_type === Verbs.entityTypeUser
        ) {
          newList = newList.filter((item) => item.user_id !== data.user_id);
        } else {
          newList = newList.filter((item) => item.group_id !== data.group_id);
        }
      } else {
        newList = [...list, data];
      }
    } else {
      newList.push(data);
    }
    setSeletedEntity([...newList]);
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
          handleSelection(item);
        }}
      />
    ) : null;

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.tag}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.done}
        onRightButtonPress={() =>
          navigation.navigate('WritePostScreen', {
            postData,
            selectedImageList: [],
            selectedTagList: seletedEntity,
            selectedMatchTags: selectedMatch,
            ...route.params.routeParams,
          })
        }
      />

      <TextInput
        placeholder={strings.searchText}
        placeholderTextColor={colors.userPostTimeColor}
        style={styles.inputField}
        onChangeText={(text) => {
          setSearchText(text);
          clearTimeout(intervalRef.current);
          intervalRef.current = setTimeout(() => {
            filterData(text);
          }, 1500);
        }}
        value={searchText}
      />
      {renderSelectedEntity()}
      {renderTopTabView()}
      <View style={{flex: 1}}>{renderTabContain()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputField: {
    height: 40,
    margin: 15,
    fontSize: 16,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    backgroundColor: colors.textFieldBackground,
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
    borderWidth: 1,
    marginVertical: 15,
    borderColor: colors.grayBackgroundColor,
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
});
