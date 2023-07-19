import {View, Text, Pressable, StyleSheet, Platform, Image} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {convertToKFormat} from './LocalHomeUtils';

import {strings} from '../../../Localization/translation';

export default function PlayersCard({
  item = {},
  selectedSport,
  scoreKeeper = false,
  refree = false,
  hiring = false,
  onPress = () => {},
}) {
  const getEntityName = () => item.full_name;

  const getName = () => {
    if (hiring && selectedSport !== strings.allType) {
      const filteredSports = item.registered_sports.find(
        (i) => i.sport.toLowerCase() === selectedSport.toLowerCase(),
      );
      return filteredSports ? filteredSports.sport_name : '';
    }

    if (selectedSport === strings.allType) {
      return item?.sports?.[0]?.sport_name ?? null;
    }

    if (scoreKeeper && selectedSport !== strings.allType) {
      const filteredSportNames = item.scorekeeper_data
        .filter(
          (i) => i.sport_name.toLowerCase() === selectedSport.toLowerCase(),
        )
        .map((i) => i.sport_name);

      return filteredSportNames;
    }

    if (refree && selectedSport !== strings.allType) {
      const filteredSportNames = item.referee_data
        .filter(
          (i) => i.sport_name.toLowerCase() === selectedSport.toLowerCase(),
        )
        .map((i) => i.sport_name);

      return filteredSportNames;
    }

    return item?.sports[0]?.sport_name;
  };

  const getFooterComponent = () => (
    <View
      style={[
        styles.levelContainer,
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        },
      ]}>
      <FastImage
        source={images.orangeStar}
        style={{
          height: 10,
          width: 10,
          marginRight: 5,
        }}
      />

      <Text style={[styles.levelText, {color: '#FF7F00', marginRight: 5}]}>
        3.2
      </Text>

      <Text style={styles.levelText}>{convertToKFormat(50)} CAD</Text>
    </View>
  );

  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <FastImage
        style={styles.inneimgContainer}
        source={
          item?.full_image
            ? {
                uri: item?.full_image,
                priority: FastImage.priority.high,
              }
            : images.defaultPlayerBg
        }
        blurRadius={4}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.RBold,
            fontSize: 14,
            lineHeight: 21,
            color: colors.whiteColor,
            marginTop: 10,
            alignSelf: 'center',
          }}>
          {getName()}
          {/* {sportText} */}
        </Text>

        {/* team Logo  */}

        <FastImage
          source={images.curvecut}
          tintColor={colors.offwhite}
          resizeMode="cover"
          style={styles.imageContaienrstyle}>
          <>
            <View style={styles.teamLogoContainer}>
              <Image
                resizeMode="cover"
                source={
                  item?.thumbnail
                    ? {
                        uri: item?.thumbnail,
                        priority: FastImage.priority.high,
                      }
                    : images.profilePlaceHolder
                }
                style={styles.teamlogoImg}
              />
            </View>
            <View style={{marginTop: -25}}>
              <View style={styles.mainContentcontainer}>
                <Text style={styles.teamnameTextStyle} numberOfLines={1}>
                  {getEntityName()}
                </Text>
                <Text style={styles.locationNameTextStyle} numberOfLines={1}>
                  {item.city} {item.state_abbr}
                </Text>
              </View>

              {getFooterComponent()}
            </View>
          </>

          {/* name */}
        </FastImage>
      </FastImage>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 178,
    width: 125,
    backgroundColor: '#FCFCFC',
    borderRadius: 5,
    marginLeft: 15,

    ...Platform.select({
      ios: {
        shadowColor: colors.shadowColor,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 7,
      },
      android: {
        elevation: 7,
      },
    }),
  },

  teamLogoContainer: {
    width: 41,
    height: 41,
    alignSelf: 'center',
    marginTop: 0,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDDDDD',
  },
  teamlogoImg: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  mainContentcontainer: {
    marginTop: 40,

    justifyContent: 'flex-start',
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
  imageContaienrstyle: {
    height: 130,
    width: 125,

    marginTop: 15,
  },
  inneimgContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
