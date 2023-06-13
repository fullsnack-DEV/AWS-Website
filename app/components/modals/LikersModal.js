import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCUserList from '../../screens/account/connections/TCUserList';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

const LikersModal = ({
  data = {},
  showLikeModal = false,
  closeModal = () => {},
  onClickProfile = () => {},
  handleFollowUnfollow = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const userRole = authContext.entity.role;

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{strings.noLikesYet}</Text>
    </View>
  );

  const renderEntity = ({item}) => {
    const user = {...item.user.data};
    return (
      <TCUserList
        user={user}
        onClickProfile={() => {
          closeModal();
          onClickProfile(item);
        }}
        showFollowUnfollowButton={
          userRole === Verbs.entityTypeUser &&
          item.user_id !== authContext.entity.uid
        }
        isFollowing={user.is_follow}
        handleFollowUnfollow={() => {
          closeModal();
          handleFollowUnfollow(item.user_id, user.is_follow, user.entity_type);
        }}
      />
    );
  };

  return (
    <CustomModalWrapper
      isVisible={showLikeModal}
      closeModal={closeModal}
      modalType={ModalTypes.style2}
      containerStyle={{padding: 0}}>
      <View style={styles.headerStyle}>
        <Text style={styles.titleText}>{strings.likesTitle}</Text>
      </View>
      <View style={styles.likersHeaderContainer}>
        <Text style={styles.likedByText}>Liked by</Text>
        <Text style={styles.likesCountText}>
          {data.latest_reactions?.clap?.length}
          {data.latest_reactions?.clap?.length > 1
            ? strings.likesTitle
            : strings.likeTitle}
        </Text>
      </View>
      <FlatList
        data={data.latest_reactions?.clap ?? []}
        keyExtractor={(index) => index.toString()}
        renderItem={renderEntity}
        contentContainerStyle={{paddingHorizontal: 15}}
        ListEmptyComponent={listEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
  },
  titleText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    fontSize: 16,
  },
  likersHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 15,
    paddingTop: 20,
    marginBottom: 25,
  },
  likedByText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  likesCountText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default LikersModal;
