import React, {
  useState, useEffect, useMemo, useCallback,
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
 getQBProfilePic, QB_DIALOG_TYPE, QBcreateDialog,
} from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';

const MessageNewGroupScreen = ({ route, navigation }) => {
  const { selectedInviteesData } = route.params
  const [selectedInvitees, setSelectedInvitees] = useState([...selectedInviteesData]);
  const [groupName, setGroupName] = useState('');

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
      navigation.replace('MessageInviteScreen')
    }
  }, [navigation, selectedInvitees]);

  const renderSelectedContactList = useCallback(({ item, index }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const entityType = _.get(customData, ['entity_type'], '');
    const fullName = _.get(customData, ['full_name'], '')
    const type = entityType === 'player' ? QB.chat.DIALOG_TYPE.CHAT : QB.chat.DIALOG_TYPE.GROUP_CHAT

    return (
      <View style={styles.selectedContactInnerView}>
        <View>
          <FastImage
              resizeMode={'contain'}
              source={getQBProfilePic(type, index)}
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
            style={{
              fontFamily: fonts.RBold,
              fontSize: 10,
              textAlign: 'center',
              flex: 1,
              width: wp(20),
            }}>
          {fullName}
        </Text>
      </View>
    );
  }, [toggleSelection]);

  const onDonePress = useCallback(() => {
    if (groupName !== '') {
      const occupantsIds = [];

      selectedInvitees.filter((item) => occupantsIds.push(item.id))
      if (occupantsIds.length > 0) {
        QBcreateDialog(occupantsIds, QB_DIALOG_TYPE.GROUP, groupName).then((res) => {
          setSelectedInvitees([]);
          navigation.replace('MessageChat', {
            screen: 'MessageChatRoom',
            params: { dialog: res },
          });
        }).catch((error) => {
          console.log(error);
        })
      }
    } else {
      Alert.alert('Enter Chatroom Name')
    }
  }, [groupName, navigation, route?.params?.dialog, route?.params?.participants, selectedInvitees])

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
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={styles.avatarContainer}>
        <TouchableOpacity>
          <FastImage
            resizeMode={'contain'}
            source={images.yellowQBGroup}
            style={styles.imageContainer}
          />
          <FastImage
            resizeMode={'contain'}
            source={images.certificateUpload}
            style={styles.absoluteCameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputBoxContainer}>
          <Text style={styles.chatRoomName}>Chatroom Name</Text>
          <TCInputBox placeHolderText={'New Group'} value={groupName} onChangeText={setGroupName}/>
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
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 80,
    width: 80,
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
    height: 17,
    width: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: hp(2),
    position: 'absolute',
    top: 0,
    right: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContactInnerView: {
    marginBottom: hp(2),
  },
  selectedContactImage: {
    width: 45,
    height: 45,
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
    height: wp(5),
    width: wp(5),
  },
  inputBoxContainer: {
    marginTop: hp(5),
  },
  chatRoomName: {
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
