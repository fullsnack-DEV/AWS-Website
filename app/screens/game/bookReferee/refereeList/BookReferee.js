/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import bodybuilder from 'bodybuilder';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import Header from '../../../../components/Home/Header';
import TCSearchBox from '../../../../components/TCSearchBox';
import RenderReferee from './RenderReferee';
import TCGradientButton from '../../../../components/TCGradientButton';

import AuthContext from '../../../../auth/context';
import { getSearchData } from '../../../../utils';
import strings from '../../../../Constants/String';
import TCFormProgress from '../../../../components/TCFormProgress';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import * as Utils from '../../../challenge/manageChallenge/settingUtility';
import { getUserIndex } from '../../../../api/elasticSearch';

const TYPING_SPEED = 200;
const BookReferee = ({ navigation, route }) => {
  const gameData = route?.params?.gameData;
  console.log('GAME DATA:=>', gameData);
  const authContext = useContext(AuthContext);
  const [refereesData, setRefereesData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    setLoading(true);

    const refefreeList = bodybuilder()
      .query('term', 'referee_data.sport_name.keyword', {
        value: gameData?.sport?.toLowerCase(),
        case_insensitive: true,
      })
      .query('term', 'referee_data.is_published', {
        value: true,
      })
      .build();

    getUserIndex(refefreeList)
      .then((res) => {
        setLoading(false);
        console.log('res referee list:=>', res);
        setRefereesData([...res]);
      })
      .catch(() => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 10);
        // navigation.goBack();
      });
  }, [gameData?.sport]);

  const renderRefereeData = ({ item }) => {
    const referee = item;
    const refereeObject = referee?.referee_data?.filter(
      (refereeItem) => refereeItem?.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase(),
    );

    console.log('setting1:=>', refereeObject);
    return (
      <TouchableOpacity onPress={() => setSelectedReferee(referee)}>
        <RenderReferee
          profilePic={referee?.thumbnail}
          isSelected={referee?.user_id === selectedReferee?.user_id}
          fees={refereeObject?.[0]?.setting?.game_fee?.fee ?? 0}
          name={referee?.full_name}
          country={`${referee?.city ?? ''} ${referee?.country ? ',' : ''} ${
            referee?.country ?? ''
          }`}
          rating={referee?.[0]?.avg_review?.total_avg ?? 0}
          onRadioClick={() => setSelectedReferee(referee)}
        />
      </TouchableOpacity>
    );
  };
  const onSearchRefreeTextChange = (text) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setSearchText(text);
    const search = () => {
      if (text !== '') {
        const data = getSearchData(refereesData, ['full_name'], text);
        if (data?.length > 0) setSearchData([...data]);
        else setSearchData([]);
      }
    };
    setTypingTimeout(setTimeout(search, TYPING_SPEED));
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FastImage
              resizeMode={'contain'}
              source={images.backArrow}
              style={styles.backImageStyle}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTitleTextStyle}>Book a referee</Text>
        }
      />
      <View style={styles.headerBottomBorder} />

      <TCFormProgress totalSteps={2} curruentStep={1} />
      {/* Loader */}
      <ActivityLoader visible={loading} />
      {/* Content */}

      <View style={styles.contentContainer}>
        {/*  Search Bar */}
        <TCSearchBox
          value={searchText}
          placeholderText={'Search'}
          onChangeText={onSearchRefreeTextChange}
        />

        {/*  Total and Filter */}
        <View style={styles.totalAndFilterContainer}>
          <Text style={styles.totalRefereeText}>
            Total {refereesData?.length ?? 0} Referees
          </Text>
          <Text style={styles.filtersText}></Text>
        </View>

        {/*  Referee List Container */}

        <FlatList
          keyExtractor={(item) => item?.user_id}
          bounces={false}
          data={searchText === '' ? refereesData : searchData}
          renderItem={renderRefereeData}
          ListEmptyComponent={
            <Text style={styles.emptySectionListItem}>
              {searchText === ''
                ? 'No referee found'
                : `No referee found for '${searchText}'`}
            </Text>
          }
        />

        {/*  Next Button */}
        {selectedReferee && (
          <View style={{ justifyContent: 'flex-end', marginBottom: 50 }}>
            <TCGradientButton
              title={'NEXT'}
              onPress={() => {
                if (gameData?.referees) {
                  if (
                    gameData?.referees?.length
                    < gameData?.challenge_referee?.who_secure?.length
                  ) {
                    setLoading(true);
                    Utils.getSetting(
                      selectedReferee?.user_id,
                      'referee',
                      gameData.sport,
                      authContext,
                    )
                      .then((response) => {
                        setLoading(false);
                        console.log('res3:::=>', response);
                        if (
                          response?.refereeAvailibility
                          && response?.game_fee
                          && response?.refund_policy
                          && response?.available_area
                        ) {
                          navigation.navigate('RefereeBookingDateAndTime', {
                            settingObj: response,
                            userData: selectedReferee,
                            navigationName: 'HomeScreen',
                            gameData,
                          });
                        } else {
                          setTimeout(() => {
                            Alert.alert('Referee setting not configured yet.');
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
                      `You can't book more than ${gameData?.challenge_referee?.who_secure?.length} referee for this match. You can change the number of referees in the reservation details.`,
                    );
                  }
                } else if (
                  gameData?.challenge_referee?.who_secure?.length > 0
                ) {
                  setLoading(true);
                  Utils.getSetting(
                    selectedReferee?.user_id,
                    'referee',
                    gameData.sport,
                    authContext,
                  )
                    .then((response) => {
                      setLoading(false);
                      console.log('res3:::=>', response);
                      if (
                        response?.refereeAvailibility
                        && response?.game_fee
                        && response?.refund_policy
                        && response?.available_area
                      ) {
                        navigation.navigate('RefereeBookingDateAndTime', {
                          settingObj: response,
                          userData: selectedReferee,
                          navigationName: 'HomeScreen',
                          gameData,
                        });
                      } else {
                        setTimeout(() => {
                          Alert.alert('Referee setting not configured yet.');
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
                    `You can’t book more than ${gameData?.challenge_referee?.who_secure?.length} referee for this match. You can change the number of referees in the reservation details.`,
                  );
                }
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

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
  totalRefereeText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  filtersText: {
    fontSize: 14,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
  },
  emptySectionListItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    marginTop: 10,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
});
export default BookReferee;
