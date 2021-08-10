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
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import Header from '../../../../components/Home/Header';
import TCSearchBox from '../../../../components/TCSearchBox';
import RenderReferee from './RenderReferee';
import TCGradientButton from '../../../../components/TCGradientButton';
import { getGameUser } from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import { getSearchData } from '../../../../utils';
import TCStep from '../../../../components/TCStep';

const TYPING_SPEED = 200;
const BookReferee = ({ navigation, route }) => {
  const gameData = route?.params?.gameData;
  const authContext = useContext(AuthContext);
  const [refereesData, setRefereesData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    setLoading(true);
    getGameUser(gameData?.sport, 'referees', authContext)
      .then((res) => {
        setRefereesData([...res?.payload]);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderRefereeData = ({ item }) => {
    const referee = item?.referee_data?.filter(
      (refereeItem) => refereeItem?.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase(),
    );
    return (
      <TouchableOpacity onPress={() => setSelectedReferee(item)}>
        <RenderReferee
        profilePic={item?.thumbnail}
        isSelected={item?.user_id === selectedReferee?.user_id}
        fees={referee?.[0]?.fee ?? 0}
        name={item?.full_name}
        country={`${item?.city ?? ''} ${item?.country ? ',' : ''} ${
          item?.country ?? ''
        }`}
        rating={referee?.[0]?.avg_review?.total_avg ?? 0}
        onRadioClick={() => setSelectedReferee(item)}
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

      <TCStep totalStep={2} currentStep={1}/>
      {/* Loader */}
      <TCInnerLoader visible={loading} />
      {/* Content */}
      {!loading && (
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
          {!loading && (
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
          )}
          {/*  Next Button */}
          {selectedReferee && (
            <View style={{ justifyContent: 'flex-end', marginBottom: 50 }}>
              <TCGradientButton
                title={'NEXT'}
                onPress={() => {
                  if (gameData?.referees) {
                    if (
                      gameData?.referees?.length
                      < gameData?.challenge_referee?.length
                    ) {
                      navigation.navigate('RefereeBookingDateAndTime', {
                        userData: selectedReferee,
                        gameData,
                      });
                    } else {
                      Alert.alert(
                        'Towns Cup',
                        `You can't book more than ${gameData?.challenge_referee?.length} referee for this match. You can change the number of referees in the reservation details.`,
                      );
                    }
                  } else if (gameData?.challenge_referee?.length > 0) {
                    navigation.navigate('RefereeBookingDateAndTime', {
                      userData: selectedReferee,
                      gameData,
                    });
                  } else {
                    Alert.alert(
                      'Towns Cup',
                      `You can’t book more than ${gameData?.challenge_referee?.length} referee for this match. You can change the number of referees in the reservation details.`,
                    );
                  }
                }}
              />
            </View>
          )}
        </View>
      )}
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
