import {StyleSheet} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    // flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: colors.themeColor,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  buttonText1: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  buttonContainer2: {
    width: 35,
    marginLeft: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container1: {
    backgroundColor: colors.lightWhite,
    opacity: 0.96,
    margin: 15,
    borderRadius: 13,
  },
  challengeContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  challengeText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
    marginBottom: 10,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
    textAlign: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkGrayTrashColor,
  },

  cancelButton: {
    backgroundColor: colors.lightWhite,
    opacity: 0.9,
    marginHorizontal: 15,
    marginBottom: 35,
    borderRadius: 13,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
