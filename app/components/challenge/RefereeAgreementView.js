/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {
 View, Text, StyleSheet, Image, TouchableOpacity,
 } from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import TCChallengeTitle from '../TCChallengeTitle';

export default function RefereeAgreementView({
  teamA,
  teamB,
  type = 'challenge',
  numberOfReferee,
  radioOpetion,
  agreementOpetion,
  moreButtonVisible = false,
  isMore,
  morePressed,
  isEdit = false,
  onEditPress,
  isNew,
  showRules,
  showPressed,
  comeFrom,
}) {
  const rule1 = (
    <>
      • <Text style={styles.boldText}>{teamB}</Text> will secure{' '}
      {numberOfReferee} referees for the game at its own cost within 5 days
      after the challenge is accepted.
    </>
  );
  const rules2 = (
    <>
      • The consent of <Text style={styles.boldText}>{teamA}</Text> will be
      required when {teamB} books a specific referee.
    </>
  );
  const radioTitle = (
    <>
      If <Text style={styles.boldText}>{teamB}</Text> isn’t reserving{' '}
      {numberOfReferee} referees for the game 5 days after the challenge is
      accepted,
    </>
  );
  const radio1 = (
    <>
      the confirmed game will be canceled and the game fee and service fee will
      be refunded.
    </>
  );
  const radio2 = (
    <>
      <Text style={styles.boldText}>{teamA}</Text> and{' '}
      <Text style={styles.boldText}>{teamB}</Text> will play the game with less
      than {numberOfReferee} referees.
    </>
  );

  return (
    <View style={styles.mainContainer}>
      <TCChallengeTitle
        title={'Referees'}
        value={numberOfReferee}
        staticValueText={'Referees'}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        isEdit={isEdit}
        onEditPress={onEditPress}
        isNew={isNew}
      />
      {(type === 'challenge' || comeFrom === 'ChallengePreviewScreen') && (
        <>
          {((isMore && moreButtonVisible) || !moreButtonVisible) && (
            <View>
              <Text style={styles.rule1}>{rule1}</Text>
              <Text style={styles.rule2}>{rules2}</Text>
            </View>
          )}
          <Text style={styles.radioMainTitle}>{radioTitle}</Text>
          {((moreButtonVisible && agreementOpetion === 1)
            || !moreButtonVisible) && (
              <TouchableOpacity
              disabled={moreButtonVisible}
              onPress={() => {
                radioOpetion(1);
              }}
              style={styles.radio1Container}>
                <Image
                source={
                  agreementOpetion === 1
                    ? images.radioSelectYellow
                    : images.radioUnselect
                }
                style={{ height: 22, width: 22, resizeMode: 'contain' }}
                opacity={moreButtonVisible ? 0.5 : 1}
              />
                <Text style={styles.radio1Text}>{radio1}</Text>
              </TouchableOpacity>
          )}

          {((moreButtonVisible && agreementOpetion === 2)
            || !moreButtonVisible) && (
              <TouchableOpacity
              disabled={moreButtonVisible}
              onPress={() => {
                radioOpetion(2);
              }}
              style={styles.radio2Container}>
                <Image
                source={
                  agreementOpetion === 2
                    ? images.radioSelectYellow
                    : images.radioUnselect
                }
                style={{ height: 22, width: 22, resizeMode: 'contain' }}
                opacity={moreButtonVisible ? 0.5 : 1}
              />
                <Text style={styles.radio2Text}>{radio2}</Text>
              </TouchableOpacity>
          )}
          {moreButtonVisible && (
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.userPostTimeColor,
                textAlign: 'right',
                marginRight: 15,
              }}
              onPress={() => {
                morePressed(!isMore);
              }}>
              {isMore ? 'less' : 'more'}
            </Text>
          )}
        </>
      )}

      {/* invite type sgreement */}

      {type === 'invite' && comeFrom !== 'ChallengePreviewScreen' && (
        <>
          {((isMore && moreButtonVisible) || !moreButtonVisible) && (
            <View>
              <Text style={styles.rule1}>{rule1}</Text>
              <Text style={styles.rule2}>{rules2}</Text>
            </View>
          )}
          {showRules ? (
            <View opacity={0.3}>
              <Text style={styles.radioMainTitle}>{radioTitle}</Text>
              {((moreButtonVisible && agreementOpetion === 1)
                || !moreButtonVisible) && (
                  <TouchableOpacity
                  disabled={moreButtonVisible}
                  onPress={() => {
                    radioOpetion(1);
                  }}
                  style={styles.radio1Container}>
                    <Image
                    source={
                      agreementOpetion === 1
                        ? images.radioSelectYellow
                        : images.radioUnselect
                    }
                    style={{ height: 22, width: 22, resizeMode: 'contain' }}
                    opacity={moreButtonVisible ? 0.5 : 1}
                  />
                    <Text style={styles.radio1Text}>{radio1}</Text>
                  </TouchableOpacity>
              )}

              {((moreButtonVisible && agreementOpetion === 2)
                || !moreButtonVisible) && (
                  <TouchableOpacity
                  disabled={moreButtonVisible}
                  onPress={() => {
                    radioOpetion(2);
                  }}
                  style={styles.radio2Container}>
                    <Image
                    source={
                      agreementOpetion === 2
                        ? images.radioSelectYellow
                        : images.radioUnselect
                    }
                    style={{ height: 22, width: 22, resizeMode: 'contain' }}
                    opacity={moreButtonVisible ? 0.5 : 1}
                  />
                    <Text style={styles.radio2Text}>{radio2}</Text>
                  </TouchableOpacity>
              )}
              {moreButtonVisible && (
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.userPostTimeColor,
                    textAlign: 'right',
                    marginRight: 15,
                  }}
                  onPress={() => {
                    morePressed(!isMore);
                  }}>
                  {isMore ? 'less' : 'more'}
                </Text>
              )}
            </View>
          ) : (
            <Text
              style={{
                fontFamily: fonts.RBold,
                fontSize: 12,
                color: colors.grayColor,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
              onPress={() => {
                showPressed(true)
              }}
              >
              {'WHAT HAPPENS IF YOUR TEAM DOESN\'T\nSECURE REFEREES.'}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
  },
  boldText: {
    fontFamily: fonts.RMedium,
  },
  //   refereeTitle: {
  //     fontFamily: fonts.RRegular,
  //     fontSize: 20,
  //     color: colors.lightBlackColor,
  //   },
  //   numberReferee: {
  //     fontFamily: fonts.RMedium,
  //     fontSize: 16,
  //     color: colors.lightBlackColor,
  //     textAlign: 'right',
  //     marginRight: 15,
  //   },
  rule1: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  rule2: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
  },
  radioMainTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 0,
  },
  radio1Container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  radio1Text: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 20,
  },
  radio2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  radio2Text: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
    marginTop: 0,
  },
});
