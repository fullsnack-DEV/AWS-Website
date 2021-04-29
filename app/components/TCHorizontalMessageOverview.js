import React, { memo, useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp } from '../utils';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import TCBadge from './TCBadge';
import TCGroupNameBadge from './TCGroupNameBadge';
import { QB_ACCOUNT_TYPE } from '../utils/QuickBlox';

const TCHorizontalMessageOverview = (
  {
    entityType = '',
    profilePic = images.profilePlaceHolder,
    dialogType = '',
    title = '',
    subTitle = '',
    numberOfMembers = 0,
    numberOfUnreadMessages = 0,
    lastMessageDate = new Date(),
    onPress,
    // occupantsIds,
    // occupantsData,
  },
) => {
  // eslint-disable-next-line no-restricted-globals
  const getDateAndMonth = useMemo(() => ((!isNaN(lastMessageDate)) ? moment(lastMessageDate).format('DD MMM') : ''), [lastMessageDate]);
  const getEntityType = useMemo(() => {
    if (entityType === QB_ACCOUNT_TYPE.LEAGUE) return 'league';
    if (QB_ACCOUNT_TYPE.TEAM) return 'team'
    if (QB_ACCOUNT_TYPE.CLUB) return 'club'
    return 'player'
  }, [entityType])

  return (
    <TouchableOpacity style={styles.horizontalMessageOverviewContainer} onPress={onPress}>
      <View style={styles.imageMainContainer}>
        {/* <MessageOccupantsProfilePic occupantsIds={occupantsIds} occupantsData={occupantsData}/> */}
        <FastImage source={profilePic} resizeMode={'cover'} style={styles.imageContainer} />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.rightTitleContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[QB_ACCOUNT_TYPE.LEAGUE, QB_ACCOUNT_TYPE.TEAM, QB_ACCOUNT_TYPE.CLUB].includes(entityType)
                ? <TCGroupNameBadge textStyle={styles.title} name={title} groupType={getEntityType} />
                : <Text style={styles.title}>{title}</Text>
            }
            <Text style={styles.numberOfMembers}>{numberOfMembers && dialogType === 2 && numberOfMembers.length}</Text>
          </View>
          <View>
            <Text style={styles.subTitle} numberOfLines={1}>{subTitle}</Text>
          </View>
        </View>
        <View style={styles.rightDateAndMessageCounterContainer}>
          <Text style={styles.lastMessageDate}>{getDateAndMonth}</Text>
          {numberOfUnreadMessages > 0 && <TCBadge value={numberOfUnreadMessages} align={'flex-end'}/>}
        </View>
      </View>
    </TouchableOpacity>
  )
}
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
    fontFamily: fonts.RLight,
    fontSize: 16,
    color: colors.lightBlackColor,
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
    color: colors.grayColor,
  },
})
export default memo(TCHorizontalMessageOverview);
