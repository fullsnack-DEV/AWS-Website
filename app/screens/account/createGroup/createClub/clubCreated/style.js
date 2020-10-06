import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';

const {strings, colors, fonts, urls, PATH} = constants;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  LocationText: {
    color: colors.whiteColor,
    fontSize: wp('6.5%'),
    fontFamily: fonts.RBold,

    marginTop: 20,
    textAlign: 'center',
  },
  foundText: {
    color: colors.whiteColor,
    fontSize: wp('6.5%'),
    fontFamily: fonts.RRegular,
    width: wp('70%'),
  },

  groupsImg: {
    width: 60,
    height: 60,

    resizeMode: 'contain',
  },
  sectionStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goToProfileButton: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    height: 50,
    alignSelf: 'center',
    width: '86%',
    marginTop: wp('20%'),
  },

  goToProfileTitle: {
    fontSize: 17,
    fontFamily: fonts.RBold,
    height: 50,
    padding: 12,
    color: colors.whiteColor,
    textAlign: 'center',
  },
  inviteUserButton: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    height: 50,
    alignSelf: 'center',
    width: '86%',
    marginTop: wp('5%'),
  },
});
export default styles;
