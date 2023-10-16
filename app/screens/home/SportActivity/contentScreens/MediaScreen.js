// @flow
import moment from 'moment';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import {getJSDate} from '../../../../utils';

const sliderWidth = Dimensions.get('window').width;

const MediaScreen = ({navigation, route}) => {
  const {user, mediaList, sport, sportType, userId, createDate} = route.params;
  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar backgroundColor={colors.blackColor} barStyle="light-content" />
      <View
        style={[
          styles.row,
          {justifyContent: 'space-between', paddingHorizontal: 10},
          Platform.OS === 'android' ? {paddingTop: 10} : {},
        ]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {width: 25, height: 25, marginRight: 10}]}
            onPress={() => {
              navigation.navigate('HomeStack', {
                screen: 'SportActivityHome',
                params: {
                  sport,
                  sportType,
                  uid: userId,
                  selectedTab: strings.reviews,
                },
              });
            }}>
            <Image source={images.whiteBackArrow} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.profile}>
            <Image
              source={
                user.data?.full_image
                  ? {uri: user.data.full_image}
                  : images.profilePlaceHolder
              }
              style={styles.image}
            />
          </View>
          <View>
            <Text style={styles.userName}>{user.data?.full_name}</Text>
            <Text style={styles.date}>
              {moment(getJSDate(createDate).getTime()).format('MMM DD')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Image source={images.white3Dots} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View>
          <Carousel
            data={mediaList}
            renderItem={({item}) => (
              <View style={styles.largeImage}>
                <Image
                  source={{uri: item.thumbnail}}
                  style={[styles.image, {borderRadius: 0}]}
                />
                {item.type === 'video' ? (
                  <TouchableOpacity
                    style={{position: 'absolute', alignItems: 'center'}}>
                    <View style={styles.videoBtn}>
                      <Image
                        source={images.videoPlayIcon}
                        style={styles.image}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.blackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  date: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    marginRight: 7,
  },
  button: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeImage: {
    width: 375,
    height: 211,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MediaScreen;
