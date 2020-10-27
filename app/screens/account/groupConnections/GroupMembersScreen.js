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
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import UserRoleView from '../../../components/groupConnections/UserRoleView';

import TCScrollableTabs from '../../../components/TCScrollableTabs';
import TCSearchBox from '../../../components/TCSearchBox';
import TCNoDataView from '../../../components/TCNoDataView';
import TCProfileView from '../../../components/TCProfileView';

import {
  getFollowersList, getMembersList,
} from '../../../api/Accountapi';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import * as Utility from '../../../utils/index';
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
export default function GroupMembersScreen({ navigation }) {
  const actionSheet = useRef();
  // For activity indigator
  const [loading, setloading] = useState(true);
  const actionSheetInvite = useRef();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [filter, setFilter] = useState([filterArray]);
  const [members, setMembers] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    getFollowers()
    getMembers()
  }, [])

  const getFollowers = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    getFollowersList(entity.uid)
      .then((response) => {
        setFollowers(response.payload)

        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
      });
  }
  const getMembers = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    getMembersList(entity.uid)
      .then((response) => {
        setMembers(response.payload)

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
  }, [navigation]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const isIconCheckedOrNot = ({ item, index }) => {
    console.log('SELECTED:::', index);
    // eslint-disable-next-line no-param-reassign
    item.isSelected = !item.isSelected;

    setFilter([...filter]);

    // eslint-disable-next-line no-restricted-syntax
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
      <TCScrollableTabs>
        <View tabLabel='Members' style={{ flex: 1 }}>
          <View style={styles.searchBarView}>
            <TCSearchBox value={searchText} onChangeText={(text) => setSearchText(text)}/>
            <TouchableWithoutFeedback onPress={() => toggleModal()}>
              <Image source={ images.filterIcon } style={ styles.filterImage } />
            </TouchableWithoutFeedback>
          </View>

          {members.length > 0 ? <FlatList
                  data={members}
                  renderItem={({ item }) => <UserRoleView data = {item} onPressProfile = {() => navigation.navigate('MembersProfileScreen')}/>}
                  keyExtractor={(item, index) => index.toString()}
                  /> : <TCNoDataView title={'No Members Found'}/>}

        </View>
        <View tabLabel='Followers' style={{ flex: 1 }}>
          {followers.length > 0 ? <FlatList
                  data={followers}
                  renderItem={({ item }) => <View>
                    <TCProfileView marginLeft={20} marginTop={20} image={item.thumbnail ? { uri: item.thumbnail } : images.profilePlaceHolder} name={`${item.first_name} ${item.last_name}`} location={`${item.city}, ${item.state_abbr}, ${item.country}`} type={'medium'}/>
                    <TCThinDivider width={'90%'} marginBottom={5} />
                  </View>}
                  keyExtractor={(item, index) => index.toString()}
                  /> : <TCNoDataView title={'No Followers Found'}/>}
        </View>
      </TCScrollableTabs>
      <ActionSheet
                ref={actionSheet}
                // title={'News Feed Post'}
                options={['Group Message', 'Invite Member', 'Create Member Profile', 'Connect Member Account', 'Privacy Setting', 'Setting', 'Cancel']}
                cancelButtonIndex={6}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    navigation.navigate('InvitationSentScreen');
                  } else if (index === 1) {
                    actionSheetInvite.current.show();
                  } else if (index === 2) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 3) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 4) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 5) {
                    console.log('Pressed sheet :', index);
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
  filterImage: {
    marginLeft: 10,
    alignSelf: 'center',
    height: 25,
    resizeMode: 'contain',
    width: 25,
  },
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
