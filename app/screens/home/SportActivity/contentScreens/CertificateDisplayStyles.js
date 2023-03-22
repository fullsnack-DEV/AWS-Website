import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const layout = Dimensions.get('window');

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
  button: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: 'rgba(153, 153, 153, 0.5)',
    borderRadius: 15,
    marginRight: 15,
    width: 40,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
  aspectRatioVertical: {
    aspectRatio: layout.width / (layout.height - 180),
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 25,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: colors.thinDividerColor,
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 20,
  },
  searchView: {
    flex: 1,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchTextField: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 0,
  },
  modalButtonContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  certificateContainer: {
    width: 150,
    height: 195,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskView: {
    position: 'absolute',
    width: 150,
    height: 195,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskViewText: {
    fontFamily: fonts.RLight,
    fontSize: 20,
    lineHeight: 30,
    color: colors.whiteColor,
    marginLeft: 5,
  },
  closeIcon: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 22,
    right: -10,
    top: -8,
    backgroundColor: colors.themeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
