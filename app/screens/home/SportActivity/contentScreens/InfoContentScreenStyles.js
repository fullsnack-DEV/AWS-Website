import {StyleSheet} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  separator: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
  },
  sectionContainer: {
    paddingVertical: 25,
    paddingHorizontal: 17,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  editButtonContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonContainer: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  smallText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  modalParent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 27,
    paddingTop: 42,
    paddingBottom: 25,
  },
  handle: {
    backgroundColor: colors.modalHandleColor,
    width: 40,
    height: 5,
    borderRadius: 5,
    position: 'absolute',
    alignSelf: 'center',
    top: 16,
  },
  card: {
    marginHorizontal: 15,
    marginBottom: 6,
    backgroundColor: colors.lightWhite,
    opacity: 0.96,
    borderRadius: 13,
  },
  modalButtonContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.eventBlueColor,
  },
  modalLineSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#09141F',
    opacity: 0.13,
  },
  modalCancelButton: {
    backgroundColor: colors.whiteColor,
    marginHorizontal: 15,
    marginBottom: 35,
    borderRadius: 13,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
