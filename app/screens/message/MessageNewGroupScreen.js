import React, { useState } from 'react';
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
import { normalize } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QB_DIALOG_TYPE, QBcreateDialog } from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';

const MessageNewGroupScreen = ({ route, navigation }) => {
  const { selectedInviteesData } = route.params
  const [selectedInvitees, setSelectedInvitees] = useState([...selectedInviteesData]);
  const [groupName, setGroupName] = useState('');

  const renderSelectedContactList = ({ item }) => {
    const customData = item && item.customData ? JSON.parse(item.customData) : {};
    const fullName = _.get(customData, ['full_name'], '')
    const fullImage = _.get(customData, ['full_image'], '');
    const finalImage = fullImage ? { uri: fullImage } : images.profilePlaceHolder;

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
    if (data.length === 0) {
      navigation.replace('MessageInviteScreen')
    }
  };

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
          <TouchableOpacity style={{ padding: 2 }} onPress={() => {
            if (groupName !== '') {
              const occupantsIds = []
              selectedInvitees.filter((item) => occupantsIds.push(item.id))
              if (occupantsIds.length > 0) {
                QBcreateDialog(occupantsIds, QB_DIALOG_TYPE.GROUP, groupName).then((res) => {
                  setSelectedInvitees([]);
                  navigation.navigate('MessageChat', {
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
          }}>
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
          <TCInputBox placeHolderText={'New Group'} onChangeText={setGroupName}/>
        </View>
      </View>
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsText}>Participants</Text>
        {selectedInvitees.length > 0 && (
          <View style={styles.selectedInviteesMainView}>
            <FlatList
              style={{ flex: 1 }}
              numColumns={4}
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
    height: wp(20),
    width: wp(20),
    borderRadius: wp(6),
  },
  selectedInviteesMainView: {
    alignItems: 'flex-start',
    flex: 1,
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
    right: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContactInnerView: {
    paddingHorizontal: wp(0.5),
    marginBottom: hp(2),
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
    fontSize: normalize(14),
    fontFamily: fonts.RRegular,
    marginBottom: wp(1),
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
    fontSize: normalize(14),
    fontFamily: fonts.RRegular,
    marginBottom: wp(1),
  },
});
export default MessageNewGroupScreen;
