import {
  View,
  Text,
  StyleSheet,
  // Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {ModalTypes} from '../../Constants/GeneralConstants';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function ClubInviteTeamModal({
  visible,
  closeModal,
  inviteTeamCall = () => {},
  leaveClubCall = () => {},
  forTeamJoinClub = false,
}) {
  const [snapPoints, setSnapPoints] = useState([]);

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={() => closeModal()}
      modalType={ModalTypes.style2}
      externalSnapPoints={snapPoints}>
      <View
        onLayout={(event) => {
          const contentHeight = event.nativeEvent.layout.height + 80;

          setSnapPoints([
            // '50%',
            contentHeight,
            contentHeight,
            // Dimensions.get('window').height - 40,
          ]);
        }}>
        <Text style={styles.modalTitle}>
          {forTeamJoinClub
            ? strings.whenTeamleaveClubtext
            : strings.whenTeamJoinYourClub}
        </Text>
        <>
          {forTeamJoinClub ? (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                fontFamily: fonts.RRegular,
              }}>
              {strings.TeamLeaveModalText}
            </Text>
          ) : (
            <>
              <View style={styles.rulesTitleContainer}>
                <Text
                  style={{
                    fontSize: Platform.OS === 'android' ? 12 : 8,
                    marginTop: Platform.OS === 'android' ? 5 : 8,
                    marginRight: 3,
                  }}>
                  ●
                </Text>
                <Text style={styles.rulesText}>
                  {strings.clubInviteTeamText1}
                </Text>
              </View>
              <View style={styles.rulesTitleContainer}>
                <Text
                  style={{
                    fontSize: Platform.OS === 'android' ? 12 : 8,
                    marginTop: Platform.OS === 'android' ? 5 : 8,
                    marginRight: 3,
                  }}>
                  ●
                </Text>
                <Text style={styles.rulesText}>
                  {strings.clubInviteTeamText2}
                </Text>
              </View>

              <View style={styles.rulesTitleContainer}>
                <Text
                  style={{
                    fontSize: Platform.OS === 'android' ? 12 : 8,
                    marginTop: Platform.OS === 'android' ? 5 : 8,
                    marginRight: 3,
                  }}>
                  ●
                </Text>
                <Text style={styles.rulesText}>
                  {strings.clubInviteTeamText3}
                </Text>
              </View>
            </>
          )}
        </>

        <TouchableOpacity
          onPress={() => {
            if (forTeamJoinClub) {
              leaveClubCall();
            } else {
              inviteTeamCall();
            }
            closeModal();
          }}
          style={styles.buttonContainer}>
          <Text
            style={[
              styles.buttonTextContainer,
              {
                color: forTeamJoinClub
                  ? colors.leaveClubTextColor
                  : colors.reservationAmountColor,
              },
            ]}>
            {forTeamJoinClub
              ? strings.leaveClub
              : strings.inviteTeamToYourClubText}
          </Text>
        </TouchableOpacity>
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginBottom: 18,
    marginTop: -5,
  },
  rulesTitleContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },

  rulesText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  buttonTextContainer: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    lineHeight: 24,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
