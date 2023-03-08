import {StyleSheet} from 'react-native';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 8,
    paddingVertical: 15,
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1608,
    shadowRadius: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 6,
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
  button: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
  moreText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});

export default styles;
