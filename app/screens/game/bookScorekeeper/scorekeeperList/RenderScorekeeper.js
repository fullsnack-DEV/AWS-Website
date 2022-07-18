import {Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useContext} from 'react';
import images from '../../../../Constants/ImagePath';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import {getSportName} from '../../../../utils';
import AuthContext from '../../../../auth/context';

const RenderScorekeeper = ({
  showStar = false,
  data,
  sport,
  isSelected,
  onRadioClick,
}) => {
  const authContext = useContext(AuthContext);

  let sportObj = data?.scorekeeper_data?.filter((o) => o?.sport === sport);
  if (sportObj.length === 1) {
    sportObj = data?.scorekeeper_data?.filter((o) => o?.sport === sport);
  } else {
    sportObj = data?.scorekeeper_data;
  }
  console.log('Scorekeeper sport data:=>', sportObj);
  return (
    <View style={styles.scorekeeperContainer}>
      <View style={styles.viewContainer}>
        <View style={styles.backgroundView}>
          <Image
            source={
              data?.thumbnail
                ? {uri: data?.thumbnail}
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
          />
        </View>
        <View style={{flexDirection: 'column', marginLeft: 5}}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data?.full_name}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {data?.city}
            {sportObj.length === 1
              ? ` · ${getSportName(sportObj[0], authContext)}`
              : ''}
          </Text>
          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              ★ 5.0{' '}
              {sportObj.length === 1 && sportObj?.[0]?.setting
                ? ` · ${sportObj?.[0]?.setting?.game_fee?.fee} CAD`
                : ''}
            </Text>
          )}
        </View>
      </View>
      {/* Scorekeeper Filter */}
      <View
        style={{
          flex: 0.1,
          paddingHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            borderColor: colors.magnifyIconColor,
            height: 22,
            width: 22,
            borderWidth: 2,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onRadioClick}
        >
          {isSelected && (
            <LinearGradient
              colors={[colors.orangeColor, colors.yellowColor]}
              end={{x: 0.0, y: 0.25}}
              start={{x: 1, y: 0.5}}
              style={{
                height: 13,
                width: 13,
                borderRadius: 50,
              }}
            ></LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scorekeeperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 5,
    borderBottomColor: colors.grayBackgroundColor,
    borderBottomWidth: 2,
  },

  backgroundView: {
    backgroundColor: colors.whiteColor,
    elevation: 5,
    height: 40,
    width: 40,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: 'red',
    // height: 125,
  },
  profileImage: {
    resizeMode: 'cover',
    height: 36,
    width: 36,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
export default RenderScorekeeper;
