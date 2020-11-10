import React, { useState, useEffect } from 'react';
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
import { normalize } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TCSearchBox from '../../components/TCSearchBox';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QBcreateDialog, QBgetAllUsers } from '../../utils/QuickBlox';
import * as Utility from '../../utils';

const MessageInviteScreen = ({ navigation }) => {
  const TAB_ITEMS = ['All', 'People', 'Teams', 'Clubs', 'Leagues'];
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [inViteeData, setInviteeData] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [clubsData, setClubsData] = useState([]);
  const [leaguesData, setLeaguesData] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    setLoading(true);
    QBgetAllUsers().then((res) => {
      getAllTypesData(res.users)
      setLoading(false);
    }).catch(() => {
      setInviteeData([]);
      setLoading(false);
    })
    setLoading(false);
  }

  const getAllTypesData = async (AllUsers) => {
    setLoading(true);
    const entity = await Utility.getStorage('loggedInEntity');
    const myUid = await entity.QB.id;
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
    setClubsData(clubData);
    setPeopleData(personData);
    setTeamsData(teamData);
    setLeaguesData(leagueData);
    setLoading(false);
  }
  const Item = ({
    item, onPress, style, isChecked,
  }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = _.get(customData, ['full_name'], '')
    const fullImage = _.get(customData, ['full_image'], '')
    const country = _.get(customData, ['country'], '')
    const placeHolderImage = entityType === 'player'
      ? images.profilePlaceHolder
      : images.groupUsers;
    const finalImage = fullImage
      ? { uri: fullImage }
      : placeHolderImage
    return (
      <TouchableOpacity onPress={onPress} style={[styles.listItems, style]}>
        <LinearGradient
        colors={isChecked ? [colors.greenGradientStart, colors.greenGradientEnd] : [colors.whiteColor, colors.whiteColor]}
        style={[styles.listItems, { marginVertical: hp(0.5), paddingVertical: hp(1.5), paddingRight: wp(2) }]}>
          <View style={{
            flexDirection: 'row',
          }}>
            <FastImage resizeMode={'contain'} source={finalImage} style={styles.imageContainer}/>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              <View style={{
                flex: 3, justifyContent: 'center', marginLeft: hp(1),
              }}>
                <Text style={styles.title}>{fullName}</Text>
                <Text style={styles.subTitle}>{country}</Text>
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
              <Image source={images.cancelImage} style={styles.deSelectedContactImage} />
            </TouchableOpacity>
          </View>
          <Text
            ellipsizeMode={'tail'}
            numberOfLines={2}
            style={{ textAlign: 'center', flex: 1, width: wp(20) }}>
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
  const renderTabContain = (tabKey) => (
    <View style={{ flex: Platform.OS === 'ios' ? 0 : 10 }}>
      {tabKey === 0 && renderSingleTab(inViteeData)}
      {tabKey === 1 && renderSingleTab(peopleData)}
      {tabKey === 2 && renderSingleTab(teamsData)}
      {tabKey === 3 && renderSingleTab(clubsData)}
      {tabKey === 4 && renderSingleTab(leaguesData)}
    </View>
  )
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
          <TouchableOpacity style={{ padding: 2 }} onPress={() => {
            const occupantsIds = []
            selectedInvitees.filter((item) => occupantsIds.push(item.id))
            if (occupantsIds.length > 0) {
              if (occupantsIds.length === 1) {
                QBcreateDialog(occupantsIds).then((res) => {
                  setSelectedInvitees([]);
                  navigation.navigate('MessageChat', {
                    screen: 'MessageChatRoom',
                    params: { dialog: res },
                  });
                }).catch((error) => {
                  console.log(error);
                })
              } else {
                setSelectedInvitees([]);
                navigation.replace('MessageNewGroupScreen', { selectedInviteesData: selectedInvitees });
              }
            } else {
              Alert.alert('Select Members')
            }
          }}>
            <Text style={styles.eventTextStyle}>
              {selectedInvitees && selectedInvitees.length > 1 ? 'Next' : 'Create'}
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

      <TCSearchBox/>
      <View style={styles.sperateLine}/>
      <TCScrollableProfileTabs
        tabItem={TAB_ITEMS}
        onChangeTab={(ChangeTab) => {
          setSelectedInvitees([]);
          setCurrentTab(ChangeTab.i)
        }}
        customStyle={{ flex: 1 }}
        currentTab={currentTab}
        renderTabContain={renderTabContain}

            />
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
    fontSize: normalize(12),
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
  },

  imageContainer: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
  },

  title: {
    flexWrap: 'wrap',
    fontFamily: fonts.RBold,
    fontSize: normalize(14),
    color: colors.lightBlackColor,

  },
  subTitle: {
    fontFamily: fonts.RLight,
    fontSize: normalize(14),
    color: colors.lightBlackColor,
  },

  listItems: {
    padding: hp(0.5),
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
    backgroundColor: colors.lightgrayColor,
    borderRadius: hp(2),
    position: 'absolute',
    top: 0,
    right: 20,
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
