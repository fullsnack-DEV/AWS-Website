const {StyleSheet} = require('react-native');
const {default: fonts} = require('../../../../../Constants/Fonts');
const {default: colors} = require('../../../../../Constants/Colors');

const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  titleText: {
    fontSize: 20,
    color: colors.lightBlackColor,
    fontWeight: '500',
    fontFamily: fonts.Roboto,
    lineHeight: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    marginTop: 7.5,
    color: colors.lightBlackColor,
    fontWeight: '700',
    fontFamily: fonts.Roboto,
    fontSize: 16,
    lineHeight: 24,
  },
  countryName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontWeight: '300',
    lineHeight: 21,
    fontSize: 14,
    marginBottom: 10,
  },
  seperator: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    width: '100%',
  },
  headerSeperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 0,
    height: 2,
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    margin:15,
    backgroundColor: colors.whiteColor,
    marginBottom: 25,
  },
  mainContainerRate: {
    flex: 1,
  },

  questionTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  questionText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
  },
  starText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    // flex: 0.4,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.Roboto,
    fontStyle: 'normal',
    fontWeight: '700',
    alignSelf: 'center',
    lineHeight:18
  },
});

module.exports = styles;
