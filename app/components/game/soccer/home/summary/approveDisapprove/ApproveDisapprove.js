import React, {
  Fragment, useEffect, useState, useContext,
} from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../../Constants/Fonts';
import colors from '../../../../../../Constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../../../../utils';
import images from '../../../../../../Constants/ImagePath';
import TCGradientButton from '../../../../../TCGradientButton';
import { getGameDateTimeInDHMformat } from '../../../../../../utils/gameUtils';
import { GameRecordStatus } from '../../../../../../api/Games';
import TCInnerLoader from '../../../../../TCInnerLoader';
import TCInlineImage from '../../../../../TCInlineImage';
import TCPopupMessage from '../../../../../TCPopupMessage';
import AuthContext from '../../../../../../auth/context'

const MESSAGE = 'If the both teams don’t approved the winner and scores before the match-result-approving period, the game will be a RDG (Result-Disapproved-game). The total number of RDGs of each team will be displayed in its Stats.'
const DISAPPROVE_GAME = 'Disapproved';
const APPROVE_GAME = 'Approved';
const NO_ACTION_TAKEN = 'No action taken';
const ApproveDisapprove = ({
  gameData,
  gameId,
  approveDisapproveGameScore,
  getGameData,
}) => {
  const authContext = useContext(AuthContext)
  const [approvalGameData, setApprovalGameData] = useState(null);
  const [myTeamId, setMyTeamId] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(null);
  const [showWarningPopup, setShowWarningPopup] = useState(false);

  useEffect(() => {
    getApprovalData(gameData);
  }, [gameData])

  const getApprovalData = async (data) => {
    setMyTeamId(authContext.entity?.uid);
    if (data) setApprovalGameData({ ...data });
  }

  const onApproveDisapprovePress = (type = GameRecordStatus.Approve) => {
    const myTeamNumber = approvalGameData?.home_team?.group_id === myTeamId ? 1 : 2;
    setLoadingTeam(myTeamNumber);
    approveDisapproveGameScore(
      gameId,
      myTeamId,
      type,
      {
        reason: 'Game Approval Status',
      },
    ).then(() => {
      getGameData().then((res) => {
        setApprovalGameData({ ...res?.payload })
      }).finally(() => setLoadingTeam(null));
    }).catch(() => setLoadingTeam(null));
  }

  const getTeamApprovalStatus = (teamNumber = 1) => {
    const team = teamNumber === 1 ? 'home_team' : 'away_team';
    const status = approvalGameData?.approval[team]?.approved;
    if (status) return APPROVE_GAME;
    if (status === false) return DISAPPROVE_GAME;
    return NO_ACTION_TAKEN;
  }

  const isApprovingPeriodExpired = new Date() > new Date(approvalGameData?.approval?.expiry * 1000)
  const ApproveDisapproveSection = (
    {
      teamLoading = false,
      isApproved = null,
      isButtonShown,
      status = NO_ACTION_TAKEN,
    },
  ) => (
    <View style={styles.approveDisapproveSection}>
      {teamLoading ? (
        <TCInnerLoader visible={teamLoading}/>
      ) : (
        <Fragment>
          {isButtonShown && !isApproved ? (
            <Fragment>
              <TCGradientButton
                              onPress={() => onApproveDisapprovePress(GameRecordStatus.Approve)}
                              startGradientColor={colors.yellowColor}
                              endGradientColor={colors.themeColor}
                              title={'APPROVE'}
                              style={{
                                marginTop: hp(1),
                                borderRadius: 5,
                                height: 'auto',
                                width: wp(30),
                                padding: 5,
                              }}
                              textStyle={{ color: colors.whiteColor, fontSize: 14 }}
                              outerContainerStyle={{ paddingHorizontal: 5, marginTop: 5, marginBottom: 0 }}
                          />
              <TCGradientButton
                              onPress={() => onApproveDisapprovePress(GameRecordStatus.Disapprove)}
                              startGradientColor={colors.disableColor}
                              endGradientColor={colors.grayEventColor}
                              title={'DISAPPROVE'}
                              style={{
                                marginTop: hp(1),
                                borderRadius: 5,
                                height: 'auto',
                                width: wp(30),
                                padding: 5,
                              }}
                              textStyle={{ color: colors.whiteColor, fontSize: 14 }}
                              outerContainerStyle={{ paddingHorizontal: 5, marginTop: 5, marginBottom: 0 }}
                          />
            </Fragment>
          )
            : (
              <View style={{ ...styles.approveDisapproveSection, flex: 0.5 }}>
                <Text style={{
                  color: status === APPROVE_GAME ? '#FF8A01' : colors.googleColor,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  textAlign: 'center',
                }}>
                  {status}
                </Text>
              </View>
            )}
        </Fragment>
      )}
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      {/*      Match Records Approval Section */}
      <View style={styles.contentContainer}>
        <View style={{ padding: 10 }}>
          <Text style={styles.title}>
            Match Result Approval
          </Text>
          <Text style={styles.subTitle}>
            Do you want to approve the winner and scores of this game?{' '}
            <TouchableOpacity onPress={() => setShowWarningPopup(!showWarningPopup)} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TCInlineImage
                resizeMode={'contain'}
                source={images.warningIcon}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              {showWarningPopup && (
                <TCInlineImage
                      resizeMode={'contain'}
                      source={images.popupUpArrow}
                      style={{
                        position: 'absolute',
                        width: 20,
                        height: 20,
                        top: 20,
                      }}
                  />
              )}
            </TouchableOpacity>
          </Text>
          {showWarningPopup && (
            <TCPopupMessage message={MESSAGE} style={{ marginBottom: 10 }}/>
          )}
          <View style={styles.teamVSContainer}>
            <View style={styles.teamVSContentContainer}>
              <View style={styles.teamLogoAndNameContainer}>
                <View style={styles.teamLogoContainer}>
                  <FastImage
                    style={styles.teamLogo}
                    source={approvalGameData?.home_team?.background_thumbnail ? { uri: approvalGameData?.home_team?.background_thumbnail } : images.teamPlaceholder }
                />
                </View>
                <Text style={styles.teamNameText}>
                  {approvalGameData?.home_team?.group_name ?? ''}
                </Text>
              </View>
              {/* Home Team */}
              <ApproveDisapproveSection
                  teamLoading={loadingTeam === 1}
                  isApproved={[true, false].includes(approvalGameData?.approval?.home_team?.approved) ?? false}
                  isButtonShown={!isApprovingPeriodExpired && approvalGameData?.home_team?.group_id === myTeamId}
                  status={getTeamApprovalStatus(1)}
              />

            </View>
            <View style={styles.teamVSContentSeperator}/>
            <View style={styles.teamVSContentContainer}>
              <View style={styles.teamLogoAndNameContainer}>
                <View style={styles.teamLogoContainer}>
                  <FastImage
                      style={styles.teamLogo}
                      source={approvalGameData?.away_team?.background_thumbnail ? { uri: approvalGameData?.away_team?.background_thumbnail } : images.teamPlaceholder }
                  />
                </View>
                <Text style={styles.teamNameText}>
                  {approvalGameData?.away_team?.group_name ?? ''}
                </Text>
              </View>
              {/* Away Team */}
              <ApproveDisapproveSection
                  teamLoading={loadingTeam === 2}
                  isApproved={[true, false].includes(approvalGameData?.approval?.away_team?.approved) ?? false}
                  isButtonShown={!isApprovingPeriodExpired && approvalGameData?.away_team?.group_id === myTeamId}
                  status={getTeamApprovalStatus(2)}
              />
            </View>
          </View>
        </View>

      </View>
      {isApprovingPeriodExpired && approvalGameData?.approval?.status !== 'approvedByAll' && <Text style={styles.reviewPeriod}>
        The match-result-approving period is<Text style={{ fontFamily: fonts.RBold }}>
          {' '}expired
        </Text>
      </Text> }
      {!isApprovingPeriodExpired && <Text style={styles.reviewPeriod}>
        The match-result-approving period will be expired with <Text style={{ fontFamily: fonts.RBold }}>
          {approvalGameData?.approval?.expiry && getGameDateTimeInDHMformat(approvalGameData?.approval?.expiry)}
        </Text>
      </Text>}

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
    paddingBottom: 10,
  },
  contentContainer: {

  },
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  subTitle: {
    marginTop: hp(1),
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  teamVSContainer: {
    paddingVertical: hp(3),
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    marginTop: hp(2),
    width: '100%',
    height: 'auto',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: colors.offwhite,
    justifyContent: 'center',
  },
  teamVSContentContainer: {
    flex: 0.45,
    alignItems: 'center',
  },
  teamVSContentSeperator: {
    flex: 0.01,
    backgroundColor: colors.grayBackgroundColor,
  },
  teamLogoAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoContainer: {
    marginRight: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    backgroundColor: colors.whiteColor,
    borderRadius: 50,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  teamLogo: {
    height: 22,
    width: 22,
    borderRadius: 50,

  },
  teamNameText: {
    maxWidth: '60%',
    fontSize: 14,
    fontFamily: fonts.RMedium,
  },
  approveDisapproveSection: {
    marginTop: hp(1),
    justifyContent: 'center',
    alignItems: 'center',

  },
  reviewPeriod: {
    width: '90%',
    marginHorizontal: 10,
    fontSize: 16,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
})

export default ApproveDisapprove;
