import React, {
  useState, useLayoutEffect, useRef, useEffect,
} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  SectionList,
  Alert,
  FlatList,

} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import * as Utility from '../../../utils/index';
import UserRoleView from '../../../components/groupConnections/UserRoleView';
import TCSearchBox from '../../../components/TCSearchBox';
import TCNoDataView from '../../../components/TCNoDataView';

import {
  getGroupMembers,
} from '../../../api/Groups';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import images from '../../../Constants/ImagePath'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCThinDivider from '../../../components/TCThinDivider';

// FIXME -this is static source for now we will inject with api call
const filterArray = [
  {
    id: 1,
    optionName: 'Teams',
    data: [
      {
        id: 1,
        innerOptionName: 'All Clubs',
        isSelected: false,
      },
      {
        id: 2,
        innerOptionName: 'Tiger Youths',
        isSelected: false,
      },
      {
        id: 3,
        innerOptionName: 'Tiger Cups',
        isSelected: false,
      },
    ],
  },
  {
    id: 2,
    optionName: 'Roles',
    data: [
      {
        id: 1,
        innerOptionName: 'All',
        isSelected: false,
      },
      {
        id: 2,
        innerOptionName: 'Admin',
        isSelected: false,
      },
      {
        id: 3,
        innerOptionName: 'Coach',
        isSelected: false,
      },
      {
        id: 4,
        innerOptionName: 'Player',
        isSelected: false,
      },
    ],
  },
]
let entity = {};
export default function GroupMembersScreen({ navigation, route }) {
  const actionSheet = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(true);
  const actionSheetInvite = useRef();
  const [searchMember, setSearchMember] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [filter, setFilter] = useState([filterArray]);
  const [members, setMembers] = useState([]);
  const [switchUser, setSwitchUser] = useState({})

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
      setSwitchUser(entity)
    }
    getMembers()
    getAuthEntity()
  }, [isFocused])

  const getMembers = async () => {
    getGroupMembers(route.params.groupID)
      .then((response) => {
        setMembers(response.payload)
        setSearchMember(response.payload)
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => actionSheet.current.show() }>
          <Image source={ images.horizontal3Dot } style={ styles.navigationRightItem } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, switchUser]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);
    // eslint-disable-next-line no-param-reassign
    item.isSelected = !item.isSelected;

    setFilter([...filter]);

    for (const temp of filter) {
      if (temp.isSelected) {
        setFilter.push(temp.data);
      }
    }
  };
  const makAllSelected = () => {
    setAllSelected(!allSelected)
    const arr = filterArray.map((el) => (
      // eslint-disable-next-line no-return-assign
      el.data.map((d) => (
      // eslint-disable-next-line no-param-reassign
        d.isSelected = !allSelected
      ))
    ))
    setFilter(arr);
  }
  const searchFilterFunction = (text) => {
    const result = searchMember.filter(
      (x) => x.first_name.includes(text) || x.last_name.includes(text),
    );
    setMembers(result);
  };
  const renderFilterItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => {
      isIconCheckedOrNot({ item, index });
    }}>

      {item.isSelected ? <LinearGradient
       colors={[colors.greenGradientStart, colors.greenGradientEnd]}
       style={styles.rowStyleSelected}>
        <Text style={styles.rowTitle}>{item.innerOptionName}</Text>
        <Image source={images.checkGreen} style={styles.checkGreenImage}/>
      </LinearGradient>
        : <View
        style={styles.rowStyleUnSelected}>
          <Text style={styles.rowTitleBlack}>{item.innerOptionName}</Text>
          <Image source={images.uncheckWhite} style={styles.rowCheckImage}/>
        </View>
      }
    </TouchableWithoutFeedback>
  );
  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View tabLabel='Members' style={{ flex: 1 }}>
        <View style={styles.searchBarView}>
          <TCSearchBox onChangeText={ (text) => searchFilterFunction(text) }/>
          {/* <TouchableWithoutFeedback onPress={() => toggleModal()}>
            <Image source={ images.filterIcon } style={ styles.filterImage } />
          </TouchableWithoutFeedback> */}
        </View>

        {members.length > 0 ? <FlatList
                  data={members}
                  renderItem={({ item }) => <UserRoleView data = {item}
                   onPressProfile = {() => navigation.navigate('MembersProfileScreen', { memberID: item.user_id, whoSeeID: item.group_member_detail.group_id, groupID: route.params.groupID })}
                   onPressMessage ={() => {
                     console.log('EMAIL PRESSED');
                     // Linking.openURL(`mailto:${item.email}`);
                   }}/>}
                  keyExtractor={(item, index) => index.toString()}
                  /> : <TCNoDataView title={'No Members Found'}/>}

      </View>
      <ActionSheet
                ref={actionSheet}
                // title={'News Feed Post'}
                options={switchUser.role === 'club' ? ['Group Message', 'Invite Member', 'Create Member Profile', 'Connect Member Account', 'Privacy Setting', 'Setting', 'Cancel']
                  : ['Group Message', 'Invite Member', 'Create Member Profile', 'Connect Member Account', 'Privacy Setting', 'Cancel']}
                cancelButtonIndex={switchUser.role === 'club' ? 6 : 5}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    // navigation.navigate('InvitationSentScreen');
                  } else if (index === 1) {
                    actionSheetInvite.current.show();
                  } else if (index === 2) {
                    navigation.navigate('CreateMemberProfileForm1');
                  } else if (index === 3) {
                    navigation.navigate('ConnectMemberAccountScreen', { groupID: route.params.groupID });
                  } else if (index === 4) {
                    navigation.navigate('MembersViewPrivacyScreen');
                  } else if (index === 5) {
                    navigation.navigate('ClubSettingScreen');
                  }
                }}
              />
      <ActionSheet
                ref={actionSheetInvite}
                // title={'News Feed Post'}
                options={['Invite by Search', 'Invite by E-mail', 'Cancel']}
                cancelButtonIndex={2}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    navigation.navigate('InviteMembersBySearchScreen');
                  } else if (index === 1) {
                    navigation.navigate('InviteMembersByEmailScreen');
                  }
                }}
              />
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        backdropOpacity={0}
        style={{ marginLeft: 0, marginRight: 0, marginBottom: 0 }}>
        <View style={styles.modelHeaderContainer}>
          <View style={styles.headerView}>
            <TouchableWithoutFeedback style={styles.closeButtonView} onPress={() => toggleModal()}>
              <Image source={images.cancelImage} style={styles.closeButton}/>
            </TouchableWithoutFeedback>
            <Text
              style={styles.headerTitle}>
              Filters
            </Text>
            <Text style={styles.doneButton} onPress={() => toggleModal()}>
              Done
            </Text>
          </View>
          <TCThinDivider width={'100%'}/>
          <TouchableWithoutFeedback onPress={() => makAllSelected()}>
            <View style={styles.allButtonContainer}><Text style={styles.allTextButton}>All</Text>
              {allSelected ? <Image source={images.checkWhiteLanguage} style={styles.checkImage}></Image>
                : <Image source={images.uncheckWhite} style={styles.checkImage}></Image>}</View>
          </TouchableWithoutFeedback>
          <SectionList
                  sections={filterArray}
                  renderItem={renderFilterItem}
                  renderSectionHeader={({ section }) => <Text style={styles.SectionHeaderStyle}>{section.optionName}</Text>}
                  keyExtractor={(item, index) => index}
                  style={styles.sectionListStyle}
                  showsVerticalScrollIndicator={false}
                />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  // filterImage: {
  //   marginLeft: 10,
  //   alignSelf: 'center',
  //   height: 25,
  //   resizeMode: 'contain',
  //   width: 25,
  // },
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  // Model styles start from here
  modelHeaderContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 1.5,
    backgroundColor: colors.whiteColor,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  closeButtonView: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
  },
  closeButton: {
    width: 15,
    height: 30,
    resizeMode: 'contain',
  },

  doneButton: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },

  allTextButton: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    marginRight: 10,
    alignSelf: 'flex-end',
    color: colors.lightBlackColor,
  },
  checkImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  sectionListStyle: {
    marginLeft: 25,
    marginRight: 25,
  },
  SectionHeaderStyle: {
    fontWeight: '600',
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: colors.whiteColor,
  },
  rowStyleSelected: {
    height: 45,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    resizeMode: 'contain',
    justifyContent: 'space-between',

  },
  rowStyleUnSelected: {
    height: 45,
    backgroundColor: colors.offwhite,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    resizeMode: 'contain',
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
  },
  rowTitleBlack: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  rowCheckImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    tintColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  allButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 30,
    marginTop: 20,
  },
});
