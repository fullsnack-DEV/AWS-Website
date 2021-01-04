import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import Header from '../../../../components/Home/Header';
import TCSearchBox from '../../../../components/TCSearchBox';
import RenderScorekeeper from './RenderScorekeeper';
import TCGradientButton from '../../../../components/TCGradientButton';
import AuthContext from '../../../../auth/context'
import TCInnerLoader from '../../../../components/TCInnerLoader';
import { getSearchData } from '../../../../utils';
import { getUserList } from '../../../../api/Users';
import TCStep from '../../../../components/TCStep';

const TYPING_SPEED = 200;
const BookScorekeeper = ({ navigation, route }) => {
  const gameData = route?.params?.gameData;
  const authContext = useContext(AuthContext)
  const [scorekeepersData, setScorekeepersData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScorekeeper, setSelectedScorekeeper] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    setLoading(true);
    getUserList(authContext).then((res) => {
      setScorekeepersData([...res?.payload]);
    }).finally(() => setLoading(false))
  }, [])

  const renderScorekeepersData = ({ item }) => {
    const scorekeeper = item?.scorekeeper_data?.filter((scorekeeperItem) => scorekeeperItem?.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase());
    return (
      <RenderScorekeeper
            isSelected={item?.user_id === selectedScorekeeper?.user_id}
            fees={scorekeeper?.[0]?.fee ?? 0}
            name={item?.full_name}
            country={`${item?.city ?? ''} ${item?.country ? ',' : ''} ${item?.country ?? ''}`}
            rating={scorekeeper?.[0]?.avg_review?.total_avg ?? 0}
            onRadioClick={() => setSelectedScorekeeper(item)}
        />
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

      <TCStep totalStep={2} currentStep={1}/>
      {/* Loader */}
      <TCInnerLoader visible={loading}/>

      {/* Content */}
      {!loading && (
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
            <Text style={styles.filtersText}>Filters</Text>
          </View>

          {/*  Scorekeeper List Container */}
          {!loading && (
            <FlatList
            keyExtractor={(item) => item?.user_id}
            bounces={false}
              data={searchText === '' ? scorekeepersData : searchData}
              renderItem={renderScorekeepersData}
            ListEmptyComponent={<Text style={styles.emptySectionListItem}>
              {searchText === '' ? 'No scorekeepers found' : `No scorekeeper found for '${searchText}'`}
            </Text>}
          />
          )}

          {/*  Next Button */}
          {selectedScorekeeper && (
            <View style={{ justifyContent: 'flex-end' }}>
              <TCGradientButton
                  title={'NEXT'}
                  onPress={() => {
                    if (gameData?.scorekeepers) {
                      if (gameData?.scorekeepers?.length < gameData?.challenge_scorekeepers?.length) {
                        navigation.navigate('ScorekeeperBookingDateAndTime', { userData: selectedScorekeeper, gameData });
                      } else {
                        Alert.alert(
                          'Towns Cup',
                          `You can’t book more than ${gameData?.challenge_scorekeepers?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
                        )
                      }
                    } else if (gameData?.challenge_scorekeepers?.length > 0) {
                      navigation.navigate('ScorekeeperBookingDateAndTime', { userData: selectedScorekeeper, gameData });
                    } else {
                      Alert.alert(
                        'Towns Cup',
                        `You can’t book more than ${gameData?.challenge_scorekeepers?.length} scorekeeper for this match. You can change the number of scorekeepers in the reservation details.`,
                      )
                    }
                  }}
              />
            </View>
          )}

        </View>
      )}
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

})
export default BookScorekeeper;
