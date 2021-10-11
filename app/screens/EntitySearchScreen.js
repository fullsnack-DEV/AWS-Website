/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import _, {set} from 'lodash';
import bodybuilder from 'bodybuilder';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TCSearchBox from '../components/TCSearchBox';
import {getMyGroups} from '../api/Groups';
import {getUserList} from '../api/Users';
import AuthContext from '../auth/context';
// import UserListShimmer from '../components/shimmer/commonComponents/UserListShimmer';
import {getSearchEntityData} from '../utils';
import TCSearchProfileView from '../components/TCSearchProfileView';
import TCScrollableProfileTabs from '../components/TCScrollableProfileTabs';
import ScorekeeperInfoSection from '../components/Home/User/ScorekeeperInfoSection';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {getUserIndex} from '../api/elasticSearch';
import TCProfileView from '../components/TCProfileView';
import images from '../Constants/ImagePath';
import strings from '../Constants/String';

export default function EntitySearchScreen({navigation}) {
  const authContext = useContext(AuthContext);
  // For activity indigator
  const [loading, setloading] = useState(true);
  const [searchMember, setSearchMember] = useState();
  const [groups, setGroups] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentSubTab, setCurrentSubTab] = useState('General');

  const [searchText, setSearchText] = useState('');
  const [playerList, setplayerList] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [referees, setReferees] = useState([]);
  const [scorekeepers, setScorekeepers] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [settingPopup, setSettingPopup] = useState(false);

  const TAB_ITEMS = ['People', 'Groups', 'Games', 'Posts'];
  const PEOPLE_SUB_TAB_ITEMS = [
    'General',
    'Players',
    'Referees',
    'Scorekeepers',
  ];
  const GROUP_SUB_TAB_ITEMS = ['Teams', 'Clubs', 'Leagues'];
  const GAMES_SUB_TAB_ITEMS = ['Completed', 'Upcoming'];
  const POST_SUB_TAB_ITEMS = ['ALL', 'Videos', 'Photos'];

  const body = bodybuilder().query('match', 'entity_type', 'player').build();
  const defaultPageSize = 5;

  useEffect(() => {
    console.log('Query:=>', JSON.stringify(body));
    console.log('selected tab value', currentTab);
    getPlayersList();
    getRefereesList();
    getScoreKeepersList();
  }, []);

  const getPlayersList = () => {
    getUserIndex(body)
      .then((res) => {
        console.log('player respone', res);
        setplayerList(res);
        setFilterData(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getRefereesList = () => {
    // Referee query
    const refereeQuery = {
      size: defaultPageSize,
      query: {
        bool: {
          must: [{term: {'referee_data.is_published': true}}],
        },
      },
    };
    getUserIndex(refereeQuery)
      .then((res) => {
        console.log('res referee list 111111:=>', res);
        setReferees([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          // Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getScoreKeepersList = () => {
    // Score keeper query
    const scoreKeeperQuery = {
      size: defaultPageSize,
      query: {
        bool: {
          must: [{term: {'scorekeeper_data.is_published': true}}],
        },
      },
    };
    getUserIndex(scoreKeeperQuery)
      .then((res) => {
        console.log('res score keeper list 2222:=>', res);
        setScorekeepers([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          // Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
  };
  const getGroupsList = () => {};
  const renderSearchBox = useMemo(
    () => (
      <View style={styles.searchBarView}>
        <TCSearchBox
          editable={true}
          onChangeText={(text) => searchFilterFunction(text)}
        />
      </View>
    ),
    [],
  );

  const searchFilterFunction = (text) => {
    setSearchText(text);
  };

  const tabChangePress = (changeTab) => {
    setCurrentTab(changeTab.i);
    console.log('call tab change', currentTab);
  };
  const renderTabContain = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: colors.lightgrayColor,
          borderBottomWidth: 1,
          backgroundColor: '#FCFCFC',
        }}>
        {currentTab === 0 &&
          PEOPLE_SUB_TAB_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => onPressSubTabs(item, index)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 1 &&
          GROUP_SUB_TAB_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => onPressSubTabs(item, index)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 2 &&
          POST_SUB_TAB_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => onPressSubTabs(item, index)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentTab === 3 &&
          GAMES_SUB_TAB_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={{padding: 10}}
              onPress={() => onPressSubTabs(item, index)}>
              <Text
                style={{
                  color:
                    item === currentSubTab
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === currentSubTab ? fonts.RBold : fonts.RRegular,
                }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
          ))}
        {currentSubTab !== 'General' && (
          <TouchableWithoutFeedback onPress={() => setSettingPopup(true)}>
            <Image source={images.homeSetting} style={styles.settingImage} />
          </TouchableWithoutFeedback>
        )}
      </View>

      // <View style={{flex: 1}}>{renderSingleTab}</View>
    ),
    [
      PEOPLE_SUB_TAB_ITEMS,
      GROUP_SUB_TAB_ITEMS,
      POST_SUB_TAB_ITEMS,
      GAMES_SUB_TAB_ITEMS,
      currentTab,
      currentSubTab,
    ],
  );

  // const onPressSubTabs = (item, index) => {
  //   console.log('item values -->', item, index);
  //   if (index === 0 || index === 1) {
  //     setFilterData(playerList);
  //   } else if (index === 2) {
  //     setFilterData(referees);
  //   } else if (index === 2) {
  //     setFilterData(scorekeepers);
  //   }
  //   setCurrentSubTab(item);
  // };
  const onPressSubTabs = useCallback((item, index) => {
    console.log('item values 66 -->', item, index);
    if (index === 0 || index === 1) {
      setFilterData(playerList);
    } else if (index === 2) {
      setFilterData(referees);
    } else if (index === 3) {
      setFilterData(scorekeepers);
    }
    setCurrentSubTab(item);
  });

  const renderItem = ({item}) => {
    return (
      <>
        {/* Name and country */}
        <View style={styles.topViewContainer}>
          <TCProfileView
            style={{marginLeft: 10}}
            type={'medium'}
            name={item.full_name}
            location={`${item?.city} , ${item?.country}`}
            image={
              item.full_image
                ? {uri: item.full_image}
                : images.profilePlaceHolder
            }
          />
        </View>
      </>
    );
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
      {renderSearchBox}
      <View style={{backgroundColor: '#FFFFFF'}}>
        <TCScrollableProfileTabs
          tabItem={TAB_ITEMS}
          tabVerticalScroll={false}
          onChangeTab={tabChangePress}
          currentTab={currentTab}
        />
      </View>
      {renderTabContain}
      <FlatList
        style={{backgroundColor: '#FCFCFC'}}
        data={filterData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  topViewContainer: {
    // backgroundColor: '#f9c2ff',
    // padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    height: 70,
  },
  settingImage: {
    height: 20,
    width: 20,
    resizeMode: 'cover',
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
  },
});

// const onProfilePress = (item) => {
//   navigation.navigate('HomeScreen', {
//     uid: ['user', 'player']?.includes(item?.entity_type)
//       ? item?.user_id
//       : item?.group_id,
//     role: ['user', 'player']?.includes(item?.entity_type)
//       ? 'user'
//       : item.entity_type,
//     backButtonVisible: true,
//     menuBtnVisible: false,
//   });
// };
