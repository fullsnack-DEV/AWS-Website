// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Dimensions,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import {getGroupIndex, getUserIndex} from '../../../../api/elasticSearch';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import PlayersListNearYou from '../components/PlayersListNearYou';
import TeamsListNearYou from '../components/TeamsListNearYou';

const CongratulationsModal = ({
  isVisible,
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
}) => {
  const [playerList, setPlayersList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);

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
                      ],
                    },
                  },
                },
              },
              {
                bool: {
                  should: [{match: {sport_type: {query: sportType}}}],
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
            city: {query: authContext.entity.auth.user.state, boost: 3},
          },
        });
      }

      if (authContext.entity.auth.user?.state_abbr) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            city: {query: authContext.entity.auth.user.state_abbr, boost: 2},
          },
        });
      }

      if (authContext.entity.auth.user?.country) {
        playersQuery.query.bool.must[1].bool.should.push({
          match: {
            city: {query: authContext.entity.auth.user.country, boost: 1},
          },
        });
      }

      getUserIndex(playersQuery)
        .then((res) => {
          setPlayersList(res);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e);
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
                should: [],
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
    queryParams.query.bool.must[0].bool.should.push({
      multi_match: {
        query: `${sportName}`,
        fields: ['sport', 'sports.sport'],
      },
    });

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
          state_abbr: {
            query: authContext.entity.auth.user.state,
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
    queryParams.query.bool.must[1].bool.should.push({
      match: {
        entity_type: {query: 'team'},
      },
    });
    queryParams.query.bool.must[1].bool.should.push({
      match: {
        entity_type: {query: 'club'},
      },
    });
    getGroupIndex(queryParams)
      .then((response) => {
        setTeamsList(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext.entity.auth.user, sportName]);

  useEffect(() => {
    if (!isFocused) return;
    if (
      sportType === Verbs.sportTypeSingle ||
      sportType === Verbs.sportTypeDouble
    ) {
      getPlayerListNearYou();
    } else {
      getTeamsData();
    }
  }, [getPlayerListNearYou, sportType, getTeamsData, isFocused]);

  const renderList = (type) => {
    if (type === Verbs.sportTypeSingle || type === Verbs.sportTypeDouble) {
      return (
        <PlayersListNearYou
          list={playerList}
          sportType={sportType}
          onChanllenge={() => {
            closeModal();
            onChanllenge({
              sport,
              sport_type: sportType,
              location: authContext.entity.auth.user?.country,
            });
          }}
          searchPlayer={() => {
            closeModal();
            searchPlayer();
          }}
          onUserClick={(item) => {
            closeModal();
            onUserClick(item);
          }}
          onChoose={() => {}}
        />
      );
    }
    return (
      <TeamsListNearYou
        list={teamsList}
        searchTeam={() => {
          closeModal();
          searchTeam();
        }}
        joinTeam={() => {
          closeModal();
          joinTeam({
            sport,
            sport_type: sportType,
            location: authContext.entity.auth.user?.country,
          });
        }}
        createTeam={() => {
          closeModal();
          createTeam();
        }}
        onUserClick={(item) => {
          closeModal();
          onUserClick(item);
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

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={{paddingHorizontal: 15, paddingTop: 25}}>
            <Pressable
              style={{width: 25, height: 25, alignSelf: 'flex-end'}}
              onPress={closeModal}>
              <Image source={images.crossImage} style={styles.image} />
            </Pressable>
          </View>
          <View style={{padding: 25}}>
            <Text style={styles.congratsText}>
              {strings.congratsModalTitle}
              <Text style={styles.congratsSportText}>{sportName}</Text>
            </Text>

            <Pressable style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                {strings.goToSportActivityHomeText}
              </Text>
            </Pressable>

            <Text style={styles.description}>{getModalInfo(sportType)}</Text>
          </View>
          <View style={styles.dividor} />
          <View style={{paddingHorizontal: 25, flex: 1}}>
            {renderList(sportType)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    elevation: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  congratsText: {
    alignSelf: 'center',
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
    padding: 16,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    marginVertical: 25,
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
  },
  dividor: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.lightGrayBackground,
  },
});
export default CongratulationsModal;
