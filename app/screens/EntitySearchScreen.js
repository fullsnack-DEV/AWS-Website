/* eslint-disable no-confusing-arrow */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import _ from 'lodash';
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

  const [playerList, setplayerList] = useState([]);
  const [referees, setReferees] = useState([]);

  const TAB_ITEMS = ['People', 'Groups', 'Games', 'Posts'];
  const SUB_TAB_ITEMS = ['General', 'Players', 'Referees', 'Scorekeeper'];
  const GROUP_SUB_TAB_ITEMS = ['Team', 'clubs', 'Leagues'];

  const body = bodybuilder().query('match', 'entity_type', 'player').build();
  const defaultPageSize = 5;

  useEffect(() => {
    console.log('Query:=>', JSON.stringify(body));
    console.log('selected tab value', currentTab);
    getUserIndex(body)
      .then((res) => {
        console.log('Then s response', res);
        setplayerList(res);
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Referee query

    // eslint-disable-next-line vars-on-top

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
    // Referee querygit status

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
        setReferees([...res]);
      })
      .catch((e) => {
        setTimeout(() => {
          // Alert.alert(strings.alertmessagetitle, e);
        }, 10);
      });
    //
  }, []);

  const searchFilterFunction = (text) => {
    const result = getSearchEntityData(
      searchMember,
      ['group_name', 'first_name', 'last_name', 'full_name'],
      text,
    );
    setGroups([...result]);
  };

  const onProfilePress = (item) => {
    navigation.navigate('HomeScreen', {
      uid: ['user', 'player']?.includes(item?.entity_type)
        ? item?.user_id
        : item?.group_id,
      role: ['user', 'player']?.includes(item?.entity_type)
        ? 'user'
        : item.entity_type,
      backButtonVisible: true,
      menuBtnVisible: false,
    });
  };
  const tabChangePress = (changeTab) => {
    setCurrentTab(changeTab.i);
    console.log('call tab change', currentTab);
  };
  const renderTabsContainer = (keyTab) => {
    console.log('Tab key -->', keyTab);
  };

  const renderMenu = () => {
    return <Text>{'test'}</Text>;
  };

  // const renderItem = ({item}) => {
  //   return (
  //     <>
  //       <View style={{marginVertical: 10}}>
  //         <TCProfileView
  //           type={'medium'}
  //           name={item.full_name}
  //           image={
  //             item.full_image
  //               ? {uri: item.full_image}
  //               : images.profilePlaceHolder
  //           }
  //           location={`${item?.city} , ${item?.country}`}
  //         />
  //       </View>
  //     </>
  //   );
  // };
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
      <View style={styles.searchBarView}>
        <TCSearchBox
          editable={true}
          onChangeText={(text) => searchFilterFunction(text)}
        />
      </View>
      <View style={{backgroundColor: '#FFFFFF'}}>
        <TCScrollableProfileTabs
          tabItem={TAB_ITEMS}
          tabVerticalScroll={false}
          onChangeTab={tabChangePress}
          currentTab={currentTab}
          renderTabContain={renderTabsContainer}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: colors.lightgrayColor,
          borderBottomWidth: 1,
          backgroundColor: '#FCFCFC',
        }}>
        {SUB_TAB_ITEMS.map((item) => (
          <TouchableOpacity
            key={item}
            style={{padding: 10}}
            onPress={() => setCurrentSubTab(item)}>
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
      </View>
      <FlatList
        style={{backgroundColor: '#FCFCFC'}}
        data={playerList}
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
});
