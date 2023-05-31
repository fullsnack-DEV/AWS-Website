// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../../Localization/translation';
import {getGroupFollowers} from '../../../api/Groups';
import AuthContext from '../../../auth/context';
import GroupIcon from '../../../components/GroupIcon';
import ScreenHeader from '../../../components/ScreenHeader';
import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import TCNoDataView from '../../../components/TCNoDataView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {displayLocation} from '../../../utils';

const GroupFollowersScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [followersList, setFollowersList] = useState([]);

  const authContext = useContext(AuthContext);

  const fetchList = useCallback(
    (groupId) => {
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
    },
    [authContext],
  );

  useEffect(() => {
    if (route.params.groupId) {
      fetchList(route.params.groupId);
    }
  }, [route.params.groupId, fetchList]);

  // const handleFollowUnfollow = (userData = {}) => {
  //   if (userData.is_following) {
  //     const params = {
  //       entity_type: userData.entity_type,
  //       follower_id: userData.user_id,
  //     };
  //     unfollowGroup(params, authContext.entity.uid, authContext)
  //       .then((res) => {
  //         console.log({res});
  //       })
  //       .catch((err) => {
  //         Alert.alert(strings.alertmessagetitle, err.message);
  //       });
  //   }
  // };

  const renderList = () => {
    if (followersList.length > 0) {
      return (
        <FlatList
          data={followersList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  style={styles.row}
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
                    <Text style={styles.userName}>
                      {item.group_name ?? item.full_name}
                    </Text>
                    <Text style={styles.locationText}>
                      {displayLocation(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    handleFollowUnfollow(item);
                  }}>
                  <Text
                    style={[
                      styles.buttonText,
                      item.is_following ? {color: colors.lightBlackColor} : {},
                    ]}>
                    {item.is_following ? strings.following : strings.follow}
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View style={styles.separator} />
            </>
          )}
        />
      );
    }
    return (
      <View style={{flex: 1}}>
        <TCNoDataView
          title={format(strings.noTabsFoundText_dy, Verbs.privacyTypeFollowers)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.followersRadio}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon2={images.chat3Dot}
      />
      <View style={{flex: 1, paddingHorizontal: 15}}>
        <TextInput
          placeholder={strings.searchText}
          placeholderTextColor={colors.placeHolderColor}
          style={styles.input}
        />
        {loading ? <UserListShimmer /> : renderList()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
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
  // buttonContainer: {
  //   backgroundColor: colors.textFieldBackground,
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  // },
  // buttonText: {
  //   fontSize: 12,
  //   lineHeight: 14,
  //   fontFamily: fonts.RBold,
  //   color: colors.themeColor,
  // },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderRadius: 25,
    marginVertical: 15,
    paddingHorizontal: 25,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    backgroundColor: colors.textFieldBackground,
  },
});
export default GroupFollowersScreen;
