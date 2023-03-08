// @flow
import moment from 'moment';
import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TextInput,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import ScreenHeader from '../../../components/ScreenHeader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const ReviewDetailsScreen = ({navigation}) => (
  <SafeAreaView style={styles.parent}>
    <ScreenHeader
      title={strings.reviews}
      containerStyle={{paddingBottom: 10}}
      leftIcon={images.backArrow}
      leftIconPress={() => {
        navigation.goBack();
      }}
      rightIcon2={images.chat3Dot}
    />
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.profile}>
          <Image source={images.usaImage} style={styles.image} />
        </View>
        <View>
          <Text style={styles.userName}>Christiano Ronaldo</Text>
          <Text style={styles.date}>{moment().format('MMM DD')}</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Association football, more commonly known as football or soccer, is a
        team sport played between two teams of eleven betweenn Association
        football, more commonly known as football or soccer, is a team sport
        played between two teams of eleven betweenn Association football, more
        commonly known as football or soccer, is a team sport played between two
        teams of eleven betweenneei.
      </Text>
      <View style={[styles.row, {marginVertical: 15}]}>
        <View style={styles.activityImageContainer}>
          <Image source={images.activityImage} style={styles.image} />
        </View>

        <View style={styles.activityImageContainer}>
          <Image source={images.activityImage1} style={styles.image} />
          <View style={{position: 'absolute', alignItems: 'center'}}>
            <View style={styles.videoBtn}>
              <Image source={images.videoPlayIcon} style={styles.image} />
            </View>
            <Text style={styles.timer}>0:32</Text>
          </View>
        </View>

        <View style={styles.activityImageContainer}>
          <Image source={images.activityImage2} style={styles.image} />
          <View style={{position: 'absolute'}}>
            <Text style={styles.count}>+ 3</Text>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.profile, {marginRight: 7}]}>
          <Image source={images.usaImage} style={styles.image} />
        </View>

        <TextInput placeholder={strings.leaveReplyText} style={styles.input} />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 18,
    paddingVertical: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.greyBorderColor,
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
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  date: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginRight: 7,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 6,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    lineHeight: 16,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  activityImageContainer: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 9,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
  },
  videoBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: colors.whiteColor,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
  },
  timer: {
    fontSize: 9,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
});
export default ReviewDetailsScreen;
