import React, {
  useEffect, useState, useContext, useMemo, useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
 SafeAreaView,
} from 'react-native';
import _ from 'lodash';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUserList } from '../../api/Users';
import { getMyGroups } from '../../api/Groups';
import AuthContext from '../../auth/context'
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCSearchBox from '../../components/TCSearchBox';
import TagItemView from '../../components/newsFeed/TagItemView';
import SelectedTagList from '../../components/newsFeed/SelectedTagList';
import ScrollableTabs from '../../components/ScrollableTabs';
import TagMatches from './TagMatches';
import { getAllGames } from '../../api/NewsFeeds';

export default function UserTagSelectionListScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentGrpupTab, setCurrentGroupTab] = useState('team');
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState([]);
  const [gamesData, setGamesData] = useState([]);

  const authContext = useContext(AuthContext)

  useEffect(() => {
    const userAddData = [];
    getUserList(authContext)
      .then((response) => {
        if (response.payload.length > 0) {
          let fullName = '';
          response.payload.map((userItem) => {
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
          })
        }
        setUserData(userAddData);
      })
      .catch((e) => {
        console.log('eeeee Get Users :-', e.response);
        Alert.alert('', e.messages)
      });

      getAllGames(authContext.entity.uid, authContext).then((res) => {
        setGamesData([...res?.payload])
        console.log(res);
      }).catch((error) => {
        console.log(error)
      })
  }, []);

  useEffect(() => {
    const userAddData = [];
    getMyGroups(authContext)
      .then((response) => {
        if (response.payload.length > 0) {
          let fullName = '';
          response.payload.map((groupItem) => {
            if (groupItem.group_name) {
              fullName = groupItem.group_name;
            }
            userAddData.push({
              ...groupItem,
              id: groupItem.group_id,
              title: fullName,
            });
            return null;
          })
        }
        setGroupData(userAddData);
      })
      .catch((e) => {
        console.log('eeeee Get Group Users :-', e.response);
        Alert.alert('', e.messages)
      });
  }, []);

  useEffect(() => {
    if (searchText !== '') {
      const dataTabList = [userData, groupData]
      const data = dataTabList[currentTab]

      const escapeRegExp = (str) => {
        if (!_.isString(str)) {
          return '';
        }
        return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
      };
      const searchStr = escapeRegExp(searchText)
      const answer = data?.filter((a) => (a.title)
        .toLowerCase()
        .toString()
        .match(searchStr.toLowerCase().toString()));
      setSearchData([...answer])
    }
  }, [searchText])

  const toggleSelection = useCallback((isChecked, user) => {
    const data = selectedUsers;
    if (isChecked) {
      const uIndex = data.findIndex(({ id }) => user.id === id);
      if (uIndex !== -1) data.splice(uIndex, 1);
    } else {
      data.push(user);
    }
    setSelectedUsers([...data]);
  }, [selectedUsers]);

  const renderItem = useCallback(({ item }) => {
    let thumbnail = null;
    let fullName = '';
    let locationName = '-';
    if (item) {
      if (item.thumbnail) {
        thumbnail = item.thumbnail;
      }
      if (item.title) {
        fullName = item.title;
      }
      if (item.city && item.state_abbr) {
        locationName = `${item.city}, ${item.state_abbr}`;
      }
    }
    const isChecked = selectedUsers.some((val) => {
      if (item.id === val.id) {
        return true;
      }
      return false
    })
    return (
      <TagItemView
            source={thumbnail ? { uri: thumbnail } : images.profilePlaceHolder}
            userName={fullName}
            userLocation={locationName}
            checkUncheckSource={isChecked ? images.checkWhiteLanguage : images.uncheckWhite}
            onItemPress={() => toggleSelection(isChecked, item)}
        />
    );
  }, [selectedUsers, toggleSelection]);

  const onSelectMatch = useCallback((gameItem) => {
    const gData = _.cloneDeep(selectedMatch)
    const gIndex = gData?.findIndex((item) => item?.game_id === gameItem?.game_id)
    if (gIndex === -1) gData.push(gameItem);
    else gData.splice(gIndex, 1);
    setSelectedMatch([...gData]);
  }, [selectedMatch]);

  const renderSingleTab = useCallback((data) => {
    let filteredData = data;
    if (currentTab === 1) {
      filteredData = data?.filter((item) => item?.entity_type === currentGrpupTab)
    }
    if (currentTab === 2) {
      return (
        <TagMatches
              gamesData={gamesData}
              selectedMatch={selectedMatch}
              onSelectMatch={onSelectMatch}
          />
      )
    }
    return (
      <View>
        {currentTab === 1 && (
          <View style={{ flexDirection: 'row', borderBottomColor: colors.lightgrayColor, borderBottomWidth: 1 }}>
            {['team', 'club', 'league'].map((item) => (
              <TouchableOpacity key={item} style={{ padding: 10 }} onPress={() => setCurrentGroupTab(item)}>
                <Text style={{
                        color: item === currentGrpupTab ? colors.themeColor : colors.lightBlackColor,
                        fontFamily: item === currentGrpupTab ? fonts.RBold : fonts.RRegular,
                }}>
                  {_.startCase(item)}
                </Text>
              </TouchableOpacity>
                ))}

          </View>
          )}
        <FlatList
              ListEmptyComponent={
                <Text style={{
                  textAlign: 'center',
                  marginTop: hp(2),
                  color: colors.userPostTimeColor,
                }}>No Records Found</Text>}
              data={filteredData}
              ListHeaderComponent={() => <View style={{ height: 8 }} />}
              ListFooterComponent={() => <View style={{ height: 8, marginBottom: 50 }} />}
              ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
              style={{ paddingHorizontal: 15 }}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
          />
      </View>
    )
  }, [currentGrpupTab, currentTab, gamesData, onSelectMatch, renderItem, selectedMatch]);

  const renderTabContain = useMemo(() => {
    const dataTabList = [userData, groupData]
    return (
      <SafeAreaView>
        <View style={{ flex: Platform.OS === 'ios' ? 0 : 10, marginBottom: 150 }}>
          {renderSingleTab(searchText === '' ? dataTabList[currentTab] : searchData)}
        </View>
      </SafeAreaView>
    )
  }, [currentTab, groupData, renderSingleTab, searchData, searchText, userData])

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTextStyle}>Tag</Text>
          }
          rightComponent={
            <TouchableOpacity style={{ padding: 2 }} onPress={() => {
              if (route?.params?.comeFrom) {
                if (selectedMatch?.length > 0 && route?.params?.onSelectMatch) route.params.onSelectMatch(selectedMatch)
                navigation.navigate(route?.params?.comeFrom, { selectedTagList: selectedUsers });
              }
            }}>
              <Text style={styles.doneTextStyle}>Done</Text>
            </TouchableOpacity>
          }
      />
  ), [navigation, route.params, selectedMatch, selectedUsers])
  const renderSearchBox = useMemo(() => (

    currentTab !== 2 ? <TCSearchBox
          style={{ alignSelf: 'center', marginVertical: 5 }}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text)
          }}
      /> : <View></View>
  ), [currentTab, searchText])

  const renderSelectedEntity = useMemo(() => selectedUsers.length > 0 && (
    <SelectedTagList
                dataSource={selectedUsers}
                titleKey={'title'}
                onTagCancelPress={({ item }) => {
                  toggleSelection(true, item)
                }}
            />
        ), [selectedUsers, toggleSelection]);

  const onTabPress = useCallback((tab) => {
    setCurrentTab(tab)
    setSearchText('');
  }, []);

  return (

    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>

      {renderHeader}
      <View style={styles.sperateLine} />
      {renderSearchBox}
      {renderSelectedEntity}
      <ScrollableTabs
          tabs={['People', 'Groups', 'Matches']}
          onTabPress={onTabPress}
          currentTab={currentTab}
      />
      {renderTabContain}

    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  doneTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
});
