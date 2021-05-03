import React, { useCallback, useContext } from 'react';
import {
    StyleSheet, Text, View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import TCUserList from '../../screens/account/connections/TCUserList';
import AuthContext from '../../auth/context';

const LikersModal = ({ likersModalRef }) => {
    const authContext = useContext(AuthContext)
    const userRole = authContext?.entity?.role;
    const handleCloseModal = useCallback(() => likersModalRef.current.close(), [likersModalRef])

    const ModalHeader = () => (
      <View style={styles.headerStyle}>
        <View style={styles.handleStyle}/>
        <Text style={styles.titleText}>Likes</Text>
        <View style={styles.headerSeparator}/>
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          <FastImage source={images.likePlay} style={{ height: 20, width: 30 }} resizeMode={'contain'}/>
          <Text style={styles.playsText}>2323232plays</Text>
        </View>
        <View style={styles.headerSeparator}/>
      </View>
    )

    const renderLikers = () => (
      <TCUserList
          onProfilePress={handleCloseModal}
            title={'Raj Kapoor'}
            subTitle={'Vancouver'}
            entityType={'player'}
            showFollowUnfollowButton={userRole === 'user'}
        />
    )

    const likersListHeaderComponent = () => (
      <View style={styles.likersHeaderContainer}>
        <Text style={styles.likedByText}>Liked by</Text>
        <Text style={styles.likesCountText}>232,323 likes</Text>
      </View>
    )

    const flatListProps = {
        bounces: false,
        stickyHeaderIndices: [0],
        ListHeaderComponent: likersListHeaderComponent,
        data: new Array(2).fill(''),
        renderItem: renderLikers,
    }

    return (
      <Portal>
        <Modalize
          disableScrollIfPossible={true}
          withHandle={false}
          overlayStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              shadowColor: colors.blackColor,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
          }}
          adjustToContentHeight={true}
          ref={likersModalRef}
          HeaderComponent={ModalHeader}
          tapGestureEnabled={false}
          flatListProps={flatListProps}
        />
      </Portal>
    )
}

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
    playsText: {
        fontFamily: fonts.RRegular,
        fontSize: 16,
        color: colors.extraLightBlackColor,
    },
    likersHeaderContainer: {
        flexDirection: 'row',
        padding: 15,
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
});

export default LikersModal;
