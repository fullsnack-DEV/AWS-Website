/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

// import TCBorderButton from '../../../components/TCBorderButton';

export default function AlterChallengeModalView({
  navigation,
  modalVisible,
  status,
}) {
  return (
    <Modal

      isVisible={modalVisible}
      backdropColor="black"
    //   onBackdropPress={backdropPress}
    //   onRequestClose={onClose}
      backdropOpacity={0.5}
      style={{
        margin: 0,
        marginTop: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      }}>
      <View style={styles.mainContainer}>
        <Image style={styles.background} source={images.orangeLayer} />
        <Image style={styles.background} source={images.entityCreatedBG} />

        {status === 'sent' && (
          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>Alteration request sent</Text>
            <View style={styles.imageContainer}>
              <Image
                source={images.challengeSentPlane}
                style={styles.rotateImage}
              />
            </View>
          </View>
        )}

        {status !== 'sent' && (
          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>
              {(status === 'accept' && 'Alteration request\naccepted')
                || (status === 'decline' && 'Alteration request\ndeclined')
                || (status === 'cancel' && 'Alteration request\ncancelled')
                || (status === 'restored' && 'Alteration request\nRestored')}
            </Text>

          </View>
        )}
        <SafeAreaView>
          <TouchableOpacity
            style={styles.goToProfileButton}
            onPress={() => {
              navigation.popToTop();
            }}>
            <Text style={styles.goToProfileTitle}>OK</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,

    width: '92%',
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  invitationText: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textAlign: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    resizeMode: 'contain',
    borderRadius: 150,
  },

});
