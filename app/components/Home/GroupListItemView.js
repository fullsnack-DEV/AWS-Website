import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function GroupListItemView({groupData, onPress}) {
  const placeholder =
    groupData?.entity_type === 'club'
      ? images.clubPlaceholder
      : images.teamPlaceholder;

  return (
    <TouchableOpacity
      onPress={() => {
        onPress(groupData);
      }}
      style={{marginTop: 15, marginHorizontal: 15, marginBottom: 3}}
    >
      {groupData && (
        <View style={styles.topViewContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.profileView}>
              <Image
                source={
                  groupData.thumbnail ? {uri: groupData.thumbnail} : placeholder
                }
                style={styles.profileImage}
              />
              {!groupData.thumbnail && (
                <Text style={styles.oneCharacterText}>
                  {groupData.group_name.charAt(0).toUpperCase()}
                </Text>
              )}
              <View style={styles.sportlogoView}>
                <Image source={images.goalsImage} style={styles.sportImage} />
                {!groupData.thumbnail && (
                  <Text style={styles.oneCharacterText}>
                    {groupData.group_name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.textContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={styles.nameText} numberOfLines={1}>
                  {groupData.group_name}
                </Text>
                <Image
                  source={
                    groupData.entity_type === 'team'
                      ? images.teamT
                      : images.clubC
                  }
                  style={styles.logoImage}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={styles.locationText}
                  numberOfLines={1}
                >{`${groupData.city}, ${groupData.state_abbr}`}</Text>
                <Text style={styles.sportText}>{groupData.sport}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 20,
  },

  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 60,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  sportlogoView: {
    position: 'absolute',
    height: 20,
    width: 20,
    top: 20,
    left: 30,
    borderRadius: 10,
    borderColor: colors.thinDividerColor,
    borderWidth: 0.5,
    backgroundColor: colors.whiteColor,
  },
  sportImage: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  oneCharacterText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  textContainer: {
    marginLeft: 25,
    marginTop: 10,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  logoImage: {
    marginLeft: 5,
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  sportText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.greeColor,
    fontFamily: fonts.RLight,
  },
});
