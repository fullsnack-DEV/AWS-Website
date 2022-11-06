import React, {useCallback, useContext} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Portal} from 'react-native-portalize';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCUserList from '../../screens/account/connections/TCUserList';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import {followUser, unfollowUser} from '../../api/Users';

const LikersModal = ({
  likersModalRef,
  data,
  showLikeModal,
  onBackdropPress,
}) => {
  const authContext = useContext(AuthContext);
  const userRole = authContext?.entity?.role;
  const handleCloseModal = useCallback(
    () => likersModalRef.current.close(),
    [likersModalRef],
  );

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text style={styles.titleText}>{strings.likesTitle}</Text>
      <View style={styles.headerSeparator} />
    </View>
  );
  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{strings.noLikesYet}</Text>
    </View>
  );
  const renderLikers = ({item}) => {
    console.log('likers item', item);
    return (
      <TCUserList
        onProfilePress={handleCloseModal}
        title={item?.user?.data?.full_name}
        subTitle={item?.user?.data?.city ?? ''}
        entityType={item?.user?.data?.entity_type}
        profileImage={item?.user?.data?.thumbnail}
        followUnfollowPress={(value) => {
          console.log('is followed :', value);
          const params = {
            entity_type: Verbs.entityTypePlayer,
          };
          if (value === true) {
            followUser(params, item?.user?.id, authContext)
              .then(() => {})
              .catch((error) => {
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, error.message);
                }, 10);
              });
          } else {
            unfollowUser(params, item?.user?.id, authContext)
              .then(() => {})
              .catch((error) => {
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, error.message);
                }, 10);
              });
          }
        }}
        showFollowUnfollowButton={
          userRole === Verbs.entityTypeUser &&
          item?.user?.data?.user_id !== authContext.entity.uid
        }
        is_following={item?.user?.data?.is_following}
      />
    );
  };

  return (
    <View>
      <Portal>
        <Modal
          onBackdropPress={onBackdropPress}
          isVisible={showLikeModal}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
          }}>
          <View
            style={[
              styles.bottomPopupContainer,
              {
                height:
                  Dimensions.get('window').height -
                  Dimensions.get('window').height / 2.5,
              },
            ]}>
            {ModalHeader()}
            <View style={styles.likersHeaderContainer}>
              <Text style={styles.likedByText}>Liked by</Text>
              <Text style={styles.likesCountText}>
                {data?.reaction_counts?.clap} likes
              </Text>
            </View>
            <FlatList
              data={data?.own_reactions?.clap ?? []}
              keyExtractor={(index) => index.toString()}
              renderItem={renderLikers}
              ListEmptyComponent={listEmptyComponent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  handleStyle: {
    marginTop: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
  titleText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  headerSeparator: {
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
    height: 2,
    marginBottom: 15,
  },

  likersHeaderContainer: {
    flexDirection: 'row',

    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
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
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
});

export default LikersModal;
