/* eslint-disable no-restricted-globals */
import React, {memo, useMemo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from '../utils';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCBadge from './TCBadge';
import MessageOccupantsProfilePic from './message/MessageOccupantsProfilePic';

const TCHorizontalMessageOverview = memo(
  ({
    dialogType = '',
    title = '',
    subTitle = '',
    numberOfMembers = 0,
    numberOfUnreadMessages = 0,
    lastMessageDate = new Date(),
    onPress,
    occupantsIds,
  }) => {
    console.log('dialogType', dialogType);
    console.log();
    // eslint-disable-next-line no-restricted-globals
    const getDateAndMonth = useMemo(
      () =>
        !isNaN(lastMessageDate) ? moment(lastMessageDate).format('DD MMM') : '',
      [lastMessageDate],
    );
    return (
      <TouchableOpacity
        style={styles.horizontalMessageOverviewContainer}
        onPress={onPress}>
        <MessageOccupantsProfilePic occupantsIds={occupantsIds} />
        <View style={styles.rightContainer}>
          <View style={styles.rightTitleContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.numberOfMembers}>
                {numberOfMembers && dialogType === 2 && numberOfMembers.length}
              </Text>
            </View>
            <View>
              <Text style={styles.subTitle} numberOfLines={1}>
                {subTitle}
              </Text>
            </View>
          </View>
          <View style={styles.rightDateAndMessageCounterContainer}>
            <Text style={styles.lastMessageDate}>{getDateAndMonth}</Text>
            {numberOfUnreadMessages > 0 && (
              <TCBadge value={numberOfUnreadMessages} align={'flex-end'} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  horizontalMessageOverviewContainer: {
    width: wp(100),
    paddingVertical: 12.5,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  imageMainContainer: {
    marginRight: 12,
    marginLeft: 15,
  },
  imageContainer: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  rightContainer: {
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
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  subTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.userPostTimeColor,
  },
  numberOfMembers: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  rightDateAndMessageCounterContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
  },
  lastMessageDate: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.userPostTimeColor,
  },
});
export default TCHorizontalMessageOverview;
