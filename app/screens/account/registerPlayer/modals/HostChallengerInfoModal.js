// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const HostChallengerInfoModal = ({
  isVisible = false,
  closeModal = () => {},
}) => (
  <Modal visible={isVisible} transparent animationType="slide">
    <View style={styles.parent}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.closeButtonContainer}
          onPress={closeModal}>
          <Image source={images.closeSearch} style={styles.image} />
        </TouchableOpacity>
        <View style={{paddingHorizontal: 25, paddingBottom: 21}}>
          <View style={{marginBottom: 25}}>
            <Text style={styles.titleText}>
              {strings.matchHostChallengeText}
            </Text>
            <Text style={styles.description}>
              {strings.matchHostChallengeTextDescription}
            </Text>
          </View>
          <View style={{marginBottom: 25}}>
            <Text style={styles.titleText}>
              {strings.whatChallengerHostShouldDo}
            </Text>
            <Text style={styles.description}>
              {strings.whatChallengerHostShouldDoDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButtonContainer: {
    width: 25,
    height: 25,
    marginTop: 25,
    marginHorizontal: 15,
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
  titleText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default HostChallengerInfoModal;
