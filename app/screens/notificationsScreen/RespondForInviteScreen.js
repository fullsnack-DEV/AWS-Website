/* eslint-disable no-unsafe-optional-chaining */
import React, {useContext, useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';

import TCThickDivider from '../../components/TCThickDivider';
import TCGradientButton from '../../components/TCGradientButton';
import {getGroupDetails, getGroupMembers} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import {acceptRequest, declineRequest} from '../../api/Notificaitons';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function RespondForInviteScreen({navigation, route}) {
  const [groupObj] = useState(route?.params?.groupObj);

  const entityObject = groupObj;
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [groupObject, setGroupObject] = useState();
  const [membersList, setMembersList] = useState();
  const [hideScore, SetHideScore] = useState();

  useEffect(() => {
    setTimeout(() => {
      SetHideScore(true);
    }, 5000);
  }, []);

  useEffect(() => {
    setLoading(true);
    getGroupDetails(
      JSON.parse(groupObj.activities[0].object).group.group_id,
      authContext,
    )
      .then((response) => {
        setGroupObject(response.payload);
        getGroupMembers(
          JSON.parse(groupObj.activities[0].object).group.group_id,
          authContext,
        )
          .then((members) => {
            setMembersList(members.payload);
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [
    authContext,
    groupObj.activities,
    groupObj.group.group_id,
    route.params?.groupID,
  ]);

  const renderMembersList = ({item}) => {
    console.log('aa');
    return (
      <View style={styles.backgroundView}>
        <Image
          source={
            item?.thumnail ? {uri: item?.thumnail} : images.profilePlaceHolder
          }
          style={styles.profileImage}
        />
      </View>
    );
  };
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const onAccept = () => {
    setLoading(true);
    acceptRequest(groupObj.activities[0].id, authContext)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = () => {
    setLoading(true);

    declineRequest(groupObj.activities[0].id, authContext)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const renderBackground = () => {
    if (groupObject?.background_thumbnail) {
      return (
        <View style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
          <FastImage
            source={{uri: groupObject?.background_thumbnail}}
            resizeMode={'cover'}
            style={styles.bgImageStyle}>
            {!hideScore && (
              <ImageBackground
                source={images.profileLevel}
                style={{
                  height: 58,
                  width: 93,
                  resizeMode: 'contain',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <FastImage
                    source={images.tc_message_top_icon}
                    resizeMode={'contain'}
                    style={{height: 35, width: 35}}
                  />
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: fonts.RBold,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {0}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.RMedium,
                        fontSize: 10,
                        color: colors.lightBlackColor,
                      }}>
                      {strings.points}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            )}
          </FastImage>
        </View>
      );
    }
    return (
      <View style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>
        <View style={styles.bgImageStyle}>
          {!hideScore && (
            <ImageBackground
              source={images.profileLevel}
              style={{
                height: 58,
                width: 93,
                resizeMode: 'contain',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}>
                <FastImage
                  source={images.tc_message_top_icon}
                  resizeMode={'contain'}
                  style={{height: 35, width: 35}}
                />
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.RBold,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                    {0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.RMedium,
                      fontSize: 10,
                      color: colors.lightBlackColor,
                    }}>
                    {strings.points}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      {!loading && (
        <ScrollView>
          {renderBackground()}
          <Image
            style={{
              ...styles.profileImageStyle,
              height: 60,
              width: 60,
            }}
            source={
              entityObject?.thumbnail
                ? {uri: groupObject?.thumbnail}
                : images.clubPlaceholder
            }
          />

          <View
            style={{flexDirection: 'row', alignSelf: 'center', marginTop: 5}}>
            <Text style={styles.nameText} numberOfLines={5}>
              {groupObject?.group_name}
            </Text>
            <Image
              source={
                groupObject?.entity_type === 'team'
                  ? images.teamT
                  : images.clubC
              }
              style={styles.teamTImage}
            />
          </View>
          <Text style={styles.locationText}>
            {groupObject?.city}, {groupObject?.state_abbr}
          </Text>

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={membersList}
            keyExtractor={keyExtractor}
            renderItem={renderMembersList}
            style={{margin: 15}}
          />

          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
              textAlign: 'center',
              margin: 30,
              marginTop: 0,
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {groupObject?.group_name}
            </Text>{' '}
            {strings.inviteYouToJoinTeam}
          </Text>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
                margin: 15,
                marginTop: 0,
                marginBottom: 0,
              }}>
              {groupObject?.bio}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.RLight,
                color: colors.lightBlackColor,
                marginLeft: 15,
                marginRight: 15,
              }}>
              {`${strings.signedupin} `}
              {new Date(groupObject?.createdAt * 1000).getFullYear()}
            </Text>
          </View>
          <TCThickDivider marginTop={15} />
          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>{strings.sportsTitleText}</Text>
            <Text style={styles.regularTextStyle}>{groupObject?.sport}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginTop: 0,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>{strings.membersage}</Text>
            <Text style={styles.regularTextStyle}>
              {strings.minPlaceholder} {groupObject?.min_age} {strings.maxPlaceholder} {groupObject?.max_age}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginTop: 0,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>{strings.languageTitle}</Text>
            <Text style={styles.regularTextStyle}>
              {groupObject?.languages?.toString()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginTop: 0,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>{strings.office}</Text>
            <Text style={styles.regularTextStyle} numberOfLines={3}>
              {groupObject?.office_address}
            </Text>
          </View>

          <TCThickDivider marginTop={15} marginBottom={20} />

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginTop: 0,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>
              {strings.membershipregfee}
            </Text>
            <Text style={styles.regularTextStyle}>
              ${groupObject?.registration_fee} {strings.CAD}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              margin: 15,
              marginTop: 0,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lightTextStyle}>{strings.membershipFee}</Text>
            <Text style={styles.regularTextStyle} numberOfLines={3}>
              ${groupObject?.membership_fee} {strings.CAD} /{' '}
              {groupObject?.membership_fee_type}
            </Text>
          </View>

          <TCThickDivider marginTop={15} />

          <View style={{margin: 15}}>
            <Text style={styles.lightTextStyle}>{strings.bylow}</Text>
            <Text style={styles.regularTextStyle} numberOfLines={3}>
              {groupObject?.bylaw ? groupObject?.bylaw : strings.noBylows}
            </Text>
          </View>

          <TCThickDivider marginTop={15} />

          <View style={{margin: 15, marginLeft: 0, marginRight: 0}}>
            <TCGradientButton
              startGradientColor={colors.kHexColorFF8A01}
              endGradientColor={colors.darkThemeColor}
              title={strings.JOIN}
              onPress={() => onAccept()}
              textStyle={{fontSize: 16}}
            />
            <Text style={styles.declineButtonStyle} onPress={() => onDecline()}>
              {strings.declineTitle}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgImageStyle: {
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -30,
    alignSelf: 'center',
    borderRadius: 41,
  },
  teamTImage: {
    marginHorizontal: 5,
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    alignSelf: 'center',
  },
  backgroundView: {
    backgroundColor: colors.whiteColor,
    elevation: 5,
    height: 42,
    width: 42,
    borderRadius: 84,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  profileImage: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lightTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  regularTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  declineButtonStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
    textDecorationLine: 'underline',
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
  },
});
