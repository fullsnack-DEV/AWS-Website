// @flow
import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../../Constants/GeneralConstants';

const HostChallengerInfoModal = ({
  isVisible = false,
  closeModal = () => {},
}) => {
  const [snapPoints, setSnapPoints] = useState([]);
  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style2}
      externalSnapPoints={snapPoints}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([
            '50%',
            contentHeight,
            Dimensions.get('window').height - 40,
          ]);
        }}>
        <View style={{marginBottom: 25}}>
          <Text style={styles.titleText}>{strings.matchHostChallengeText}</Text>
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
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
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
