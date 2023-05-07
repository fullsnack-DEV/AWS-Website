// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
// import ReadMore from '@fawazahmed/react-native-read-more';
import {strings} from '../../../../../Localization/translation';
import LevelBars from '../../../../components/LevelBars';
import {ShimmerView} from '../../../../components/shimmer/commonComponents/ShimmerCommonComponents';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import {displayLocation} from '../../../../utils';

const UserInfo = ({
  user = {},
  onMore = () => {},
  isLookingForClub = false,
  onMessageClick = () => {},
  isAdmin = false,
  containerStyle = {},
  screenType = Verbs.screenTypeModal,
  level = 0,
  loading = false,
  entityType = Verbs.entityTypePlayer,
  description = '',
  sportType = '',
  onPressUser = () => {},
}) => {
  const getLookingForContainer = () => {
    if (isLookingForClub && entityType === Verbs.entityTypePlayer) {
      return (
        <View style={styles.lookingForClubContainer}>
          <Text style={styles.lookingForClubText}>
            {sportType === Verbs.singleSport
              ? strings.lookingForClubOption
              : strings.lookingForTeamOption}
          </Text>
        </View>
      );
    }
    return null;
  };

  return loading ? (
    <View style={[styles.row, containerStyle]}>
      <ShimmerView
        style={{marginRight: 10, borderRadius: 50}}
        width={50}
        height={50}
      />
      <View style={{flex: 1}}>
        <ShimmerView
          style={{width: '80%', marginVertical: 0, marginBottom: 4}}
        />
        <ShimmerView
          style={{width: '45%', marginVertical: 0, marginBottom: 4}}
        />
        <ShimmerView
          style={{width: '45%', marginVertical: 0, marginBottom: 4}}
        />
      </View>
    </View>
  ) : (
    <View style={[styles.parent, containerStyle]}>
      <Pressable style={styles.row} onPress={onPressUser}>
        <View style={styles.imageContainer}>
          <Image
            source={
              user.thumbnail ? {uri: user.thumbnail} : images.profilePlaceHolder
            }
            style={styles.image}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.name}>{user.full_name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.location}>{displayLocation(user)}</Text>
            {entityType === Verbs.entityTypePlayer ? (
              <>
                <View style={styles.levelContainer}>
                  <Text style={styles.newText}>
                    {level > 0 ? `Lv.${level}` : strings.newText.toUpperCase()}
                  </Text>
                </View>
                <View style={{marginLeft: 5}}>
                  <LevelBars level={level} />
                </View>
              </>
            ) : null}
          </View>
          {getLookingForContainer()}
        </View>
        {!isAdmin && screenType === Verbs.screenTypeModal ? (
          <TouchableOpacity
            style={styles.messageIconContainer}
            onPress={onMessageClick}>
            <Image source={images.tab_message} style={styles.image} />
          </TouchableOpacity>
        ) : null}
      </Pressable>
      {screenType !== Verbs.screenTypeMainScreen ? (
        // <ReadMore
        //   style={styles.description}
        //   numberOfLines={7}
        //   seeMoreText={strings.moreText}
        //   seeLessText={strings.lessText}
        //   seeLessStyle={styles.moreText}
        //   seeMoreStyle={styles.moreText}
        //   onSeeMoreBlocked={onMore}>
        //   {description}
        // </ReadMore>
        <Text style={styles.description}>
          {description}{' '}
          <TouchableOpacity onPress={onMore}>
            <Text style={styles.moreText}>{strings.moreText}</Text>
          </TouchableOpacity>
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    // marginBottom: 25,
  },
  name: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  imageContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.ligherGray,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 23,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    marginTop: 10,
    fontFamily: fonts.RRegular,
  },
  moreText: {
    fontSize: 12,
    // lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  lookingForClubContainer: {
    backgroundColor: colors.yellowColorCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginTop: 7,
    alignSelf: 'baseline',
  },
  lookingForClubText: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  messageIconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 13,
  },
  location: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  levelContainer: {
    borderWidth: 1,
    marginLeft: 5,
    borderColor: colors.yellowColor,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  newText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RMedium,
    color: colors.yellowColor,
  },
});
export default UserInfo;
