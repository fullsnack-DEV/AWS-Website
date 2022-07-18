/* eslint-disable consistent-return */
import React, {memo, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';

function RefereeEntityView({data}) {
  console.log('RefereeEntityView:=>', data);
  const authContext = useContext(AuthContext);
  useEffect(() => {}, [authContext.entity, data]);

  const getTeamObject = () => {
    if (
      data?.initiated_by ===
      (data?.game?.home_team?.user_id ?? data?.game?.home_team?.group_id)
    ) {
      return {
        name: data?.game?.home_team?.first_name
          ? `${data?.game?.home_team.first_name} ${data?.game?.home_team.last_name}`
          : `${data?.game?.home_team?.group_name}`,
        thumbnail: data?.game?.home_team?.thumbnail,
      };
    }
    return {
      name: data?.game?.away_team?.first_name
        ? `${data?.game?.away_team?.first_name} ${data?.game?.away_team?.last_name}`
        : `${data?.game?.away_team?.group_name}`,
      thumbnail: data?.game?.away_team?.thumbnail,
    };
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
                getTeamObject()?.thumbnail
                  ? {uri: getTeamObject()?.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <View style={{flex: 0.75, flexDirection: 'row'}}>
            <Text style={styles.entityName} numberOfLines={1}>
              {`${getTeamObject()?.name}`}
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
        <Image source={images.refIcon} style={styles.inOutImageView} />
        <View style={styles.entityView}>
          <View style={styles.imageShadowView}>
            <Image
              source={
                data?.referee?.thumbnail
                  ? {uri: data?.referee?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}
            />
          </View>

          <View style={{flex: 0.75, flexDirection: 'row'}}>
            <Text style={styles.entityName} numberOfLines={1}>
              {`${data?.referee?.first_name} ${data?.referee?.last_name}`}
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

export default memo(RefereeEntityView);
