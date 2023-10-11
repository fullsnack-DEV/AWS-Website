import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {convertToKFormat} from './LocalHomeUtils';
import Verbs from '../../Constants/Verbs';
import GroupIcon from '../../components/GroupIcon';

function TeamCard({
  item = {},
  onPress = () => {},
  placholder = false,
  isdeactivated = false,
}) {
  const getFooterComponent = () => (
    <View
      style={[
        styles.levelContainer,
        {flexDirection: 'row', alignItems: 'center'},
      ]}>
      <Text style={[styles.levelText, {marginRight: 5}]}>Lv.13</Text>

      <Text style={styles.levelText}>{convertToKFormat(6000)} CAD</Text>
    </View>
  );

  const getSportName = useCallback(() => {
    if (item.entity_type === Verbs.entityTypeClub) {
      const sportname = item.sports[0].sport;
      return sportname;
    }

    return item.sport;
  }, [item.entity_type, item.sport, item.sports]);

  const getBgImage = useMemo(() => {
    if (item.entity_type === Verbs.entityTypeClub) {
      return images.clubdefaultbg;
    }

    return images.teamdefaultbg;
  }, [item.entity_type]);

  const renderImageBgandName = useMemo(
    () => (
      <FastImage
        borderTopLeftRadius={5}
        borderTopRightRadius={5}
        style={styles.imgStyles}
        source={item?.full_image ? item?.full_image : getBgImage}>
        <View style={styles.sportNameContainer}>
          <Text style={styles.sportName}>{getSportName()}</Text>
        </View>
      </FastImage>
    ),
    [getBgImage, getSportName, item?.full_image],
  );

  const placeHolderImage = useCallback(
    () => (
      <FastImage
        resizeMode="cover"
        source={images.tcdefaultPlaceholder}
        style={styles.teamlogoImg}
      />
    ),
    [],
  );

  return (
    <TouchableOpacity
      style={[styles.cardContainer, {elevation: isdeactivated ? 0 : 6}]}
      onPress={onPress}
      disabled={isdeactivated}>
      {/* team Logo  */}
      {renderImageBgandName}

      {placholder ? (
        <View style={styles.teamLogoContainer}>{placeHolderImage()}</View>
      ) : (
        <GroupIcon
          entityType={item.entity_type}
          imageUrl={item?.thumbnail ?? ''}
          groupName={item.group_name}
          containerStyle={styles.teamLogoContainer}
          grpImageStyle={styles.teamlogoImg}
          textstyle={{
            fontSize: 10,
            marginTop: 1,
          }}
          showPlaceholder={false}
        />
      )}

      {/* name */}
      <View style={styles.mainContentcontainer}>
        <Text style={styles.teamnameTextStyle} numberOfLines={1}>
          {item.group_name}
        </Text>
        <Text style={styles.locationNameTextStyle} numberOfLines={1}>
          {item?.city} {item?.state_abbr}
        </Text>
      </View>

      {getFooterComponent()}
    </TouchableOpacity>
  );
}

export default React.memo(TeamCard);

const styles = StyleSheet.create({
  cardContainer: {
    height: 178,
    width: 125,
    backgroundColor: '#FCFCFC',
    marginLeft: 15,
    borderRadius: 5,

    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 7,
      },
    }),
  },
  imgStyles: {
    width: 125,
    height: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  teamLogoContainer: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamlogoImg: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
  },
  mainContentcontainer: {
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  teamnameTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    lineHeight: 21,
    alignSelf: 'flex-start',
  },
  locationNameTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    lineHeight: 18,
    alignSelf: 'flex-start',
  },
  levelContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  levelText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
  sportName: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    lineHeight: 21,
    color: colors.whiteColor,
    marginTop: 10,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  sportNameContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});
