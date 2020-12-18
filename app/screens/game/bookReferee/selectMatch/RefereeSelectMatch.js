import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import Header from '../../../../components/Home/Header';
import TCSearchBox from '../../../../components/TCSearchBox';
import { getGameSlots } from '../../../../api/Games';
import AuthContext from '../../../../auth/context'
import TCInnerLoader from '../../../../components/TCInnerLoader';
import { getSearchData } from '../../../../utils';
import GameCard from '../../../../components/TCGameCard';

const TYPING_SPEED = 200;

const RefereeSelectMatch = ({ navigation, route }) => {
  const gameData = route?.params?.gameData;
  const userData = route?.params?.userData;
  const authContext = useContext(AuthContext)
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    setLoading(true);
    getGameSlots(
      'referees',
      userData?.user_id,
      `status=accepted&sport=${gameData?.sport}&refereeDetail=true`,
      authContext,
    )
      .then((res) => {
        setMatchData([...res?.payload]);
      }).finally(() => setLoading(false))
  }, [])

  const onSearchTextChange = (text) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setSearchText(text);
    const search = () => {
      if (text !== '') {
        const data = getSearchData(matchData, ['full_name', 'city', 'country'], text)
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
              <Text style={styles.eventTitleTextStyle}>Choose a match</Text>
            }
        />
      <View style={styles.headerBottomBorder}/>

      {/* Loader */}
      <TCInnerLoader visible={loading}/>

      {/* Content */}
      {!loading && (
        <View style={styles.contentContainer}>

          {/*  Search Bar */}
          <TCSearchBox
            value={searchText}
            placeholderText={'Search'}
            onChangeText={onSearchTextChange}
        />

          {/*  Match List Container */}
          {!loading && (
            <FlatList
            keyExtractor={(item) => item?.user_id}
            bounces={false}
              data={searchText === '' ? matchData : searchData}
              renderItem={({ item }) => (
                <GameCard
                    data={item}
                    onPress={() => {
                      navigation.navigation('RefereeBookingDataAndTime', { gameData: item })
                    }}
                />
              )}
            ListEmptyComponent={<Text style={styles.emptySectionListItem}>
              {searchText === '' ? 'No match found' : `No match found for '${searchText}'`}
            </Text>}
          />
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
  emptySectionListItem: {
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginLeft: 10,
    marginTop: 10,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },

})
export default RefereeSelectMatch;
