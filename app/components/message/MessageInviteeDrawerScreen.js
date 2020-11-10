import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet, Image, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import _ from 'lodash';
import { normalize } from 'react-native-elements';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { QBleaveDialog } from '../../utils/QuickBlox';

const MessageInviteeDrawerScreen = ({
  navigation,
  participants = [],
  dialog = null,
}) => {
  console.log(participants);
  const inviteButton = () => (
    <TouchableOpacity style={styles.rowContainer} onPress={() => {}}>
      <Image style={ styles.inviteImage } source={ images.plus_round_orange } />
      <Text style={[styles.rowText, { color: colors.orangeColor }]}>Invite</Text>
    </TouchableOpacity>
  )

  const renderRow = ({ item }) => {
    const fullImage = _.get(item, ['full_image'], '');
    const finalImage = fullImage ? { uri: fullImage } : images.profilePlaceHolder;

    return (
      <View style={styles.rowContainer}>
        <Image style={styles.inviteImage} source={finalImage}/>
        <Text style={styles.rowText}>{item.fullName}</Text>
      </View>)
  }
  const leaveRoom = () => {
    const okPress = () => {
      QBleaveDialog(dialog?.id).then(() => {
        navigation.closeDrawer();
        navigation.goBack();
      }).catch((error) => {
        console.log(error)
      })
    }
    Alert.alert(
      '',
      'Are you sure you want to \n'
        + 'Leave this chatroom?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Leave', onPress: () => okPress(), style: 'destructive' },
      ],
      { cancelable: false },
    );
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.viewContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleLabel}>Chatroom Name</Text>
          <Text style={[styles.title, { marginLeft: wp(3) }]}>{dialog?.name}</Text>
          <View style={styles.separator}/>
          <Text style={styles.titleLabel}>Participants</Text>
          {inviteButton()}
          <FlatList
                data={participants[0]}
                renderItem={renderRow}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
        <TouchableOpacity style={styles.bottomView} onPress={leaveRoom}>
          <Image style={ styles.inviteImage } source={ images.leave_chat_room } />
          <Text style={styles.grayText}>LEAVE CHAT ROOM</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    marginRight: wp(1),
    marginLeft: wp(7),
    marginVertical: hp(1),
  },
  titleLabel: {
    fontSize: normalize(16),
    fontFamily: fonts.LRegular,
    color: colors.lightBlackColor,
  },
  title: {
    fontSize: normalize(18),
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginLeft: wp(3),
  },
  rowText: {
    fontSize: normalize(16),
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: wp(3),
  },
  inviteImage: {
    height: wp(6),
    width: wp(6),
  },
  grayText: {
    fontSize: normalize(12),
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
  bottomView: {
    flexDirection: 'row', alignItems: 'center',
  },
  separator: {
    backgroundColor: '#707070',
    height: 1,
    marginTop: hp(2),
    marginLeft: wp(2),
    marginBottom: hp(3),
  },
});

export default MessageInviteeDrawerScreen;
