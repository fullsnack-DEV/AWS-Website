/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import bodybuilder from 'bodybuilder';

import FastImage from 'react-native-fast-image';
import * as Utils from '../../../challenge/manageChallenge/settingUtility';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import Header from '../../../../components/Home/Header';
import TCSearchBox from '../../../../components/TCSearchBox';
import RenderScorekeeper from './RenderScorekeeper';
import TCGradientButton from '../../../../components/TCGradientButton';
import AuthContext from '../../../../auth/context'
import { getSearchData } from '../../../../utils';
import { postElasticSearch } from '../../../../api/elasticSearch';
import strings from '../../../../Constants/String';
import TCFormProgress from '../../../../components/TCFormProgress';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

const TYPING_SPEED = 200;
const BookScorekeeper = ({ navigation, route }) => {
  const gameData = route?.params?.gameData;
  // eslint-disable-next-line no-unused-vars
  const authContext = useContext(AuthContext)
  const [scorekeepersData, setScorekeepersData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScorekeeper, setSelectedScorekeeper] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    setLoading(true);

    const scorekeeperList = bodybuilder()
      .query('term', 'scorekeeper_data.sport_name.keyword', {
        value: gameData?.sport?.toLowerCase(),
        case_insensitive: true,
      })
      // .query('term', 'scorekeeper_data.is_published', {
      //   value: true,
      // })
      .build();

    postElasticSearch(scorekeeperList, 'userindex')
      .then((res) => {
        setLoading(false);
        console.log('res scorekeeper list:=>', res);
        setScorekeepersData([...res?.hits?.hits]);
      })
      .catch(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 10);
        // navigation.goBack();
      });
  }, [gameData?.sport])

  const renderScorekeepersData = ({ item }) => {
    const scorekeeper = item._source;
    const scorekeeperObject = scorekeeper?.scorekeeper_data?.filter((scorekeeperItem) => scorekeeperItem?.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase());
    return (
      <TouchableOpacity onPress={() => setSelectedScorekeeper(scorekeeper)}>
        <RenderScorekeeper
            isSelected={scorekeeper?.user_id === selectedScorekeeper?.user_id}
            fees={scorekeeperObject?.[0]?.setting?.game_fee?.fee ?? 0}
            name={scorekeeper?.full_name}
            country={`${scorekeeper?.city ?? ''} ${scorekeeper?.country ? ',' : ''} ${scorekeeper?.country ?? ''}`}
            rating={scorekeeper?.[0]?.avg_review?.total_avg ?? 0}
            onRadioClick={() => setSelectedScorekeeper(scorekeeper)}
        />
      </TouchableOpacity>
    )
  }
  const onSearchScorekeeperTextChange = (text) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setSearchText(text);
    const search = () => {
      if (text !== '') {
        const data = getSearchData(scorekeepersData, ['full_name', 'city', 'country'], text)
        if (data?.length > 0) setSearchData([...data]);
        else setSearchData([]);
      }
    }
    setTypingTimeout(setTimeout(search, TYPING_SPEED))
  }
  return (
    <View style={styles.mainContainer}>
      <Header
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FastImage resizeMode={'contain'} source={images.backArrow} style={styles.backImageStyle}/>
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.eventTitleTextStyle}>Book a scorekeeper</Text>
            }
        />
      <View style={styles.headerBottomBorder}/>

      <TCFormProgress totalSteps={2} curruentStep={1} />
      {/* Loader */}
      <ActivityLoader visible={loading} />

      {/* Content */}
      <View style={styles.contentContainer}>

        {/*  Search Bar */}
        <TCSearchBox
            value={searchText}
            placeholderText={'Search'}
            onChangeText={onSearchScorekeeperTextChange}
        />

        {/*  Total and Filter */}
        <View style={styles.totalAndFilterContainer}>
          <Text style={styles.totalScorekeeperText}>Total {scorekeepersData?.length ?? 0} Scorekeepers</Text>
        </View>

        {/*  Scorekeeper List Container */}
        <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item?.user_id}
            bounces={false}
              data={searchText === '' ? scorekeepersData : searchData}
              renderItem={renderScorekeepersData}
            ListEmptyComponent={<Text style={styles.emptySectionListItem}>
              {searchText === '' ? 'No scorekeepers found' : `No scorekeeper found for '${searchText}'`}
            </Text>}
          />

        {/*  Next Button */}
        {selectedScorekeeper && (
          <SafeAreaView style={{ justifyContent: 'flex-end' }}>
            <TCGradientButton
                  title={'NEXT'}
                  onPress={() => {
                    if (gameData?.scorekeepers) {
                      if (gameData?.scorekeepers?.length < gameData?.challenge_scorekeepers?.length) {
                        setLoading(true);
                        Utils.getSetting(
                          selectedScorekeeper?.user_id,
                          'scorekeeper',
                          gameData.sport,
                          authContext,
                        )
                          .then((response) => {
                            setLoading(false);
                            console.log('res3:::=>', response);
                            if (
                              response?.scorekeeperAvailibility
                              && response?.game_fee
                              && response?.refund_policy
                              && response?.available_area
                            ) {
                              navigation.navigate('ScorekeeperBookingDateAndTime', {
                                settingObj: response,
                                userData: selectedScorekeeper,
                                navigationName: 'HomeScreen',
                                gameData,
                              });
                            } else {
                              setTimeout(() => {
                                Alert.alert('Scorekeeper setting not configured yet.');
                              }, 10);
                            }
                          })
                          .catch(() => {
                            setLoading(false);
                            setTimeout(() => {
                              Alert.alert(
                                strings.alertmessagetitle,
                                strings.defaultError,
                              );
                            }, 10);
                            // navigation.goBack();
                          });
                      } else {
                        Alert.alert(
                          'Towns Cup',
                          `You can’t book more than ${gameData?.challenge_scorekeepers?.who_secure?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
                        )
                      }
                    } else if (gameData?.challenge_scorekeepers?.who_secure?.length > 0) {
                      setLoading(true);
                      Utils.getSetting(
                        selectedScorekeeper?.user_id,
                        'scorekeeper',
                        gameData.sport,
                        authContext,
                      )
                        .then((response) => {
                          setLoading(false);
                          console.log('res3:::=>', response);
                          if (
                            response?.scorekeeperAvailibility
                            && response?.game_fee
                            && response?.refund_policy
                            && response?.available_area
                          ) {
                            navigation.navigate('ScorekeeperBookingDateAndTime', {
                              settingObj: response,
                              userData: selectedScorekeeper,
                              navigationName: 'HomeScreen',
                              gameData,
                            });
                          } else {
                            setTimeout(() => {
                              Alert.alert('Scorekeeper setting not configured yet.');
                            }, 10);
                          }
                        })
                        .catch(() => {
                          setLoading(false);
                          setTimeout(() => {
                            Alert.alert(
                              strings.alertmessagetitle,
                              strings.defaultError,
                            );
                          }, 10);
                          // navigation.goBack();
                        });
                    } else {
                      Alert.alert(
                        'Towns Cup',
                        `You can’t book more than ${gameData?.challenge_scorekeepers?.who_secure?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
                      )
                    }
                  }}
              />
          </SafeAreaView>
          )}

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  headerBottomBorder: {
    height: 1,
    backgroundColor: colors.writePostSepratorColor,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  totalAndFilterContainer: {
    paddingTop: 25,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: colors.grayBackgroundColor,
    borderBottomWidth: 2,

  },
  totalScorekeeperText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  emptySectionListItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    marginTop: 10,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },

})
export default BookScorekeeper;
