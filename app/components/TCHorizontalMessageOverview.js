import React from 'react';
import {
  TouchableOpacity, View, StyleSheet, Text, Image,
} from 'react-native';
import { normalize } from 'react-native-elements';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from '../utils';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import TCBadge from './TCBadge';

const TCHorizontalMessageOverview = (
  {
    dialogType = '',
    title = '',
    subTitle = '',
    numberOfMembers = 0,
    numberOfUnreadMessages = 0,
    lastMessageDate = new Date(),
    avatarBackgroundColor = colors.yellowColor,
    onPress,
  },
) => {
  // eslint-disable-next-line no-restricted-globals
  const getDateAndMonth = (date) => ((!isNaN(date)) ? moment(date).format('DD MMM') : '');

  return (
    <TouchableOpacity style={styles.horizontalMessageOverviewContainer} onPress={onPress}>
      {dialogType === 3 ? (
        <LinearGradient
            colors={ [colors.yellowColor, colors.themeColor] }
            style={{ ...styles.avatarContainer, backgroundColor: avatarBackgroundColor } }>
          <Text style={styles.avatarContainerText}>{title[0].toUpperCase()}</Text>
        </LinearGradient>
      ) : (
        <Image source={images.groupUsers} style={styles.imageContainer} />
      )}

      <View style={styles.rightContainer}>
        <View style={styles.rightTitleContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.numberOfMembers}>{numberOfMembers && dialogType === 2 && numberOfMembers.length}</Text>
          </View>
          <View>
            <Text style={styles.subTitle} numberOfLines={1}>{subTitle}</Text>
          </View>
        </View>
        <View style={styles.rightDateAndMessageCounterContainer}>
          <Text style={styles.lastMessageDate}>{getDateAndMonth(lastMessageDate)}</Text>
          {numberOfUnreadMessages > 0 && <TCBadge value={numberOfUnreadMessages} align={'flex-end'}/>}
        </View>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  horizontalMessageOverviewContainer: {
    width: wp(100),
    padding: wp(4),
    flexDirection: 'row',
    // backgroundColor: 'red',

  },
  avatarContainer: {
    height: wp(13),
    width: wp(13),
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(15),
  },
  avatarContainerText: {
    color: 'white',
    fontSize: normalize(18),
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  imageContainer: {
    height: wp(13),
    width: wp(13),
    resizeMode: 'contain',
  },
  rightContainer: {
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    flex: 1,
  },
  rightTitleContainer: {
    flex: 0.75,
    justifyContent: 'space-evenly',
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
  numberOfMembers: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
    fontSize: normalize(14),
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: wp(2),
  },
  rightDateAndMessageCounterContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  lastMessageDate: {
    fontFamily: fonts.RRegular,
    fontSize: normalize(10),
    color: colors.grayColor,
  },
})
export default TCHorizontalMessageOverview;
