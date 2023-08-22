import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import ScreenHeader from '../ScreenHeader';
import GroupIcon from '../GroupIcon';
import Verbs from '../../Constants/Verbs';

const SendRequestModal = ({
  onNextPress = () => {},
  onClosePress = () => {},
  btntext = '',
  visibleRequestModal,
  groupData,
  loading,
  textstring1,
  textstring2,
  textstring3,
  headerTitle = strings.sendrequestToCreateTeam,
}) => (
  <Modal
    isVisible={visibleRequestModal}
    onBackdropPress={onClosePress}
    onRequestClose={onClosePress}
    animationInTiming={300}
    animationOutTiming={800}
    backdropTransitionInTiming={300}
    backdropTransitionOutTiming={800}
    style={{margin: 0}}>
    <ActivityLoader visible={loading} />
    <View style={styles.parent}>
      <ScreenHeader
        title={headerTitle}
        rightIcon2={images.crossImage}
        rightIcon2Press={onClosePress}
        leftIconStyle={{width: 50}}
      />

      <View style={{paddingTop: 75, paddingBottom: 60, alignItems: 'center'}}>
        <GroupIcon
          groupName={groupData?.group_name}
          entityType={Verbs.entityTypeTeam}
          containerStyle={{borderWidth: 1}}
        />
        <Text style={styles.title}>{groupData?.group_name}</Text>
      </View>
      <View style={{paddingLeft: 20, paddingRight: 16}}>
        <View style={styles.rowstyles}>
          <View style={styles.dotstyle} />
          <Text style={styles.description}>{textstring1}</Text>
        </View>
        <View style={styles.rowstyles}>
          <View style={styles.dotstyle} />
          <Text style={styles.description}>{textstring2}</Text>
        </View>
        <View style={styles.rowstyles}>
          <View style={styles.dotstyle} />
          <Text style={styles.description}>{textstring3}</Text>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <TouchableOpacity onPress={onNextPress} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{btntext}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  parent: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 50,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: colors.blackColor,
  },
  rowstyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  dotstyle: {
    width: 5,
    height: 5,
    backgroundColor: colors.blackColor,
    borderRadius: 4,
    marginRight: 6,
    alignSelf: 'flex-start',
    marginTop: 11,
  },
  buttonContainer: {
    backgroundColor: colors.reservationAmountColor,
    borderRadius: 25,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  title: {
    fontSize: 25,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginTop: 25,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});

export default SendRequestModal;
