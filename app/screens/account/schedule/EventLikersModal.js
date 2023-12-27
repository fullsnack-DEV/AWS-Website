import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import CustomModalWrapper from '../../../components/CustomModalWrapper';

import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import {likeEventUsers} from '../../../api/Schedule';
import TCThinDivider from '../../../components/TCThinDivider';
import Verbs from '../../../Constants/Verbs';
import TCFollowUnfollwButton from '../../../components/TCFollowUnfollwButton';

import {followUser, unfollowUser} from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function EventLikersModal({
  isVisible,
  closeModal,
  eventId,
  authContext,
}) {
  const [likeUsers, setLikeUsers] = useState([]);
  const [loading, setloading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    likeEventUsers(eventId, authContext)
      .then((res) => {
        setloading(false);

        setLikeUsers(res.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [authContext, eventId, isVisible]);

  const onPressProfilePhotoAndTitle = useCallback(
    (item) => {
      if (item.connected) {
        navigation.push('HomeScreen', {
          uid: item.user_id,
          role: Verbs.entityTypeUser,
          backButtonVisible: true,
          menuBtnVisible: false,
        });
      }
    },
    [navigation],
  );

  const callFollowUser = useCallback(
    (data, index) => {
      setloading(true);
      const tempMember = [...likeUsers];
      tempMember[index].is_following = true;

      setLikeUsers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      followUser(params, data.user_id, authContext)
        .then(() => {
          setloading(false);
        })
        .catch((error) => {
          const tempMem = [...likeUsers];
          tempMem[index].is_following = false;
          setLikeUsers(tempMem);
          setTimeout(() => {
            setloading(false);
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, likeUsers],
  );

  const callUnfollowUser = useCallback(
    (data, index) => {
      setloading(true);

      const tempMember = [...likeUsers];
      tempMember[index].is_following = false;
      setLikeUsers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      unfollowUser(params, data.user_id, authContext)
        .then(() => {
          setloading(false);
        })
        .catch((error) => {
          const tempMem = [...likeUsers];
          tempMem[index].is_following = true;
          setLikeUsers(tempMem);

          setTimeout(() => {
            setloading(false);
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, likeUsers],
  );

  const onUserAction = useCallback(
    (action, data, index) => {
      switch (action) {
        case 'follow':
          callFollowUser(data, index);
          break;
        case 'unfollow':
          callUnfollowUser(data, index);
          break;
        default:
      }
    },
    [callFollowUser, callUnfollowUser],
  );

  const renderFollowUnfollowArrow = useCallback(
    (data, index) => {
      if (data.is_following) {
        if (authContext.entity.uid !== data?.user_id) {
          return (
            <View style={{flexDirection: 'row'}}>
              <TCFollowUnfollwButton
                outerContainerStyles={styles.firstButtonOuterStyle}
                style={styles.firstButtonStyle}
                title={strings.following}
                isFollowing={data.is_following}
                startGradientColor={colors.lightGrey}
                endGradientColor={colors.lightGrey}
                onPress={() => {
                  onUserAction(Verbs.unfollowVerb, data, index);
                }}
              />
            </View>
          );
        }
        return <View />;
      }
      if (
        authContext.entity.uid !== data?.user_id &&
        (authContext.entity.role !== Verbs.entityTypeTeam ||
          authContext.entity.role !== Verbs.entityTypeClub)
      ) {
        return (
          <View style={{flexDirection: 'row'}}>
            <TCFollowUnfollwButton
              outerContainerStyles={styles.firstButtonOuterStyle}
              style={styles.firstButtonStyle}
              title={strings.follow}
              isFollowing={data.is_following}
              startGradientColor={colors.lightGrey}
              endGradientColor={colors.lightGrey}
              onPress={() => {
                onUserAction(Verbs.followVerb, data, index);
              }}
            />
          </View>
        );
      }

      return <View />;
    },
    [authContext.entity.role, authContext.entity.uid, onUserAction],
  );

  const renderMembers = useCallback(
    ({item: data, index}) => (
      <>
        <View style={styles.roleViewContainer}>
          <View
            style={{
              width: 0,
              flexGrow: 1,
              flex: 1,
            }}>
            <View style={styles.topViewContainer}>
              <TouchableOpacity
                disabled={!data.connected}
                onPress={() => onPressProfilePhotoAndTitle(data)}
                style={styles.imageTouchStyle}>
                <Image
                  source={
                    data.thumbnail
                      ? {uri: data.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              <View style={styles.topTextContainer}>
                <TouchableOpacity
                  disabled={!data.connected}
                  style={{}}
                  onPress={() => onPressProfilePhotoAndTitle(data)}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {data?.full_name}
                  </Text>
                  <Text
                    style={{
                      marginTop: 1,
                    }}
                    numberOfLines={1}>
                    {data?.state}, {data.country}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {renderFollowUnfollowArrow(data, index)}
        </View>
        <TCThinDivider />
      </>
    ),
    [onPressProfilePhotoAndTitle, renderFollowUnfollowArrow],
  );

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      containerStyle={{padding: 0, flex: 1}}>
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.likesTitle}
        containerStyle={{paddingTop: 10, paddingBottom: 5, paddingRight: 15}}
        iconContainerStyle={{marginRight: 15}}
      />

      <View style={styles.headerSection}>
        <Text style={styles.likedByText}>{strings.likedBy}</Text>
        <Text style={styles.likeNumbers}> {likeUsers.length} </Text>
      </View>

      <FlatList
        style={{flex: 1, marginTop: 15}}
        extraData={likeUsers}
        data={likeUsers}
        renderItem={renderMembers}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.listemptyView}>
            <Text style={{textAlign: 'center'}}>{strings.liseemptyText}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.first_name}/${index}`}
      />
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginTop: 15,
  },

  likedByText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 24,
  },

  likeNumbers: {
    fontSize: 16,
    lineHeight: 24,
  },

  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'cover',
    width: 40,
    borderRadius: 80,
  },
  roleViewContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  topViewContainer: {
    flexDirection: 'row',

    height: 35,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },

  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    marginRight: 10,
    fontFamily: fonts.RMedium,
    lineHeight: 24,
  },

  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  firstButtonStyle: {
    paddingHorizontal: 12,
  },
  firstButtonOuterStyle: {
    width: 100,
    height: 30,
    paddingTop: 5,
    padding: 6,

    borderRadius: 5,
  },
  listemptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
});
