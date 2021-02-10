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
import { getGameSlots } from '../../../../api/Games';
import AuthContext from '../../../../auth/context'
import TCInnerLoader from '../../../../components/TCInnerLoader';
import { getSearchData } from '../../../../utils';
import GameCard from '../../../../components/TCGameCard';

const TYPING_SPEED = 200;

const ScorekeeperSelectMatch = ({ navigation, route }) => {
  const sport = route?.params?.sport;
  const userData = route?.params?.userData;
  const authContext = useContext(AuthContext)
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(0);
  useEffect(() => {
    console.log('userData:::::=>', userData);
    setLoading(true);
    const headers = {}
    headers.caller_id = authContext?.entity?.uid;
    getGameSlots(
      'scorekeepers',
      userData?.user_id,
      `status=accepted&sport=${sport}&scorekeeperDetail=true`,
      headers,
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
      console.log(matchData);
      if (text !== '') {
        const data = getSearchData(matchData, ['sport'], text)
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
          <FlatList
          showsVerticalScrollIndicator={false}
              style={{ marginTop: 20 }}
            keyExtractor={(item) => item?.user_id}
            bounces={false}
              data={searchText === '' ? matchData : searchData}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 5 }}>
                  <GameCard
                    data={item}
                    onPress={() => {
                      const game = item;
                      let isSameScorekeeper = false;
                      const sameScorekeeperCount = game?.scorekeepers?.filter((gameScorekeeper) => gameScorekeeper?.user_id === userData?.user_id);
                      if (sameScorekeeperCount?.length > 0) isSameScorekeeper = true;

                      let message = '';
                      if (isSameScorekeeper) {
                        message = 'This scorekeeper is already booked for this game.';
                      } else if (!game.isAvailable) {
                        message = 'There is no available slot of a scorekeeper who you can book in this game.';
                      } else if ((game?.scorekeepers?.count ?? 0) >= 3) {
                        message = 'There is no available slot of a scorekeeper who you can book in this game.';
                      }
                      if (message === '') {
                        navigation.navigate(route?.params?.comeFrom, {
                          comeFrom: 'ScorekeeperSelectMatch',
                          gameData: item,
                        });
                      } else {
                        setTimeout(() => Alert.alert('Towns Cup', message));
                      }
                    }}
                />
                </View>
              )}
            ListEmptyComponent={<Text style={styles.emptySectionListItem}>
              {searchText === '' ? 'No match found' : `No match found for '${searchText}'`}
            </Text>}
          />
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
export default ScorekeeperSelectMatch;
