import React, { useEffect, useState, useContext } from 'react';
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
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import TagItemView from '../../components/newsFeed/TagItemView';
import SelectedTagList from '../../components/newsFeed/SelectedTagList';

export default function UserTagSelectionListScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [userData, setUserData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchData, setSearchData] = useState([]);
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

  const renderTabContain = (tabKey) => {
    const dataTabList = [userData, groupData]
    return (
      <View style={{ flex: Platform.OS === 'ios' ? 0 : 10 }}>
        {renderSingleTab(searchText === '' ? dataTabList[tabKey] : searchData)}
      </View>
    )
  }

  const renderSingleTab = (data) => (
    <FlatList
      ListEmptyComponent={
        <Text style={{
          textAlign: 'center',
          marginTop: hp(2),
          color: colors.userPostTimeColor,
        }}>No Records Found</Text>}
      data={data}
      ListHeaderComponent={() => <View style={{ height: 8 }} />}
      ListFooterComponent={() => <View style={{ height: 8, marginBottom: 50 }} />}
      ItemSeparatorComponent={() => <View style={styles.sperateLine} />}
      style={{ paddingHorizontal: 15 }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  )

  const toggleSelection = (isChecked, user) => {
    const data = selectedUsers;
    if (isChecked) {
      const uIndex = data.findIndex(({ id }) => user.id === id);
      if (uIndex !== -1) data.splice(uIndex, 1);
    } else {
      data.push(user);
    }
    setSelectedUsers([...data]);
  };

  const renderItem = ({ item }) => {
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
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
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
              navigation.navigate(route?.params?.comeFrom, { selectedTagList: selectedUsers });
            }
          }}>
            <Text style={styles.doneTextStyle}>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <TCSearchBox
        style={{ alignSelf: 'center', marginVertical: 5 }}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text)
        }}
      />
      {selectedUsers.length > 0 && (
        <SelectedTagList
        dataSource={selectedUsers}
        titleKey={'title'}
        onTagCancelPress={({ item }) => {
          toggleSelection(true, item)
        }}
        />
      )}
      <TCScrollableProfileTabs
        tabItem={['People', 'Groups', 'Games']}
        onChangeTab={(ChangeTab) => {
          setCurrentTab(ChangeTab.i)
          setSearchText('')
        }}
        customStyle={{ flex: 1 }}
        currentTab={currentTab}
        renderTabContain={renderTabContain}
      />
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
