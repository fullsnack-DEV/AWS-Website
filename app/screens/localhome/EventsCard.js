import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {getJSDate} from '../../utils';
import {getSportName} from '../../utils/sportsActivityUtils';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';

function EventsCard({
  onItemPress = () => {},
  data = [],
  owners,
  allUserData = [],
  forPlaceholder = false,
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
    owners.forEach((item) => {
      if (item.user_id === data?.created_by?.uid) {
        setOwnerDetails(item);
      }
    });
  });

  const getUserFullName = () => {
    let name = '';
    allUserData.forEach((item) => {
      if (item.id === data.owner_id) {
        name = item.name;
      }
    });
    return name;
  };

  const getImage = () => {
    if (data?.background_thumbnail) {
      return {uri: data?.background_thumbnail};
    }
    return images.backgroudPlaceholder;
  };

  const MemoiZedImagetitle = useMemo(
    () => (
      <ImageBackground
        borderTopLeftRadius={5}
        borderTopRightRadius={5}
        style={styles.imagstyles}
        source={getImage()}
        resizeMode="cover">
        <Text numberOfLines={1} style={styles.titlestyle}>
          {title.toUpperCase()}
        </Text>
      </ImageBackground>
    ),
    [title],
  );

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={styles.containerStyle}
        onPress={() => onItemPress()}>
        {MemoiZedImagetitle}
        {/* time and type */}
        <View style={styles.timeplacecontainer}>
          {forPlaceholder ? (
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}>
              {data.date}
            </Text>
          ) : (
            <Text style={styles.dateText}>
              {`${moment(startDate).format('ddd, MMM DD')} - `}
              {`${moment(startDate).format('h:mma')} `}
            </Text>
          )}
          <Text
            style={{
              marginLeft: 10,
              color: colors.darkGrey,
            }}>
            |
          </Text>
          <Text numberOfLines={1} style={styles.onlineTextStyle}>
            {data?.is_Offline ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                }}>
                {location}
              </Text>
            ) : (
              <Text style={styles.onlineText}>{strings.onlineText}</Text>
            )}
          </Text>
        </View>
        <View style={styles.userimgStyle}>
          <View style={styles.eventImageViewStyle}>
            {forPlaceholder ? (
              <Image
                source={images.tcdefaultPlaceholder}
                style={styles.smallImgstyle}
              />
            ) : (
              <Image
                source={
                  ownerDetails?.thumbnail
                    ? {uri: ownerDetails?.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.smallImgstyle}
              />
            )}
          </View>
          <Text style={styles.nameStyle} numberOfLines={1}>
            {forPlaceholder ? data.title : getUserFullName()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: 305,
    height: 149,
    borderRadius: 5,
    backgroundColor: '#FCFCFC',
    marginLeft: 15,

    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.8,
        shadowRadius: 7,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  imagstyles: {
    width: 305,
    height: 90,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titlestyle: {
    marginTop: 60,
    marginHorizontal: 15,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  timeplacecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 7,
    width: 305,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  onlineTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.darkYellowColor,
    marginLeft: 10,
    overflow: 'hidden',
    width: 150,
  },
  userimgStyle: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallImgstyle: {
    height: 15,
    width: 15,
    borderRadius: 70,
  },
  nameStyle: {
    fontFamily: fonts.RBold,
    lineHeight: 15,
    fontSize: 12,
    marginLeft: 5,
  },
});

export default React.memo(EventsCard);
