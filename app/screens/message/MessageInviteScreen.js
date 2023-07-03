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
import { StreamChat } from 'stream-chat';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../utils';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import TCGroupNameBadge from '../../components/TCGroupNameBadge';
import {strings} from '../../../Localization/translation';
import {upsertUserInstance, allStreamUserData, STREAMCHATKEY} from '../../utils/streamChat';
import { getGroupIndex } from '../../api/elasticSearch';


const MessageInviteScreen = ({navigation}) => {
  const chatClient = StreamChat.getInstance(STREAMCHATKEY);
  const authContext = useContext(AuthContext);
  const TAB_ITEMS = [
    strings.allType,
    strings.peopleTitleText,
    strings.teamsTitleText,
    strings.clubsTitleText
  ];
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [inviteeData, setInviteeData] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllUsers();
  }, []);

  
  useEffect(() => {
    if (searchText !== '') {
      const dataTabList = [
        inviteeData,
        peopleData,
        teamsData,
        clubsData,
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
        a.user?.name
          ?.toLowerCase()
          .toString()
          .match(searchStr.toLowerCase().toString()),
      );
      setSearchData([...answer]);
    }
  }, [searchText]);



  const getAllUsers = async() => {
    setLoading(false);
    const users = await allStreamUserData();
    console.log('Users', users)
    getAllTypesData(users); 
  };


  const getAllGroups = async() => {
    const teamsQuery = {
      size: 100,
      // from: teamsPageFrom,
      query: {
        bool: {
          must: [{term: {is_pause: false}}],
          // should : [{term: {under_terminate: false}}]
        },
      },
    };
    const res = await getGroupIndex(teamsQuery);
    return res;
  }


  const getAllTypesData = async (AllUsers) => {
    if(AllUsers) {
      const entity = authContext.entity;
      const myUid  = entity.obj.user_id;
      const users  = AllUsers.filter((item) => item.user.id !== myUid);
      const groups = await getAllGroups()

      const allData = [];
      const personData = [];
      const clubData   = [];
      const teamData   = [];


      users.map((item) => {
        const entityType = item.user.entityType;
        if (entityType === 'player' || entityType === 'user') {
          personData.push(item.user);
        }
        allData.push(item.user)
        return null;
      });

      if(groups !== undefined) {
        groups.map((item) => {
          const entityType = item.entity_type;
          if (entityType === 'club') {
            clubData.push(item);
          } else if (entityType === 'team') {
            teamData.push(item);
          } 
          allData.push(item)
          return null
        });
      }
     
      setInviteeData([...allData]);
      setPeopleData([...personData]);
      setClubsData([...clubData]);
      setTeamsData([...teamData]);
      setLoading(false);
    }
  };


  const Item = useCallback(({item, onPress, style, isChecked}) => {
    const entityType = item?.entityType;
    const fullName   = item?.name;
    const fullImage  = item?.image;
    const city       = item?.city;
    const placeHolderImage = entityType === 'player' ? images.profilePlaceHolder : images.groupUsers;
    const finalImage = fullImage ? {uri: fullImage} : placeHolderImage;
    return (
      <TouchableOpacity onPress={onPress} style={[styles.listItems, style]}>
        <View
          colors={
            isChecked
              ? [colors.greenGradientStart, colors.greenGradientEnd]
              : [colors.offwhite, colors.offwhite]
          }
          style={[styles.listItems, {padding: 10}]}>
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
  }, []);



  const toggleSelection = useCallback(
    (isChecked, user) => {
      if (isChecked) {
        const uIndex = selectedInvitees.findIndex(
          (item) => user?.id === item?.id,
        );
        if (uIndex !== -1) selectedInvitees.splice(uIndex, 1);
      } else {
        selectedInvitees.push(user);
      }
      setSelectedInvitees([...selectedInvitees]);
    },
    [selectedInvitees],
  );

  

  const renderSelectedContactList = useCallback(
    ({item}) => {
      const fullName   = item.name;
      return (
        <View style={styles.selectedContactInnerView}>
          <View>
            <View>
              <View style={styles.selectedContactImageContainer}>
                <FastImage
                  resizeMode={'contain'}
                  source={images.profilePlaceHolder}
                  style={styles.selectedContactImage}
                />
              </View>
              <TouchableOpacity
                style={styles.selectedContactButtonView}
                onPress={() => toggleSelection(true, item)}>
                <Image
                  source={images.cancelWhite}
                  style={styles.deSelectedContactImage}
                />
              </TouchableOpacity>
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
    [toggleSelection],
  );


  const renderItem = useCallback(
    ({item}) => {
      const isChecked = selectedInvitees.some((val) => val.id === item.id);
      return (
        <Item
          item={item}
          onPress={() => toggleSelection(isChecked, item)}
          isChecked={isChecked}
        />
      );
    },
    [selectedInvitees, toggleSelection],
  );


  const ListEmptyComponent = useMemo(
    () => (
      <Text
        style={{
          textAlign: 'center',
          marginTop: hp(2),
          color: colors.userPostTimeColor,
        }}>
        {strings.noRecordFoundText}
      </Text>
    ),
    [],
  );


  const renderSingleTab = useCallback(
    (data) => (
      <SafeAreaView style={{margin: wp(3), flex: 1}}>
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
      </SafeAreaView>
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
      loading,
      peopleData,
      renderSingleTab,
      searchData,
      searchText,
      teamsData,
    ],
  );


  const getCurrentUserObject = () => {
    const user = {
      user : {
        id          : authContext.entity?.obj?.user_id,
        name        : authContext.entity?.obj?.first_name,
        entityType  : authContext.entity?.obj?.entity_type,
        image       : null
      }
    }
    return user;
  }


  const handlePress = async() => {
    const occupantsIds = [];
    const members = [...selectedInvitees]
    selectedInvitees.filter((item) => occupantsIds.push(item.id));
    const currentUser = getCurrentUserObject();
    if (occupantsIds.length > 0) {
      if (occupantsIds.length === 1) {
        members.push(currentUser)
        await upsertUserInstance(authContext);
        const channel = chatClient.channel('messaging', null, {
          members,
        });
        navigation.replace('MessageChatScreen', {
          channel
        });
      } else {
        navigation.replace('MessageNewGroupScreen', {
          selectedInviteesData: selectedInvitees,
        });
      }
    } else {
      Alert.alert(strings.selectMembers);
    }
  }


  const renderHeader = useMemo(
    () => (
      <ScreenHeader
        title={'Invite'}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack()
        }}
        isRightIconText
        rightButtonText={selectedInvitees && selectedInvitees.length > 1
          ? strings.next
          : strings.create}
        onRightButtonPress={() => {
          handlePress();
        }}
        loading={loading}
        containerStyle={{
          paddingLeft: 10,
          paddingRight: 17,
          paddingTop: 8,
          paddingBottom: 13,
          borderBottomWidth: 0,
        }}
      />
    ),
    [handlePress, navigation, selectedInvitees],
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
      <View style={{flex: 1}}>
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
                width: wp(100) / 4,
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
      <View
        style={{
          backgroundColor: colors.whiteColor,
          width: '100%',
          padding: 15,
        }}>
        <TextInput
          autoFocus={true}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.textInputStyle}
          placeholder={strings.searchText}
        />
      </View>
      {renderSelectedInvitees}
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
    backgroundColor: colors.textFieldBackground,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 1,
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
    lineHeight: 24
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
    height: Platform.OS === 'ios' ? hp(10) : hp(14),
    width: wp('100%'),
    paddingVertical: hp(0.5),
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
  },
  deSelectedContactImage: {
    width: wp(2),
    height: wp(2),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  separateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
});
export default MessageInviteScreen;
