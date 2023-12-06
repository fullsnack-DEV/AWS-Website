import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getJSDate, getSportName} from '../../utils';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import GroupIcon from '../GroupIcon';
import Verbs from '../../Constants/Verbs';

export default function TCEventCard({
  onPress = () => {},
  data = {},
  owners = [],
  containerStyle = {},
}) {
  const authContext = useContext(AuthContext);
  const isGame = !!(data?.game_id && data?.game);
  const startDate = getJSDate(data.start_datetime);
  const [ownerDetails, setOwnerDetails] = useState({});

  const location =
    data?.location?.location_name ??
    data?.game?.venue?.address ??
    data?.game?.venue?.description ??
    '';
  const title = isGame ? getSportName(data.game, authContext) : data.title;

  useEffect(() => {
    const obj = owners.find(
      (item) => data.owner_id === (item.group_id ?? item.user_id),
    );
    if (obj) {
      setOwnerDetails(obj);
    }
  }, [data.owner_id, owners]);

  return (
    <Pressable onPress={onPress} style={[styles.parent, containerStyle]}>
      <ImageBackground
        imageStyle={styles.eventBackgroundImage}
        source={{uri: data?.background_thumbnail}}
        resizeMode="cover"
        style={styles.backgroundImageContainer}>
        <Image source={images.threeDotIcon} style={styles.moreOptionsIcon} />

        <View style={{marginHorizontal: 15, marginBottom: 5}}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {title.toUpperCase()}
          </Text>
        </View>
      </ImageBackground>

      <View style={{paddingHorizontal: 15, paddingVertical: 10, flex: 1}}>
        <View style={[styles.row, {marginBottom: 5, flex: 1}]}>
          <View>
            <Text style={styles.eventTime}>
              {`${moment(startDate).format('ddd, MMM DD - h:mma')}`}{' '}
            </Text>
          </View>
          <Text style={[styles.eventTime, {marginHorizontal: 10}]}>|</Text>

          <View style={{flex: 1}}>
            <Text
              style={data?.is_Offline ? styles.eventTime : styles.onlineText}
              numberOfLines={1}>
              {data?.is_Offline ? location : strings.onlineText}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <GroupIcon
            imageUrl={ownerDetails?.thumbnail}
            groupName={ownerDetails?.group_name ?? ownerDetails?.full_name}
            entityType={ownerDetails.entity_type}
            containerStyle={[
              styles.groupIconStyle,
              ownerDetails.entity_type === Verbs.entityTypePlayer ||
              ownerDetails.entity_type === Verbs.entityTypeUser
                ? {paddingTop: 0, borderWidth: 0}
                : {},
            ]}
            textstyle={{fontSize: 10, marginTop: 0}}
            placeHolderStyle={styles.groupIconPlaceholder}
          />
          <Text style={styles.ownerText}>
            {ownerDetails?.group_name ?? ownerDetails?.full_name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 7,
  },
  backgroundImageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 90,
    justifyContent: 'space-between',
  },
  eventBackgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  moreOptionsIcon: {
    height: 15,
    width: 4,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 15,
    resizeMode: 'contain',
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textShadowColor: colors.blackColor,
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  ownerText: {
    fontSize: 12,
    color: colors.darkBlackColor,
    fontFamily: fonts.RBold,
    marginLeft: 10,
  },
  onlineText: {
    color: colors.themeColor,
    fontWeight: fonts.RMedium,
  },
  groupIconStyle: {
    height: 25,
    width: 25,
    borderWidth: 1,
    paddingTop: 2,
  },
  groupIconPlaceholder: {
    width: 12,
    height: 12,
    right: -3,
    bottom: -3,
  },
});
