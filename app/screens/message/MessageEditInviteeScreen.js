import React, {
  useState, useEffect, useContext, useMemo, useCallback,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import QB from 'quickblox-react-native-sdk';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import {
 getQBProfilePic, QBgetAllUsers, QBupdateDialogInvitees,
} from '../../utils/QuickBlox';
import AuthContext from '../../auth/context'
import TCScrollableTabs from '../../components/TCScrollableTabs';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import TCGroupNameBadge from '../../components/TCGroupNameBadge';

const MessageEditInviteeScreen = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const TAB_ITEMS = ['All', 'People', 'Teams', 'Clubs', 'Leagues'];
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [inviteeData, setInviteeData] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [leaguesData, setLeaguesData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const setParticipants = async () => {
      if (route?.params?.participants) {
        const entity = authContext.entity
        const myUid = entity.QB.id;
        const participants = route.params.participants.filter((item) => item.id !== myUid);
        setSelectedInvitees(participants)
      }
    }
    setParticipants();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (searchText !== '') {
      const dataTabList = [inviteeData, peopleData, teamsData, clubsData, leaguesData]
      const data = dataTabList[currentTab]

      const escapeRegExp = (str) => {
        if (!_.isString(str)) {
          return '';
        }
        return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
      };
      const searchStr = escapeRegExp(searchText)
      const answer = data?.filter((a) => (a.fullName)
        .toLowerCase()
        .toString()
        .match(searchStr.toLowerCase().toString()));
      setSearchData([...answer])
    }
  }, [searchText])

  const getAllUsers = () => {
    setLoading(true);
    QBgetAllUsers().then((res) => {
      getAllTypesData(res.users)
    }).catch(() => {
      setInviteeData([]);
      setLoading(false);
    })
  }

  const getAllTypesData = async (AllUsers) => {
    const entity = authContext.entity
    const myUid = entity.QB.id;
    const users = AllUsers.filter((user) => user.id !== myUid);
    setInviteeData(users);
    const personData = [];
    const clubData = [];
    const teamData = [];
    const leagueData = [];
    users.map((item) => {
      const customData = item && item.customData ? JSON.parse(item.customData) : {};
      const entityType = _.get(customData, ['entity_type'], '')
      if (entityType === 'player') {
        personData.push(item);
      } else if (entityType === 'club') {
        clubData.push(item);
      } else if (entityType === 'team') {
        teamData.push(item);
      } else if (entityType === 'league') {
        leagueData.push(item);
      }
      return null;
    });
    setPeopleData([...personData]);
    setClubsData([...clubData]);
    setTeamsData([...teamData]);
    setLeaguesData([...leagueData]);
    setLoading(false);
  }
  const Item = useCallback(({
    item, onPress, style, isChecked,
  }) => {
    const customData = item?.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = customData?.full_name ?? customData?.group_name;
    const fullImage = _.get(customData, ['full_image'], '')
    const city = _.get(customData, ['city'], '')
    const placeHolderImage = entityType === 'player'
      ? images.profilePlaceHolder
      : images.groupUsers;
    const finalImage = fullImage
      ? { uri: fullImage }
      : placeHolderImage
    return (
      <TouchableOpacity onPress={onPress} style={[styles.listItems, style]}>
        <View
        colors={isChecked ? [colors.greenGradientStart, colors.greenGradientEnd] : [colors.offwhite, colors.offwhite]}
        style={[styles.listItems, { padding: 10 }]}>
          <View style={{
            flexDirection: 'row',
          }}>
            <FastImage resizeMode={'cover'} source={finalImage} style={styles.imageContainer}/>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              <View style={{
                flex: 3, justifyContent: 'center', marginLeft: hp(1),
              }}>
                <TCGroupNameBadge textStyle={{ ...styles.title, color: colors.lightBlackColor }} groupType={entityType} name={fullName}/>
                <Text style={{ ...styles.subTitle, color: colors.lightBlackColor }}>{city}</Text>
              </View>
              {isChecked ? <Image source={images.yellowCheckBox} resizeMode={'contain'} style={ styles.checkboxImg }/>
                : <Image source={images.whiteUncheck} resizeMode={'contain'} style={ styles.checkboxImg }/>
            }
            </View>
          </View>
        </View>
      </TouchableOpacity>)
  }, [])

  const toggleSelection = useCallback((isChecked, user) => {
    if (isChecked) {
      if (route?.params?.dialog) {
        const fromExistingUser = route?.params?.dialog?.occupantsIds?.findIndex((item) => item === user?.id)
        if (!route?.params?.isAdmin && fromExistingUser !== -1) {
          Alert.alert('TownsCup', 'Group admin can remove user')
        } else {
          const uIndex = selectedInvitees.findIndex((item) => user?.id === item?.id);
          if (uIndex !== -1) selectedInvitees.splice(uIndex, 1);
        }
      }
    } else {
      selectedInvitees.push(user);
    }
    setSelectedInvitees([...selectedInvitees]);
  }, [route?.params?.dialog, route?.params?.isAdmin, selectedInvitees]);

  const renderSelectedContactList = useCallback(({ item, index }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = _.get(customData, ['full_name'], '')
    const type = entityType === 'player' ? QB.chat.DIALOG_TYPE.CHAT : QB.chat.DIALOG_TYPE.GROUP_CHAT

    return (
      <View style={styles.selectedContactInnerView}>
        <View>
          <View>
            <FastImage
              resizeMode={'contain'}
              source={getQBProfilePic(type, index)}
              style={styles.selectedContactImage}
            />
            <TouchableOpacity
              style={styles.selectedContactButtonView}
              onPress={() => toggleSelection(true, item)}>
              <Image source={images.cancelWhite} style={styles.deSelectedContactImage} />
            </TouchableOpacity>
          </View>
          <Text
            ellipsizeMode={'tail'}
            numberOfLines={2}
            style={{
              fontSize: 10, fontFamily: fonts.RBold, textAlign: 'center', flex: 1, width: wp(20),
            }}>
            {fullName}
          </Text>
        </View>
      </View>
    );
  }, [toggleSelection]);

  const renderItem = useCallback(({ item }) => {
    const isChecked = selectedInvitees.some((val) => val.id === item.id)
    return (
      <Item
        item={item}
        onPress={() => toggleSelection(isChecked, item)}
        isChecked={isChecked}
      />
    );
  }, [selectedInvitees, toggleSelection]);

  const ListEmptyComponent = useMemo(() => (
    <Text style={{ textAlign: 'center', marginTop: hp(2), color: colors.userPostTimeColor }}>No Records Found</Text>
  ), [])

  const renderSingleTab = useCallback((data) => (
    <View style={{ margin: wp(3) }}>
      <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          legacyImplementation={true}
          maxToRenderPerBatch={10}
          initialNumToRender={5}
          ListEmptyComponent={ListEmptyComponent}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
    </View>
  ), [ListEmptyComponent, renderItem])

  const renderTabContain = useCallback((tabKey, tabIndex) => {
    const dataTabList = [inviteeData, peopleData, teamsData, clubsData, leaguesData]
    return (
      <View tabLabel={tabKey} style={{ flex: 1 }}>
        {loading
            ? <UserListShimmer/>
            : renderSingleTab(searchText === '' ? dataTabList[tabIndex] : searchData)
        }
      </View>
    )
  }, [clubsData, inviteeData, leaguesData, loading, peopleData, renderSingleTab, searchData, searchText, teamsData])

  const handlePress = useCallback(() => {
    if (route?.params?.dialog) {
      const occupantsIds = [];
      selectedInvitees.filter((item) => occupantsIds.push(item.id))
      const participantsIds = [];
      const participants = route?.params?.participants ?? [];
      participants.filter((item) => participantsIds.push(item.id))
      const dialogId = route?.params?.dialog?.id;
      const myQbUserID = authContext?.entity?.QB?.id;

      const removeUsers = participantsIds.filter((item) => item !== myQbUserID && !occupantsIds.includes(item));
      const addUsers = occupantsIds.filter((item) => myQbUserID !== item && !participantsIds.includes(item));
      QBupdateDialogInvitees(dialogId, addUsers, removeUsers).then((res) => {
        setSelectedInvitees([]);
        route.params.onPressDone(res);
        navigation.goBack();
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [authContext, navigation, route?.params?.dialog, route?.params?.participants, selectedInvitees])

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FastImage resizeMode={'contain'} source={images.backArrow} style={styles.backImageStyle}/>
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Invite</Text>
          }
          rightComponent={
            <TouchableOpacity onPress={handlePress}>
              <Text style={{ ...styles.eventTextStyle, fontSize: 14 }}>
                Done
              </Text>
            </TouchableOpacity>
          }
      />
  ), [handlePress, navigation])

  const renderSelectedInvitees = useMemo(() => selectedInvitees.length > 0 && (
    <View style={styles.selectedInviteesMainView}>
      <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
            horizontal={true}
            data={selectedInvitees || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSelectedContactList}
            extraData={selectedInvitees}
        />
    </View>
  ), [renderSelectedContactList, selectedInvitees])

  const renderTabs = useMemo(() => (
    <TCScrollableTabs
          onChangeTab={(ChangeTab) => {
            setCurrentTab(ChangeTab.i)
            setSearchText('')
          }}
      >
      {TAB_ITEMS?.map(renderTabContain)}
    </TCScrollableTabs>
  ), [TAB_ITEMS, renderTabContain])

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderHeader}
      <View style={ styles.separateLine } />
      {/* <ActivityLoader visible={loading}/> */}
      {renderSelectedInvitees}
      <View style={{ backgroundColor: colors.grayBackgroundColor, width: '100%', padding: 15 }}>
        <TextInput
            autoFocus={true}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.textInputStyle}
            placeholder={'Search'}
        />
      </View>
      <View style={styles.sperateLine}/>
      {renderTabs}
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.whiteColor,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  eventTextStyle: {
    width: '100%',
    fontSize: 10,
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 45,
    width: 45,
    borderRadius: wp(6),
  },

  title: {
    flexWrap: 'wrap',
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,

  },
  subTitle: {
    fontFamily: fonts.RLight,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

  listItems: {
    paddingVertical: 8,
    color: 'black',
    borderRadius: 5,
  },
  checkboxImg: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  selectedInviteesMainView: {
    height: Platform.OS === 'ios' ? hp(12) : hp(14),
    width: wp('100%'),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    backgroundColor: colors.whiteColor,
  },
  selectedContactButtonView: {
    height: hp(2),
    width: hp(2),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: hp(2),
    position: 'absolute',
    top: 0,
    right: 15,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContactInnerView: {
    alignItems: 'center',
    paddingHorizontal: wp(1.5),
  },
  selectedContactImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignSelf: 'center',
    // borderWidth: 0.5,
  },
  deSelectedContactImage: {
    width: wp(2),
    height: wp(2),
    alignSelf: 'center',
    justifyContent: 'center',
    // borderWidth: 0.5,
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
  },
});
export default MessageEditInviteeScreen;
