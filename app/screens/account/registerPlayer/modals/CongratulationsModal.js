// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {getGroupIndex, getUserIndex} from '../../../../api/elasticSearch';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import PlayersListNearYou from '../components/PlayersListNearYou';
import TeamsListNearYou from '../components/TeamsListNearYou';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../../Constants/GeneralConstants';

const CongratulationsModal = ({
  isVisible,
  title = strings.congratsModalTitle,
  subtitle = '',
  fromCreateTeam = false,
  fromCreateClub = false,
  closeModal = () => {},
  sportName,
  sportType,
  sport,
  onChanllenge = () => {},
  searchPlayer = () => {},
  onUserClick = () => {},
  joinTeam = () => {},
  searchTeam = () => {},
  createTeam = () => {},
  goToSportActivityHome = () => {},
  onInviteClick = () => {},
  listloading = false,
  settingsObj = {},
  onChoose = () => {},
  onLoad = false,
}) => {
  const [playerList, setPlayersList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  const getPlayerListNearYou = useCallback(() => {
    if (isFocused && isVisible) {
      const playersQuery = {
        size: 100,

        query: {
          bool: {
            must: [
              {
                nested: {
                  path: 'registered_sports',
                  query: {
                    bool: {
                      must: [
                        {term: {'registered_sports.is_active': true}},
                        {term: {'registered_sports.sport.keyword': sport}},
                        {
                          term: {
                            'registered_sports.sport_type.keyword': sportType,
                          },
                        },
                      ],
                    },
                  },
                },
              },
              {
                bool: {
                  should: [],
                },
              },
            ],
          },
        },
      };

      if (authContext.entity.auth.user?.city) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            city: {query: authContext.entity.auth.user.city, boost: 4},
          },
        });
      }

      if (authContext.entity.auth.user?.state) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            state: {query: authContext.entity.auth.user.state, boost: 3},
          },
        });
      }

      if (authContext.entity.auth.user?.state_abbr) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            state_abbr: {
              query: authContext.entity.auth.user.state_abbr,
              boost: 2,
            },
          },
        });
      }

      if (authContext.entity.auth.user?.country) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            country: {query: authContext.entity.auth.user.country, boost: 1},
          },
        });
      }
      setLoading(true);
      getUserIndex(playersQuery)
        .then((res) => {
          const newList =
            res.length > 0
              ? res.filter((item) => item.user_id !== authContext.entity.uid)
              : [];
          setTimeout(() => {
            setLoading(false);
          }, 20);
          setPlayersList(newList);
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [isFocused, isVisible, sport, authContext, sportType]);

  const getTeamsData = useCallback(() => {
    const queryParams = {
      size: 100,
      query: {
        bool: {
          must: [
            {
              bool: {
                must: [
                  {term: {'sport.keyword': sport}},
                  {term: {'sport_type.keyword': sportType}},
                  {term: {'entity_type.keyword': Verbs.entityTypeTeam}},
                ],
              },
            },
            {
              bool: {
                should: [],
              },
            },
          ],
        },
      },
    };

    if (authContext.entity.auth.user?.city) {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          city: {query: authContext.entity.auth.user.city},
        },
      });
    }
    if (authContext.entity.auth.user?.state) {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          state: {
            query: authContext.entity.auth.user.state,
          },
        },
      });
    }
    if (authContext.entity.auth.user?.state_abbr) {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          state_abbr: {
            query: authContext.entity.auth.user.state_abbr,
          },
        },
      });
    }
    if (authContext.entity.auth.user?.country) {
      queryParams.query.bool.must[1].bool.should.push({
        match: {
          country: {query: authContext.entity.auth.user?.country},
        },
      });
    }

    setLoading(true);
    getGroupIndex(queryParams)
      .then((response) => {
        const newList =
          response.length > 0
            ? response.filter(
                (item) => item.group_id !== authContext.entity.uid,
              )
            : [];
        setTimeout(() => {
          setLoading(false);
        }, 20);
        setTeamsList(newList);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [authContext.entity, sport, sportType]);

  useEffect(() => {
    if (!isFocused) return;
    if (
      sportType === Verbs.sportTypeSingle ||
      sportType === Verbs.sportTypeDouble ||
      fromCreateClub
    ) {
      getPlayerListNearYou();
    } else {
      getTeamsData();
    }
  }, [
    getPlayerListNearYou,
    sportType,
    getTeamsData,
    isFocused,
    fromCreateClub,
  ]);

  const renderList = (type) => {
    if (type === Verbs.sportTypeSingle || type === Verbs.sportTypeDouble) {
      return onLoad ? (
        <ActivityIndicator />
      ) : (
        <PlayersListNearYou
          list={playerList}
          sportType={sportType}
          loading={loading}
          listloading={listloading}
          fromCreateTeam={fromCreateTeam}
          fromCreateClub={fromCreateClub}
          onInviteClick={onInviteClick}
          onChanllenge={(user) => {
            setShowChallengeModal(true);
            setSelectedUser(user);
          }}
          searchPlayer={() => {
            if (sportType === Verbs.sportTypeSingle) {
              // closeModal();
              searchPlayer({
                sport,
                sport_type: sportType,
                location: authContext.entity.auth.user?.city,
              });
            } else {
              searchPlayer({
                sport,
                sport_type: sportType,
                location: authContext.entity.auth.user?.city,
              });
            }
          }}
          onUserClick={(item) => {
            // closeModal();
            onUserClick(item);
          }}
          onChoose={onChoose}
        />
      );
    }
    return (
      <TeamsListNearYou
        list={teamsList}
        loading={loading}
        fromCreateTeam={fromCreateTeam}
        fromCreateClub={fromCreateClub}
        searchTeam={() => {
          closeModal();
          searchTeam({
            sport,
            sport_type: sportType,
            location: authContext.entity.auth.user?.city,
          });
        }}
        joinTeam={() => {
          closeModal();
          joinTeam();
        }}
        createTeam={() => {
          closeModal();
          createTeam();
        }}
        onUserClick={(item) => {
          closeModal();
          onUserClick(item);
        }}
        onChanllenge={(user) => {
          setShowChallengeModal(true);
          setSelectedUser(user);
        }}
      />
    );
  };

  const getModalInfo = (type) => {
    switch (type) {
      case Verbs.sportTypeSingle:
        return strings.congratulationModalInfo;

      case Verbs.sportTypeDouble:
        return strings.congratsModalDoubleInfo;

      default:
        return strings.congratsModalTeamInfo;
    }
  };

  const handleChallengePress = (type) => {
    closeModal();
    onChanllenge(type, {
      sport,
      sport_type: sportType,
      groupObj: selectedUser,
      setting: settingsObj,
    });
  };

  return (
    <>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={closeModal}
        modalType={ModalTypes.default}
        containerStyle={{padding: 0, flex: 1}}>
        <View
          style={
            fromCreateTeam || fromCreateClub
              ? styles.titleContainerForTeam
              : styles.titleTextContainer
          }>
          {fromCreateTeam || fromCreateClub ? (
            <Text
              style={[
                styles.congratsText,
                {
                  alignSelf:
                    fromCreateTeam || fromCreateClub ? 'flex-start' : 'center',
                },
              ]}>
              <Text>
                {strings.congratulationsTitle}
                <Text style={styles.congratsTextStyle}>{title}</Text>
              </Text>

              {strings.hasBeenCreated}
            </Text>
          ) : (
            <Text style={styles.congratsText}>
              {title}
              <Text style={styles.congratsSportText}>{sportName}.</Text>
            </Text>
          )}

          {fromCreateTeam || fromCreateClub ? (
            <Text
              style={[
                styles.description,
                {marginHorizontal: 0, marginRight: 35},
              ]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {fromCreateTeam || fromCreateClub ? (
          <>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => {
                goToSportActivityHome();
              }}>
              <Text style={[styles.buttonText, {textTransform: 'uppercase'}]}>
                {fromCreateTeam
                  ? strings.inviteMemberText
                  : strings.createTeamUnderYourClub}
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.buttonContainer}
            onPress={() => {
              goToSportActivityHome({sport, sportType});
            }}>
            <Text style={styles.buttonText}>
              {strings.goToSportActivityHomeText}
            </Text>
          </Pressable>
        )}

        <Text style={styles.description}>{getModalInfo(sportType)}</Text>
        <View style={styles.dividor} />

        <View style={styles.renderListcontainer}>{renderList(sportType)}</View>
      </CustomModalWrapper>
      <Modal visible={showChallengeModal} transparent>
        <View style={styles.parent}>
          <View style={styles.container1}>
            <TouchableOpacity
              style={styles.challengeContainer}
              onPress={() => handleChallengePress(strings.challenge)}>
              <Text style={styles.challengeText}>{strings.challenge}</Text>
              <Text style={styles.normalText}>
                ({strings.youWillBeChallenger})
              </Text>
              {selectedUser.setting?.game_fee?.fee > 0 && (
                <Text style={[styles.normalText, {marginTop: 8}]}>
                  $ {selectedUser.setting.game_fee.fee}{' '}
                  {selectedUser.setting.game_fee.currency_type} / match
                </Text>
              )}
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.container2}
              onPress={() => handleChallengePress(strings.inviteToChallenge)}>
              <Text style={styles.challengeText}>
                {strings.inviteToChallenge}
              </Text>
              <Text style={styles.normalText}>({strings.youWillBeHost})</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowChallengeModal(false)}>
            <Text style={styles.challengeText}>{strings.cancel}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  titleTextContainer: {
    marginHorizontal: 35,
    marginTop: 50,
    marginBottom: 25,
  },
  titleContainerForTeam: {
    marginLeft: 35,
    marginRight: 24,
    marginTop: 70,
    marginBottom: 25,
  },
  congratsText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    lineHeight: 35,
    paddingBottom: 10,
  },
  congratsSportText: {
    alignSelf: 'center',
    color: colors.darkYellowColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    lineHeight: 35,
    paddingBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    marginHorizontal: 25,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.themeColor,
    fontFamily: fonts.RBold,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginHorizontal: 25,
  },

  dividor: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  container1: {
    backgroundColor: colors.lightWhite,
    opacity: 0.96,
    margin: 15,
    borderRadius: 13,
  },
  challengeContainer: {
    alignItems: 'center',
    paddingTop: 17,
    paddingBottom: 13,
  },
  challengeText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkGrayTrashColor,
  },
  container2: {
    alignItems: 'center',
    paddingTop: 33,
    paddingBottom: 28,
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
  renderListcontainer: {
    paddingHorizontal: 25,
    flex: 1,
    paddingTop: 7,
  },
  congratsTextStyle: {
    color: colors.orangeColor,
  },
});
export default CongratulationsModal;
