import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useMemo} from 'react';

import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {convertToKFormat} from './LocalHomeUtils';

import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

function PlayersCard({
  item = {},
  selectedSport,
  scoreKeeper = false,
  refree = false,
  hiring = false,
  playeravail = false,

  onPress = () => {},
  isdeactivated = false,
}) {
  const getEntityName = () => item.full_name;

  const getName = React.useMemo(() => {
    if (playeravail && selectedSport === strings.allSport) {
      const singleSport = item?.registered_sports?.find(
        (sport) => sport.sport_type === Verbs.sportTypeSingle,
      );
      return singleSport?.sport_name ?? null;
    }

    if (playeravail && selectedSport !== strings.allSport) {
      const singleSport = item?.registered_sports?.find(
        (sport) =>
          sport.sport_type === Verbs.sportTypeSingle &&
          sport.sport_name.toLowerCase() === selectedSport.toLowerCase(),
      );

      return singleSport?.sport_name ?? null;
    }

    if (hiring && selectedSport !== strings.allType) {
      const filteredSports = item.registered_sports.find(
        (i) => i.sport.toLowerCase() === selectedSport.toLowerCase(),
      );
      return filteredSports ? filteredSports.sport_name : '';
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

    if (refree && selectedSport === strings.allType) {
      if (item.referee_data.length > 1) {
        return item.referee_data[0].sport;
      }

      return item?.referee_data.map((d) => d.sport);
    }

    if (scoreKeeper && selectedSport === strings.allType) {
      if (item.scorekeeper_data.length > 1) {
        return item.scorekeeper_data[0].sport;
      }
      return item.scorekeeper_data.map((d) => d.sport);
    }

    return item?.sports[0]?.sport_name;
  }, [item, playeravail, hiring, refree, scoreKeeper, selectedSport]);

  // eslint-disable-next-line consistent-return
  const getCurrencyAndGameFee = () => {
    if (refree && selectedSport === strings.allType) {
      if (item.referee_data.length > 1) {
        return `${convertToKFormat(
          item.referee_data[0]?.setting.game_fee.fee,
        )} ${item.referee_data[0]?.setting.game_fee.currency_type}`;
      }
      return `${convertToKFormat(item.referee_data[0]?.setting.game_fee.fee)} ${
        item.referee_data[0]?.setting.game_fee.currency_type
      }`;
    }
    if (refree && selectedSport !== strings.allType) {
      const filteredSportNames = item.referee_data
        .filter(
          (i) => i.sport_name.toLowerCase() === selectedSport.toLowerCase(),
        )
        .map((i) => i.setting.game_fee);

      return `${convertToKFormat(filteredSportNames[0]?.fee)} ${
        filteredSportNames[0]?.currency_type
      }`;
    }
    if (scoreKeeper && selectedSport === strings.allType) {
      if (item.scorekeeper_data.length > 1) {
        return `${convertToKFormat(
          item.scorekeeper_data[0]?.setting.game_fee.fee,
        )} ${item.scorekeeper_data[0]?.setting.game_fee.currency_type}`;
      }
      return `${convertToKFormat(
        item.scorekeeper_data[0]?.setting.game_fee.fee,
      )} ${item.scorekeeper_data[0]?.setting.game_fee.currency_type}`;
    }
    if (scoreKeeper && selectedSport !== strings.allType) {
      const filteredSportNames = item.scorekeeper_data
        .filter(
          (i) => i.sport_name.toLowerCase() === selectedSport.toLowerCase(),
        )
        .map((i) => i);

      return `${convertToKFormat(
        filteredSportNames[0]?.setting.game_fee?.fee,
      )} ${filteredSportNames[0]?.setting.game_fee?.currency_type}`;
    }
    if (playeravail && selectedSport === strings.allSport) {
      const singleSport = item?.registered_sports?.find(
        (sport) => sport.sport_type === Verbs.sportTypeSingle,
      );
      return `${convertToKFormat(singleSport?.setting.game_fee.fee)} ${
        singleSport?.setting.game_fee.currency_type
      }`;
    }
    if (playeravail && selectedSport !== strings.allSport) {
      const singleSport = item?.registered_sports?.find(
        (sport) => sport.sport_type === Verbs.sportTypeSingle,
      );
      return `${convertToKFormat(singleSport?.setting?.game_fee?.fee)} ${
        singleSport?.setting?.game_fee?.currency_type
      }`;
    }
  };

  const footerImage = useMemo(
    () => (
      <FastImage
        source={images.orangeStar}
        style={{
          height: 10,
          width: 10,
          marginRight: 5,
        }}
      />
    ),
    [],
  );

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
      {footerImage}
      <Text style={[styles.levelText, {color: '#FF7F00', marginRight: 5}]}>
        3.2
      </Text>

      <Text style={styles.levelText}>{getCurrencyAndGameFee()}</Text>
    </View>
  );

  const imageSource = () => {
    if (item?.full_image) {
      return {uri: item?.full_image};
    }
    return images.defaultPlayerBg;
  };

  const renderFastImage = useMemo(
    () =>
      item?.thumbnail ? (
        <FastImage
          style={styles.teamlogoImg}
          source={{
            uri: item?.thumbnail,
          }}
        />
      ) : (
        <FastImage
          style={styles.teamlogoImg}
          source={images.profilePlaceHolder}
        />
      ),
    [item?.thumbnail],
  );

  return (
    <TouchableOpacity
      disabled={isdeactivated}
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={onPress}>
      <ImageBackground
        defaultSource={images.defaultPlayerBg}
        style={styles.inneimgContainer}
        source={imageSource()}
        blurRadius={8}
        imageStyle={{
          overflow: 'hidden',

          height: 100,
          zIndex: -3,
        }}
        borderBottomRightRadius={5}
        borderBottomLeftRadius={5}
        borderTopLeftRadius={5}
        borderTopRightRadius={5}>
        <Text numberOfLines={1} style={styles.nameStyle}>
          {getName}
          {/* {sportText} */}
        </Text>

        {/* team Logo  */}

        <ImageBackground
          defaultSource={images.curvecut}
          source={images.curvecut}
          tintColor={colors.offwhite}
          resizeMode="contain"
          style={styles.imageContaienrstyle}>
          <View style={styles.teamLogoContainer}>{renderFastImage}</View>
          <View style={{position: 'absolute', top: 15}}>
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

          {/* name */}
        </ImageBackground>
      </ImageBackground>
    </TouchableOpacity>
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
    textTransform: 'capitalize',
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
    zIndex: 100,
    marginTop: 15,
  },
  inneimgContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  nameStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    lineHeight: 21,
    color: colors.whiteColor,
    marginTop: 10,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

export default React.memo(PlayersCard);
