import React, { useState, useEffect } from 'react';
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
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QB_DIALOG_TYPE, QBcreateDialog, QBupdateDialog } from '../../utils/QuickBlox';
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
  const renderSelectedContactList = ({ item }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const fullName = _.get(customData, ['full_name'], '')
    const fullImage = _.get(customData, ['full_image'], '');
    const finalImage = fullImage ? { uri: fullImage } : images.profilePlaceHolder;

    return (
      <View style={styles.selectedContactInnerView}>
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
    if (data.length === 0) {
      navigation.replace('MessageInviteScreen')
    }
  };
  const onDonePress = () => {
    if (groupName !== '') {
      const occupantsIds = [];

      selectedInvitees.filter((item) => occupantsIds.push(item.id))
      if (route?.params?.dialog) {
        const participantsIds = [];
        const participants = route?.params?.participants ?? [];
        participants.filter((item) => participantsIds.push(item.id))
        const dialogId = route?.params?.dialog?.id;
        const createdByUserId = route?.params?.dialog?.userId;

        const removeUsers = participantsIds.filter((item) => item !== createdByUserId && !occupantsIds.includes(item));
        const addUsers = occupantsIds.filter((item) => createdByUserId !== item && !participantsIds.includes(item));
        QBupdateDialog(dialogId, addUsers, removeUsers, groupName).then((res) => {
          setSelectedInvitees([]);
          navigation.replace('MessageChat', {
            screen: 'MessageChatRoom',
            params: { dialog: res },
          });
        }).catch((error) => {
          console.log(error);
        })
      } else if (occupantsIds.length > 0) {
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
          <Text style={styles.eventTitleTextStyle}>New Group</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={onDonePress}>
            <Text style={styles.eventTextStyle}>Done</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.separateLine}/>
      <View style={styles.avatarContainer}>
        <TouchableOpacity>
          <FastImage
            resizeMode={'contain'}
            source={images.groupUsers}
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
    height: hp(2),
    width: hp(2),
    backgroundColor: colors.lightgrayColor,
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
