import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import React, {
  useMemo,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {useNavigation} from '@react-navigation/native';

import {FlatList} from 'react-native-gesture-handler';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {getGroupFollowers} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../../components/GroupIcon';
import {displayLocation} from '../../utils';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import images from '../../Constants/ImagePath';
import TCFollowUnfollwButton from '../../components/TCFollowUnfollwButton';
import {followUser, unfollowUser} from '../../api/Users';
import TCThinDivider from '../../components/TCThinDivider';

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

export default function FollowFollowingModal({
  visibleMemberModal,
  followModalRef,
  closeModal,
  groupID,
  showFollower = true,
  viewPrivacyStatus = true,
}) {
  const snapPoints = useMemo(() => ['95%', '95%'], []);
  const [loading, setLoading] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (groupID && showFollower) {
      fetchList(groupID);
    }
  }, [groupID, visibleMemberModal]);

  const callUnfollowUser = useCallback(
    (data, index) => {
      const tempMember = [...followersList];
      tempMember[index].is_following = false;
      setFollowersList(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      unfollowUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...followersList];
          tempMem[index].is_following = true;
          setFollowersList(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, followersList],
  );

  const callFollowUser = useCallback(
    (data, index) => {
      const tempMember = [...followersList];

      tempMember[index].is_following = true;
      setFollowersList(tempMember);

      const params = {
        entity_type: Verbs.entityTypePlayer,
      };
      followUser(params, data.user_id, authContext)
        .then(() => {})
        .catch((error) => {
          const tempMem = [...followersList];
          tempMem[index].is_following = false;
          setFollowersList(tempMem);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        });
    },
    [authContext, followersList],
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
        return <View />;
      }

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
        authContext.entity.role !== Verbs.entityTypeTeam ||
        authContext.entity.role !== Verbs.entityTypeClub
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
    [groupID, onUserAction],
  );

  const fetchList = (groupId) => {
    setLoading(true);
    getGroupFollowers(groupId, authContext)
      .then((res) => {
        setFollowersList([...res.payload]);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, err.message);
      });
  };

  const renderList = () => {
    if (!viewPrivacyStatus) {
      return null;
    }

    if (followersList.length > 0 && showFollower) {
      const filteredList = followersList.filter((item) => {
        const itemName = item.group_name ?? item.full_name;
        return itemName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return (
        <FlatList
          data={filteredList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  style={[styles.row, {flex: 0.7}]}
                  onPress={() => {
                    navigation.navigate('HomeScreen', {
                      uid: item.user_id ?? item.group_id,
                      role: item.entity_type,
                    });
                  }}>
                  <GroupIcon
                    imageUrl={item.full_image}
                    entityType={Verbs.entityTypePlayer}
                    containerStyle={styles.iconContainer}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {item.group_name ?? item.full_name}
                    </Text>
                    <Text style={styles.locationText}>
                      {displayLocation(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {renderFollowUnfollowArrow(item, index)}
              </View>

              <View style={styles.separator} />
            </>
          )}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        {showFollower && <TCNoDataView title={strings.noContentToShow} />}
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={closeModal}
        ref={followModalRef}
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
        <Text
          style={{textAlign: 'center', fontFamily: fonts.RBold, fontSize: 16}}>
          {strings.followerTitleText}
        </Text>
        <TCThinDivider
          width={'100%'}
          marginTop={5}
          height={1}
          color={colors.writePostSepratorColor}
        />
        <View style={{flex: 1, paddingHorizontal: 15}}>
          {viewPrivacyStatus && (
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.userPostTimeColor}
                style={styles.textInputStyle}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={strings.searchText}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                  }}>
                  <Image
                    source={images.closeRound}
                    style={{height: 15, width: 15}}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {!showFollower && (
            <View style={styles.emptyContainer}>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                {strings.noContentToShow}
              </Text>
            </View>
          )}
          {!viewPrivacyStatus ? (
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
                {strings.noContentToShow}
              </Text>
            </View>
          ) : null}
          {viewPrivacyStatus && loading ? <UserListShimmer /> : renderList()}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 0,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
    marginBottom: 20,
    marginTop: 15,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
});
