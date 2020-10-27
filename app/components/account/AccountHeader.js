import React, {
  useEffect, useState,
} from 'react';
import {
  View,
  Text,
  Image,

  Platform,
  ImageBackground,

  Alert,
  StyleSheet,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

import {
  getParentClubDetail,

} from '../../api/Accountapi';

import images from '../../Constants/ImagePath';

export default function AccountHeader({ authEntity, entityRole }) {
  const [parentGroup, setParentGroup] = useState(null);
  useEffect(() => {
    getParentClub();
    console.log('AUTH DATA::', authEntity);
  }, [])
  const getParentClub = (item) => {
    getParentClubDetail(item.group_id).then((response) => {
      if (response.status === true) {
        if (response.payload.club !== undefined) {
          setParentGroup(response.payload.club);
        } else {
          setParentGroup(null);
        }
      } else {
        Alert.alert(response.messages);
      }
    });
  };

  return (

    <>
      {parentGroup !== null && (
        <>
          <TouchableWithoutFeedback
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  marginTop: Platform.OS === 'ios' ? 50 : 0,
                }}>
            <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
              <Image source={images.clubLable} style={styles.clubLableView} />

              <Image
                      source={parentGroup.thumbnail ? { uri: parentGroup.thumbnail } : images.club_ph}
                      style={styles.clubLable}
                    />

              <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                    }}>
                <Text style={styles.clubNameText}>
                  {parentGroup.group_name}
                </Text>

                <View style={styles.identityViewTop}>
                  <ImageBackground
                        source={images.clubSqure}
                        style={styles.badgeCounter}
                      />
                  <Text style={styles.badgeCounter}>C</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {entityRole === 'user' && (
        <View style={styles.profileView}>
          <Image
                  source={authEntity.obj.thumbnail ? { uri: authEntity.thumbnail } : images.profilePlaceHolder}
                  style={styles.profileImg}
                />
          <Text style={styles.nameText}>{authEntity.full_name}</Text>
          <Text style={styles.locationText}>
            {authEntity.city}, {authEntity.state_abbr}
          </Text>
        </View>
      )}
      {entityRole === 'team' && (
        <View style={styles.profileView}>
          <Image
                  source={authEntity.thumbnail ? { uri: authEntity.thumbnail } : images.team_ph}
                  style={styles.profileImgGroup}
                />
          <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  paddingLeft: 30,
                }}>
            <Text style={styles.nameText}>{authEntity.group_name}</Text>
            <View style={styles.identityView}>
              <ImageBackground
                    source={images.teamSqure}
                    style={styles.badgeCounter}
                  />
              <Text style={styles.badgeCounter}>T</Text>
            </View>
          </View>

          <Text style={styles.locationText}>
            {authEntity.city}, {authEntity.state_abbr}
          </Text>
        </View>
      )}
      {entityRole === 'club' && (
        <View style={styles.profileView}>
          <Image
                  source={authEntity.thumbnail ? { uri: authEntity.thumbnail } : images.club_ph}
                  style={styles.profileImgGroup}
                />
          <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  paddingLeft: 30,
                }}>
            <Text style={styles.nameText}>{authEntity.group_name}</Text>

            <View style={styles.identityView}>
              <ImageBackground
                    source={images.clubSqure}
                    style={styles.badgeCounter}
                  />
              <Text style={styles.badgeCounter}>C</Text>
            </View>
          </View>

          <Text style={styles.locationText}>
            {authEntity.city}, {authEntity.state_abbr}
          </Text>
        </View>
      )}
      <View style={styles.separatorLine}></View>

    </>
  );
}

const styles = StyleSheet.create({

  badgeCounter: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 11,
    height: 17,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 17,
  },

  clubLable: {
    borderRadius: 10,
    height: 20,
    marginLeft: 20,
    resizeMode: 'cover',
    width: 20,
  },
  clubLableView: {
    height: 40,
    width: 230,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    position: 'absolute',
    alignSelf: 'center',
    // marginLeft:20,
  },
  clubNameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: wp('3.5%'),
    marginLeft: 10,
  },

  identityView: {
    // backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
  },

  identityViewTop: {
    // backgroundColor: colors.lightBlueColor,
    height: 16,
    width: 16,
    borderRadius: 3,
    marginLeft: 10,

    alignSelf: 'center',
  },

  locationText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  nameText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 20,
    marginTop: hp('1%'),
  },

  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,

    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileImgGroup: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    // backgroundColor: colors.themeColor,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  profileView: { height: 150, marginTop: Platform.OS === 'ios' ? 50 : 0 },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },

});
