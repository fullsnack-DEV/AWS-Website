import React, {
  useState, useEffect, useMemo, useCallback
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
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
 getQBProfilePic, QB_DIALOG_TYPE, QBcreateDialog
} from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';
import ActivityLoader from '../../components/loader/ActivityLoader';


const MessageNewGroupScreen = ({ route, navigation }) => {

  const { selectedInviteesData } = route.params
  const [selectedInvitees, setSelectedInvitees] = useState([...selectedInviteesData]);
  const [groupName, setGroupName] = useState('');
const [loading,setLoading] = useState(false);
  useEffect(() => {
    if (route?.params?.dialog) {
      setGroupName(route?.params?.dialog?.name)
    }
  }, [])

  const toggleSelection = useCallback((isChecked, user) => {
    const data = selectedInvitees;
    if (isChecked) {
      const uIndex = data.findIndex(({ id }) => user.id === id);
      if (uIndex !== -1) data.splice(uIndex, 1);
    } else {
      data.push(user);
    }
    setSelectedInvitees([...data]);
    if (data.length === 0) {
      navigation.navigate('MessageInviteScreen')
    }
  }, [navigation, selectedInvitees]);

  const renderSelectedContactList = useCallback(({ item }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = _.get(customData, ['full_name'], '')
    const fullImage = _.get(customData, ['full_image'], '')
    const type = entityType === 'player' ? QB.chat.DIALOG_TYPE.CHAT : QB.chat.DIALOG_TYPE.GROUP_CHAT

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
            <TouchableOpacity
                  style={styles.selectedContactButtonView}
                  onPress={() => toggleSelection(true, item)}>
              <Image source={images.cancelImage} style={styles.deSelectedContactImage} />
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
  }, [toggleSelection]);

  const onDonePress = useCallback(() => {
    setLoading(true)
    if (groupName !== '') {
      const occupantsIds = [];

      selectedInvitees.filter((item) => occupantsIds.push(item.id))
      if (occupantsIds.length > 0) {

        console.log('occupantsIds',occupantsIds);
        console.log('QB_DIALOG_TYPE.GROUP',QB_DIALOG_TYPE.GROUP);
        console.log('groupName',groupName);



        QBcreateDialog(occupantsIds, QB_DIALOG_TYPE.GROUP, groupName).then((res) => {
          setLoading(false)

          console.log('rerererererer',res);
          setSelectedInvitees([]);
          console.log('Navigation stack',navigation);
          navigation.replace('MessageChat',{ dialog: res });
          
          
        }).catch((error) => {
          setLoading(false)
          // QBLogout();
          // QBconnectAndSubscribe(authContext.entity)
          console.log(error);
        })
      }
    } else {
      setLoading(false)
      Alert.alert('Enter Chatroom Name')
    }
  }, [groupName, navigation, selectedInvitees])

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FastImage resizeMode={'contain'} source={images.backArrow} style={styles.backImageStyle}/>
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>New Group</Text>
          }
          rightComponent={
            <TouchableOpacity style={{ padding: 2 }} onPress={onDonePress}>
              <Text style={{ ...styles.eventTextStyle, width: 100, textAlign: 'right' }}>Done</Text>
            </TouchableOpacity>
          }
      />
  ), [navigation, onDonePress])

  const renderParticipants = useMemo(() => (
    <View style={styles.participantsContainer}>
      <Text style={styles.participantsText}>Participants</Text>
      {selectedInvitees.length > 0 && (
        <View style={styles.selectedInviteesMainView}>
          <FlatList
                  style={{ flex: 1, alignSelf: 'center' }}
                  contentContainerStyle={{ alignSelf: selectedInvitees.length >= 4 ? 'center' : 'flex-start' }}
                  numColumns={5}
                  showsHorizontalScrollIndicator={false}
                  data={selectedInvitees || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderSelectedContactList}
              />
        </View>
        )}
    </View>
  ), [selectedInvitees])

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading}/>
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={styles.avatarContainer}>
        <TouchableOpacity>
          <View style={{
            height: 80,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: colors.whiteColor,
            shadowColor: colors.googleColor,
            shadowOffset: { width: 0, height: 1.5 },
            shadowOpacity: 0.16,
            shadowRadius: 3,
            elevation: 3,
          }}>
            <FastImage
            resizeMode={'contain'}
            source={images.groupUsers}
            style={styles.imageContainer}
          />
          </View>
          <FastImage
            resizeMode={'contain'}
            source={images.certificateUpload}
            style={styles.absoluteCameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputBoxContainer}>
          <Text style={styles.chatRoomName}>Chatroom Name</Text>
          <View>
            <TCInputBox style={{ borderRadius: 10 }} placeHolderText={'New Group'} value={groupName} onChangeText={setGroupName}/>
          </View>
        </View>
      </View>
      {renderParticipants}
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
    height: 40,
    width: 10,
    tintColor: colors.lightBlackColor,
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
    fontSize: 16,
    fontFamily: fonts.RMedium,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 73,
    width: 73,
    borderRadius: wp(6),
  },
  selectedInviteesMainView: {
    alignItems: 'flex-start',
    flex: 1,
    width: wp(100),
    paddingVertical: hp(1),
    marginHorizontal: 15,
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
    marginHorizontal: 7.5,
    marginBottom: hp(2),
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
    shadowOffset: { width: 0, height: 1.5 },
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
    width: 10,
    height: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: colors.whiteColor,
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
  avatarContainer: {
    // backgroundColor: 'red',
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100),
  },
  absoluteCameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    height: 22,
    width: 22,
  },
  inputBoxContainer: {
    marginTop: hp(5),
  },
  chatRoomName: {
    color: colors.lightBlackColor,
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: 10,
  },
  participantsContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: wp(2),
    padding: wp(5),
    flex: 1,
  },
  participantsText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: wp(1),
  },
});
export default MessageNewGroupScreen;
