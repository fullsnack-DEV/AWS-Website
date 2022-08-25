import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
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
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../utils';
import {
  getQBProfilePic,
  QBgetAllUsers,
  QBupdateDialogInvitees,
} from '../../utils/QuickBlox';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import TCGroupNameBadge from '../../components/TCGroupNameBadge';

const MessageEditInviteeScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const TAB_ITEMS = ['All', 'People', 'Teams', 'Clubs', 'Leagues'];
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [existingMembers] = useState(route?.params?.participants ?? []);

  const [inviteeData, setInviteeData] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [leaguesData, setLeaguesData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dialog] = useState(route?.params?.dialog);
  // eslint-disable-next-line no-unused-vars
  const [onPressDone] = useState(route?.params?.onPressDone);

  useEffect(() => {
    const setParticipants = async () => {
      if (route?.params?.participants) {
        const entity = authContext.entity;
        const myUid = entity.QB.id;
        const participants = route.params.participants.filter(
          (item) => item.id !== myUid,
        );
        setSelectedInvitees(participants);
      }
    };
    setParticipants();
    getAllUsers();
  }, []);

  useEffect(() => {
    if (searchText !== '') {
      const dataTabList = [
        inviteeData,
        peopleData,
        teamsData,
        clubsData,
        leaguesData,
      ];
      const data = dataTabList[currentTab];

      const escapeRegExp = (str) => {
        if (!_.isString(str)) {
          return '';
        }
        return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
      };
      const searchStr = escapeRegExp(searchText);
      const answer = data?.filter((a) =>
        a.fullName
          .toLowerCase()
          .toString()
          .match(searchStr.toLowerCase().toString()),
      );
      setSearchData([...answer]);
    }
  }, [searchText]);

  const getAllUsers = () => {
    setLoading(true);
    QBgetAllUsers(QB)
      .then((res) => {
        getAllTypesData(res.users);
      })
      .catch(() => {
        setInviteeData([]);
        setLoading(false);
      });
  };

  const getAllTypesData = async (AllUsers) => {
    const entity = authContext.entity;
    const myUid = entity.QB.id;
    const users = AllUsers.filter((user) => user.id !== myUid);
    setInviteeData(users);
    const personData = [];
    const clubData = [];
    const teamData = [];
    const leagueData = [];
    users.map((item) => {
      const customData =
        item && item.customData ? JSON.parse(item.customData) : {};
      const entityType = _.get(customData, ['entity_type'], '');
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
  };
  const Item = useCallback(
    ({item, onPress, style, isChecked, isDisabled = false}) => {
      const customData = item?.customData ? JSON.parse(item.customData) : {};
      const entityType = _.get(customData, ['entity_type'], '');
      const fullName = customData?.full_name ?? customData?.group_name;
      const fullImage = _.get(customData, ['full_image'], '');
      const city = _.get(customData, ['city'], '');
      const placeHolderImage =
        entityType === 'player' ? images.profilePlaceHolder : images.groupUsers;
      const finalImage = fullImage ? {uri: fullImage} : placeHolderImage;
      return (
        <TouchableOpacity
          onPress={onPress}
          style={[styles.listItems, style]}
          disabled={isDisabled}>
          <View
            colors={
              isChecked
                ? [colors.greenGradientStart, colors.greenGradientEnd]
                : [colors.offwhite, colors.offwhite]
            }
            style={[
              styles.listItems,
              {padding: 10, opacity: isDisabled ? 0.5 : 1},
            ]}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={styles.imageMainContainer}>
                <FastImage
                  resizeMode={'cover'}
                  source={finalImage}
                  style={styles.imageContainer}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <View
                  style={{
                    flex: 3,
                    justifyContent: 'center',
                    marginLeft: hp(1),
                  }}>
                  <TCGroupNameBadge
                    textStyle={{...styles.title, color: colors.lightBlackColor}}
                    groupType={entityType}
                    name={fullName}
                  />
                  <Text
                    style={{...styles.subTitle, color: colors.lightBlackColor}}>
                    {city}
                  </Text>
                </View>
                {isChecked ? (
                  <Image
                    source={images.yellowCheckBox}
                    resizeMode={'contain'}
                    style={styles.checkboxImg}
                  />
                ) : (
                  <Image
                    source={images.messageCheckboxBorder}
                    resizeMode={'contain'}
                    style={styles.checkboxImg}
                  />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [],
  );

  const toggleSelection = useCallback(
    (isChecked, user) => {
      if (isChecked) {
        if (dialog) {
          const fromExistingUser = dialog?.occupantsIds?.findIndex(
            (item) => item === user?.id,
          );
          if (!route?.params?.isAdmin && fromExistingUser !== -1) {
            Alert.alert('TownsCup', 'Group admin can remove user');
          } else {
            const uIndex = selectedInvitees.findIndex(
              (item) => user?.id === item?.id,
            );
            if (uIndex !== -1) selectedInvitees.splice(uIndex, 1);
          }
        }
      } else {
        selectedInvitees.push(user);
      }
      setSelectedInvitees([...selectedInvitees]);
    },
    [dialog, route?.params?.isAdmin, selectedInvitees],
  );

  const renderSelectedContactList = useCallback(
    ({item}) => {
      console.log('IIIIII', item);
      const customData =
        item && item.customData ? JSON.parse(item.customData) : {};
      const entityType = _.get(customData, ['entity_type'], '');
      const fullName = _.get(customData, ['full_name'], '');
      const fullImage = _.get(customData, ['full_image'], '');
      const type =
        entityType === 'player'
          ? QB.chat.DIALOG_TYPE.CHAT
          : QB.chat.DIALOG_TYPE.GROUP_CHAT;

      const temp = existingMembers.filter((obj) => obj.id === item.id);
      const isExistingUser = temp.length > 0;

      return (
        <View style={styles.selectedContactInnerView}>
          <View>
            <View>
              <View style={styles.selectedContactImageContainer}>
                <FastImage
                  resizeMode={'contain'}
                  source={getQBProfilePic(type, '', fullImage)}
                  style={styles.selectedContactImage}
                />
              </View>
              {!isExistingUser && (
                <TouchableOpacity
                  style={styles.selectedContactButtonView}
                  onPress={() => toggleSelection(true, item)}>
                  <Image
                    source={images.cancelWhite}
                    style={styles.deSelectedContactImage}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={{
                flex: 1,
                fontSize: 10,
                fontFamily: fonts.RBold,
                textAlign: 'center',
                width: 50,
              }}>
              {fullName}
            </Text>
          </View>
        </View>
      );
    },
    [existingMembers, toggleSelection],
  );

  const renderItem = useCallback(
    ({item}) => {
      const isChecked = selectedInvitees.some((val) => val.id === item.id);
      const temp = existingMembers.filter((obj) => obj.id === item.id);
      const isExistingUser = temp.length > 0;
      return (
        <Item
          item={item}
          onPress={() => toggleSelection(isChecked, item)}
          isChecked={isChecked}
          isDisabled={isExistingUser}
        />
      );
    },
    [existingMembers, selectedInvitees, toggleSelection],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <Text
        style={{
          textAlign: 'center',
          marginTop: hp(2),
          color: colors.userPostTimeColor,
        }}>
        No Records Found
      </Text>
    ),
    [],
  );

  const renderSingleTab = useCallback(
    (data) => (
      <View style={{margin: wp(3)}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          legacyImplementation={true}
          maxToRenderPerBatch={10}
          initialNumToRender={5}
          ItemSeparatorComponent={() => (
            <View
              style={{height: 1, backgroundColor: colors.grayBackgroundColor}}
            />
          )}
          ListEmptyComponent={ListEmptyComponent}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    ),
    [ListEmptyComponent, renderItem],
  );

  const renderTabContain = useCallback(
    (tabKey, tabIndex) => {
      const dataTabList = [
        inviteeData,
        peopleData,
        teamsData,
        clubsData,
        leaguesData,
      ];
      return (
        tabIndex === currentTab && (
          <View tabLabel={tabKey} style={{flex: 1}}>
            {loading ? (
              <UserListShimmer />
            ) : (
              renderSingleTab(
                searchText === '' ? dataTabList[tabIndex] : searchData,
              )
            )}
          </View>
        )
      );
    },
    [
      clubsData,
      currentTab,
      inviteeData,
      leaguesData,
      loading,
      peopleData,
      renderSingleTab,
      searchData,
      searchText,
      teamsData,
    ],
  );

  const handlePress = useCallback(() => {
    if (dialog) {
      const occupantsIds = [];
      selectedInvitees.filter((item) => occupantsIds.push(item.id));
      const participantsIds = [];
      const participants = route?.params?.participants ?? [];
      participants.filter((item) => participantsIds.push(item.id));
      const dialogId = dialog?.id;
      const myQbUserID = authContext?.entity?.QB?.id;

      const removeUsers = participantsIds.filter(
        (item) => item !== myQbUserID && !occupantsIds.includes(item),
      );
      const addUsers = occupantsIds.filter(
        (item) => myQbUserID !== item && !participantsIds.includes(item),
      );
      QBupdateDialogInvitees(dialogId, addUsers, removeUsers)
        .then((res) => {
          setSelectedInvitees([]);
          console.log('RRRRRRRRRR', res);
          // onPressDone(res)
          navigation.navigate('MessageChat', {dialog: res});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [
    authContext?.entity?.QB?.id,
    dialog,
    navigation,
    route?.params?.participants,
    selectedInvitees,
  ]);

  const renderHeader = useMemo(
    () => (
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FastImage
              resizeMode={'contain'}
              source={images.backArrow}
              style={styles.backImageStyle}
            />
          </TouchableOpacity>
        }
        centerComponent={<Text style={styles.eventTitleTextStyle}>Invite</Text>}
        rightComponent={
          <TouchableOpacity onPress={handlePress}>
            <Text style={{...styles.eventTextStyle, fontSize: 14}}>Done</Text>
          </TouchableOpacity>
        }
      />
    ),
    [handlePress, navigation],
  );

  const renderSelectedInvitees = useMemo(
    () =>
      selectedInvitees.length > 0 && (
        <View style={styles.selectedInviteesMainView}>
          <FlatList
            style={{paddingHorizontal: 15}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            data={selectedInvitees || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSelectedContactList}
            extraData={selectedInvitees}
          />
        </View>
      ),
    [renderSelectedContactList, selectedInvitees],
  );

  const renderTabs = useMemo(
    () => (
      <View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            height: 45,
          }}>
          {TAB_ITEMS.map((item, index) => (
            <TouchableOpacity
              activeOpacity={1}
              key={index}
              style={{
                width: wp(100) / 5,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setCurrentTab(index);
                setSearchText('');
              }}>
              <View
                style={{
                  width: '100%',
                  height: 43,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    fontSize: 16,
                    textAlign: 'center',
                    fontFamily:
                      currentTab === index ? fonts.RBold : fonts.RRegular,
                    color:
                      currentTab === index
                        ? colors.darkYellowColor
                        : colors.lightBlackColor,
                  }}>
                  {item}
                </Text>
              </View>
              <LinearGradient
                colors={
                  currentTab === index
                    ? [colors.themeColor, colors.themeColor3]
                    : [colors.thinDividerColor, 'transparent']
                }
                style={{
                  alignSelf: 'flex-end',
                  width: '100%',
                  height: currentTab === index ? 3 : 1,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flex: 1, width: wp(100)}}>
          {TAB_ITEMS?.map(renderTabContain)}
        </View>
      </View>
    ),
    [TAB_ITEMS, currentTab],
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderHeader}
      <View style={styles.separateLine} />
      {renderSelectedInvitees}
      <View
        style={{
          backgroundColor: colors.grayBackgroundColor,
          width: '100%',
          padding: 15,
        }}>
        <TextInput
          autoFocus={true}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.textInputStyle}
          placeholder={'Search'}
        />
      </View>
      <View style={styles.sperateLine} />
      {renderTabs}
    </SafeAreaView>
  );
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
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 1,
    elevation: 1,
  },
  backImageStyle: {
    height: 20,
    width: 10,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  eventTextStyle: {
    color: colors.lightBlackColor,
    width: wp(12),
    fontSize: 10,
    fontFamily: fonts.RMedium,
    alignSelf: 'center',
  },
  imageMainContainer: {
    height: 40,
    width: 40,
    backgroundColor: colors.whiteColor,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.16,
    shadowRadius: 1.5,
    elevation: 1.5,
  },
  imageContainer: {
    height: 36,
    width: 36,
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
    right: 0,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContactInnerView: {
    alignItems: 'center',
    marginRight: 20,
  },
  selectedContactImageContainer: {
    backgroundColor: colors.whiteColor,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
    alignSelf: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    marginBottom: 5,
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedContactImage: {
    width: 41,
    height: 41,
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
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
});
export default MessageEditInviteeScreen;
