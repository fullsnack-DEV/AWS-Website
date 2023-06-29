import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Header from '../../components/Home/Header';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function LocalHomeHeader({
  setLocationpopup,
  location,
  customSports,
  notificationCount,
  setShowSwitchAccountModal,
}) {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  return (
    <View>
      <Header
        leftComponent={
          <Pressable onPress={() => console.log(authContext, 'from auth')}>
            <FastImage
              source={images.newTcLogo}
              resizeMode={'contain'}
              style={styles.backImageStyle}
            />
          </Pressable>
        }
        showBackgroundColor={true}
        centerComponent={
          <View>
            <TouchableOpacity
              onPress={() => setShowSwitchAccountModal()}
              style={styles.headerNameStyle}>
              <Text style={styles.headerUserName} numberOfLines={1}>
                {authContext.entity.obj.full_name ??
                  authContext.entity.obj.group_name}
              </Text>
              <Image source={images.path} style={styles.downArrow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.titleHeaderView}
              onPress={() => setLocationpopup()}>
              <Text style={styles.headerTitle}>
                {location?.charAt?.(0)?.toUpperCase() + location?.slice(1)}
              </Text>
              <Image source={images.home_gps} style={styles.gpsIconStyle} />
            </TouchableOpacity>
          </View>
        }
        rightComponent={
          <View style={styles.rightHeaderView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EntitySearchScreen', {
                  sportsList: customSports,
                  sportsArray: customSports,
                });
              }}>
              <Image source={images.home_search} style={styles.townsCupIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('NotificationsListScreen')}>
              <Image
                source={images.notificationBellHome}
                style={styles.notificationIcon}
              />
              {notificationCount > 0 && (
                <View style={styles.countContainer}>
                  <Text style={styles.count}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  townsCupIcon: {
    resizeMode: 'cover',
    height: 25,
    width: 25,
    marginLeft: 10,
  },

  gpsIconStyle: {
    resizeMode: 'cover',
    height: 15,
    width: 15,
  },
  titleHeaderView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  headerNameStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  rightHeaderView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.lightBlackColor,
  },
  headerUserName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },

  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginLeft: 15,
  },
  countContainer: {
    width: 26,
    height: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.notificationCountBgColor,
  },
  count: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  downArrow: {
    width: 10,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 5,
    marginTop: 3,
  },
  backImageStyle: {
    height: 20,
    width: 30,
  },
});
