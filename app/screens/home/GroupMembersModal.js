import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';

import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';

import {getGroupMembers} from '../../api/Groups';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import TCThinDivider from '../../components/TCThinDivider';
import TCFollowUnfollwButton from '../../components/TCFollowUnfollwButton';
import colors from '../../Constants/Colors';
import {followUser, unfollowUser} from '../../api/Users';
import {getHitSlop} from '../../utils';
import fonts from '../../Constants/Fonts';

export default function GroupMembersModal({
  bottomSheetRef,
  visibleMemberModal = false,
  groupID,
  closeModal,
  showMember = true,
  viewPrivacyStatus = true,
}) {
  const [members, setMembers] = useState([]);
  const [searchMember, setSearchMember] = useState();
  const [loading, setloading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const snapPoints = useMemo(() => ['95%', '95%'], []);

  const getMembers = async (groupIDs, authContexts, grp_ids = '') => {
    setloading(loading);
    setIsRefreshing(true);

    if (groupIDs && showMember) {
      getGroupMembers(groupIDs, authContexts, grp_ids)
        .then((response) => {
          const unsortedReponse = response.payload;

          unsortedReponse.sort((a, b) =>
            a.first_name.normalize().localeCompare(b.first_name.normalize()),
          );
          const {adminMembers, normalMembers} = unsortedReponse.reduce(
            (result, item) => {
              if (item.is_admin) {
                result.adminMembers.push(item);
              } else {
                result.normalMembers.push(item);
              }
              return result;
            },
            {adminMembers: [], normalMembers: []},
          );

          const SortedMembers = [...adminMembers, ...normalMembers];

          setMembers(SortedMembers);

          setIsRefreshing(false);

          setSearchMember(SortedMembers);
          setloading(false);
        })
        .catch((e) => {
          setloading(false);

          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };
  const handleRefresh = () => {
    getMembers(groupID, authContext);
  };

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

  useEffect(() => {
    getMembers(groupID, authContext);
  }, [groupID, visibleMemberModal]);

  useEffect(() => {
    if (searchText.length > 0) {
      const searchParts = searchText.toLowerCase().split(' ');
      const list = members.filter((item) =>
        searchParts.every(
          (part) =>
            item.first_name.toLowerCase().includes(part) ||
            item.last_name.toLowerCase().includes(part),
        ),
      );

      setSearchMember(list);
    } else {
      setSearchMember(members);
    }
  }, [searchText]);

  const SearchBox = () => (
    <View style={styles.searchBarView}>
      <View style={styles.floatingInput}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            style={styles.textInputStyle}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            onSubmitEditing={(text) => {
              setSearchText(text);
            }}
            placeholder={strings.searchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
              }}>
              <Image
                source={images.closeRound}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const onPressProfile = useCallback(
    (item) => {
      navigation.navigate('MembersProfileScreen', {
        memberID: item.user_id,
        whoSeeID: item.group_id,
        groupID,
        members,
      });
    },
    [navigation, groupID, members],
  );
  const callFollowUser = useCallback(
    (data, index) => {
      const tempMember = [...members];
      tempMember[index].is_following = true;
      setMembers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      followUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...members];
          tempMem[index].is_following = false;
          setMembers(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, members],
  );

  const callUnfollowUser = useCallback(
    (data, index) => {
      const tempMember = [...members];
      tempMember[index].is_following = false;
      setMembers(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      unfollowUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...members];
          tempMem[index].is_following = true;
          setMembers(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, members],
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
      if (
        authContext.entity.role === Verbs.entityTypeClub ||
        authContext.entity.role === Verbs.entityTypeTeam
      ) {
        if (authContext.entity.uid === groupID) {
          return (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => onPressProfile(data)}
              hitSlop={getHitSlop(20)}>
              <Image
                source={images.arrowGraterthan}
                style={styles.arrowStyle}
              />
            </TouchableOpacity>
          );
        }
        return <View />;
      }

      if (data.is_following) {
        if (authContext.entity.uid !== data?.user_id && data?.connected) {
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
        data?.connected &&
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
    [
      authContext.entity.role,
      authContext.entity.uid,
      groupID,
      onPressProfile,
      onUserAction,
    ],
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    alignSelf: 'flex-start',
                  }}
                  onPress={() => onPressProfilePhotoAndTitle(data)}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {data.first_name} {data.last_name}
                  </Text>
                  {!data.connected && (
                    <Image
                      source={images.unlinked}
                      style={styles.unlinedImage}
                    />
                  )}
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

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={1}
      style={{
        backgroundColor: colors.modalBackgroundColor,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '99%',
      }}
      opacity={6}
    />
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={closeModal}
        ref={bottomSheetRef}
        backgroundStyle={{
          borderRadius: 10,
        }}
        index={1}
        handleIndicatorStyle={{
          backgroundColor: colors.modalHandleColor,
          width: 40,
          height: 5,
          marginTop: 5,
          alignSelf: 'center',
          borderRadius: 5,
        }}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}>
        <ActivityLoader visible={loading} />

        <View style={{alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{fontSize: 16, fontFamily: fonts.RBold, lineHeight: 24}}>
            {strings.membersTitle}
          </Text>
        </View>
        <TCThinDivider
          width={'100%'}
          marginTop={5}
          height={1}
          color={colors.writePostSepratorColor}
        />

        {/* <ActivityLoader visible={loading} /> */}
        {viewPrivacyStatus && SearchBox()}

        {!showMember && (
          <View style={styles.emptyContaier}>
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              {strings.noAvailableContentToShow}
            </Text>
          </View>
        )}
        {viewPrivacyStatus ? (
          <BottomSheetFlatList
            extraData={searchMember}
            data={searchMember}
            renderItem={renderMembers}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.listemptyView}>
                <Text style={{textAlign: 'center'}}>
                  {strings.liseemptyText}
                </Text>
              </View>
            )}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            keyExtractor={(item, index) => `${item.first_name}/${index}`}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 90,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: colors.googleColor,
                fontFamily: fonts.RRegular,
              }}>
              {strings.noMembersToShow}
            </Text>
          </View>
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  searchBarView: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 20,
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

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingLeft: 50,
  },
  arrowStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
  },
  unlinedImage: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
  },
  emptyContaier: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
});
