import {StyleSheet} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 10,
  },
  backgroundImage: {
    height: 137,
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  levelContainer: {
    borderWidth: 1,
    borderColor: colors.yellowColor,
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 2,
    paddingHorizontal: 5,
  },
  newTeamText: {
    fontSize: 12,
    lineHeight: 12,
    color: colors.yellowColor,
    fontFamily: fonts.RMedium,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: -35,
    left: 5,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  count: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginRight: 6,
  },
  groupName: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  recuritingContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: colors.themeColor,
    alignSelf: 'baseline',
    borderRadius: 5,
  },
  recruitingText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
});

export default styles;
