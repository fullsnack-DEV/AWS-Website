import React, { useState, useEffect, useContext } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TCSearchBox from '../../components/TCSearchBox';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QBcreateDialog, QBgetAllUsers } from '../../utils/QuickBlox';
import AuthContext from '../../auth/context'
import TCScrollableTabs from '../../components/TCScrollableTabs';

const MessageInviteScreen = ({ navigation, route }) => {
  const authContext = useContext(AuthContext)
  const TAB_ITEMS = ['All', 'People', 'Teams', 'Clubs', 'Leagues'];
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
  const Item = ({
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
        <LinearGradient
        colors={isChecked ? [colors.greenGradientStart, colors.greenGradientEnd] : [colors.offwhite, colors.offwhite]}
        style={[styles.listItems, { padding: 10 }]}>
          <View style={{
            flexDirection: 'row',
          }}>
            <FastImage resizeMode={'contain'} source={finalImage} style={styles.imageContainer}/>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              <View style={{
                flex: 3, justifyContent: 'center', marginLeft: hp(1),
              }}>
                <Text style={{ ...styles.title, color: isChecked ? colors.whiteColor : colors.lightBlackColor }}>{fullName}</Text>
                <Text style={{ ...styles.subTitle, color: isChecked ? colors.whiteColor : colors.lightBlackColor }}>{city}</Text>
              </View>
              {isChecked ? <Image source={images.checkGreen} resizeMode={'contain'} style={ styles.checkboxImg }/>
                : <Image source={images.whiteUncheck} resizeMode={'contain'} style={ styles.checkboxImg }/>
            }
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>)
  }

  const renderSelectedContactList = ({ item }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = _.get(customData, ['full_name'], '')
    const fullImage = _.get(customData, ['full_image'], '');
    const placeHolderImage = entityType === 'player'
      ? images.profilePlaceHolder
      : images.groupUsers;
    const finalImage = fullImage
      ? { uri: fullImage }
      : placeHolderImage

    return (
      <View style={styles.selectedContactInnerView}>
        <View>
          <View>
            <FastImage
              resizeMode={'contain'}
              source={finalImage}
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
  };

  const toggleSelection = (isChecked, user) => {
    const data = selectedInvitees;
    if (isChecked) {
      const uIndex = data.findIndex(({ id }) => user.id === id);
      if (uIndex !== -1) data.splice(uIndex, 1);
    } else {
      data.push(user);
    }
    setSelectedInvitees([...data]);
  };

  const renderItem = ({ item }) => {
    const isChecked = selectedInvitees.some((val) => {
      if (val.id === item.id) {
        return true;
      }
      return false
    })
    return (
      <Item
        item={item}
        onPress={() => toggleSelection(isChecked, item)}
        isChecked={isChecked}
      />
    );
  };
  const renderSingleTab = (data) => (
    <View style={{ margin: wp(3) }}>
      <FlatList
          ListEmptyComponent={
            <Text style={{
              textAlign: 'center',
              marginTop: hp(2),
              color: colors.userPostTimeColor,
            }}>No Records Found</Text>}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
    </View>
  )
  const renderTabContain = (tabKey, tabIndex) => {
    const dataTabList = [inviteeData, peopleData, teamsData, clubsData, leaguesData]
    return (
      <View tabLabel={tabKey} style={{ flex: 1 }}>
        {renderSingleTab(searchText === '' ? dataTabList[tabIndex] : searchData)}
      </View>
    )
  }
  const handlePress = () => {
    if (route?.params?.dialog) {
      navigation.replace('MessageNewGroupScreen', {
        selectedInviteesData: selectedInvitees,
        participants: route?.params?.participants,
        dialog: route?.params?.dialog,
      });
    } else {
      const occupantsIds = []
      selectedInvitees.filter((item) => occupantsIds.push(item.id))
      if (occupantsIds.length > 0) {
        if (occupantsIds.length === 1) {
          QBcreateDialog(occupantsIds).then((res) => {
            setSelectedInvitees([]);
            navigation.replace('MessageChat', {
              screen: 'MessageChatRoom',
              params: { dialog: res },
            });
          }).catch((error) => {
            console.log(error);
          })
        } else {
          setSelectedInvitees([]);
          navigation.replace('MessageNewGroupScreen', {
            selectedInviteesData: selectedInvitees,
          });
        }
      } else {
        Alert.alert('Select Members')
      }
    }
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
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
          <TouchableOpacity style={{ padding: 2 }} onPress={handlePress}>
            <Text style={{ ...styles.eventTextStyle, fontSize: 14 }}>
              {
                selectedInvitees
                && (selectedInvitees.length > 1 || route?.params?.dialog)
                  ? 'Next'
                  : 'Create'}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.separateLine } />
      <ActivityLoader visible={loading}/>
      {selectedInvitees.length > 0 && (
        <View style={styles.selectedInviteesMainView}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={selectedInvitees || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSelectedContactList}
            extraData={selectedInvitees}
          />
        </View>
      )}
      <TCSearchBox style={{ marginHorizontal: 15 }}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}/>
      <View style={styles.sperateLine}/>
      <TCScrollableTabs
            onChangeTab={(ChangeTab) => {
              setCurrentTab(ChangeTab.i)
              setSearchText('')
            }}
      >
        {TAB_ITEMS?.map((item, index) => (
          renderTabContain(item, index)
        ))}
      </TCScrollableTabs>
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
    width: wp(12),
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
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 0,
  },
  checkboxImg: {
    width: wp('10%'),

    // paddingLeft: wp('25%'),
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
    marginBottom: hp(2),
  },
});
export default MessageInviteScreen;
