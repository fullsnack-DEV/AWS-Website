/* eslint-disable consistent-return */
import React, {memo, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';

function TeamEntityView({data}) {
  console.log('TeamEntityView:=>', data);
  const authContext = useContext(AuthContext);
  useEffect(() => {}, [authContext.entity, data]);

  const getChallengerEntityObject = () => {
    if (
      data?.challenger ===
      (data?.home_team?.group_id ?? data?.home_team?.user_id)
    ) {
      return data?.home_team;
    }
    return data?.away_team;
  };
  const getChallengeeEntityObject = () => {
    if (
      data?.challengee ===
      (data?.home_team?.group_id ?? data?.home_team?.user_id)
    ) {
      return data?.home_team;
    }
    return data?.away_team;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          margin: 15,
          marginBottom: 5,
        }}
      >
        <Image source={images.reqIcon} style={styles.inOutImageView} />
        <View style={styles.entityView}>
          <View style={styles.imageShadowView}>
            <Image
              source={
                getChallengerEntityObject()?.thumbnail
                  ? {uri: getChallengerEntityObject()?.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <View style={{flex: 0.75, flexDirection: 'row'}}>
            <Text style={styles.entityName} numberOfLines={1}>
              {getChallengerEntityObject()?.first_name
                ? `${getChallengerEntityObject()?.first_name} ${
                    getChallengerEntityObject()?.last_name
                  }`
                : `${getChallengerEntityObject()?.group_name}`}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginLeft: 15,
        }}
      >
        <Image source={images.reqeIcon} style={styles.inOutImageView} />
        <View style={styles.entityView}>
          <View style={styles.imageShadowView}>
            <Image
              source={
                getChallengeeEntityObject()?.thumbnail
                  ? {uri: getChallengeeEntityObject()?.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>

          <View style={{flex: 0.75, flexDirection: 'row'}}>
            <Text style={styles.entityName} numberOfLines={1}>
              {getChallengeeEntityObject()?.first_name
                ? `${getChallengeeEntityObject()?.first_name} ${
                    getChallengeeEntityObject()?.last_name
                  }`
                : `${getChallengeeEntityObject()?.group_name}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entityView: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
    marginLeft: 10,
  },
  inOutImageView: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'cover',
    width: 20,
  },

  profileImage: {
    alignSelf: 'center',
    width: 18,
    height: 18,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  imageShadowView: {
    backgroundColor: colors.whiteColor,
    height: 20,
    width: 20,
    borderRadius: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(TeamEntityView);
