import { StyleSheet } from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import constants from '../../../../../config/constants';

const {
  colors, fonts,
} = constants;
const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6.5%'),

    marginTop: 20,
    textAlign: 'center',
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  foundText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('6.5%'),
    width: wp('70%'),
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 50,
    marginTop: wp('20%'),
    width: '86%',
  },

  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 17,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
  },
  inviteUserButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 50,
    marginTop: wp('5%'),
    width: '86%',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
export default styles;
