import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

// import AuthContext from '../../auth/context';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import strings from '../../Constants/String';
import TCGameCard from '../../components/TCGameCard';
import { gameData } from '../../utils/constant';
import ShortsCard from '../../components/ShortsCard';
import { widthPercentageToDP } from '../../utils';
import TCChallengerCard from '../../components/TCChallengerCard';
import TCHiringPlayersCard from '../../components/TCHiringPlayersCard';
import TCEntityView from '../../components/TCEntityView';
import TCRecentMatchCard from '../../components/TCRecentMatchCard';
import TCThinDivider from '../../components/TCThinDivider';
import TCSearchBox from '../../components/TCSearchBox';

export default function LocalHomeScreen({ navigation }) {
  // const [loading, setloading] = useState(false);
  const [locationPopup, setLocationPopup] = useState(false);
  const [selectedLocationOption, setSelectedLocationOption] = useState();
  // const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image source={images.townsCupIcon} style={styles.townsCupIcon} />
      ),
      headerTitle: () => (
        <View style={styles.titleHeaderView}>
          <Text style={styles.headerTitle} onPress={() => setLocationPopup(true)}>Vancuver</Text>
          <Image source={images.home_gps} style={styles.gpsIconStyle} />
        </View>
      ),
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <Image source={images.home_search} style={styles.townsCupIcon} />
          <Image source={images.home_setting} style={styles.townsCupIcon} />
        </View>
      ),
    });
  }, [navigation]);

  const sportsListView = useCallback(
    ({ item }) => <Text style={styles.sportName}>{item}</Text>,
    [],
  );

  const shortsListView = useCallback(() => <ShortsCard />, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderRecentMatchItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCRecentMatchCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderGameItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCGameCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderChallengerItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCChallengerCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );
  const renderHiringPlayersItems = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 15 }}>
        <TCHiringPlayersCard data={item} cardWidth={'92%'} />
      </View>
    ),
    [],
  );

  const renderEntityListView = useCallback(
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView />
      </View>
    ),
    [],
  );

  const renderRefereesScorekeeperListView = useCallback(
    () => (
      <View style={{ marginBottom: 15 }}>
        <TCEntityView showStar={true} />
      </View>
    ),
    [],
  );
  const renderSeparator = () => (
    <View
      style={{
        height: 50,
        width: 10,
      }}
    />
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sportsListView}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[
            'Soccer',
            'Baseball',
            'Basketball',
            'Tennis Single',
            'Tennis Double',
          ]}
          keyExtractor={keyExtractor}
          renderItem={sportsListView}
          style={{
            width: '100%',
            height: 50,
            alignContent: 'center',
          }}
        />
      </View>
      <ScrollView>
        <View>
          <TCTitleWithArrow
            title={strings.recentMatchesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('RecentMatchScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderRecentMatchItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
          {/* <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
          keyExtractor={keyExtractor}
          renderItem={renderRecentMatchItems}
          ItemSeparatorComponent={() => (<View
            style={{
              height: 50,
              width: 10,
            }}
          />)}
          style={{ marginLeft: 15 }}
        /> */}
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.upcomingMatchesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('UpcomingMatchScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderGameItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.shortsTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            keyExtractor={keyExtractor}
            renderItem={shortsListView}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.lookingForTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('LookingForChallengeScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderChallengerItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.hiringPlayerTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('HiringPlayerScreen')}
          />
          <Carousel
            data={[{ ...gameData }, { ...gameData }, { ...gameData }, { ...gameData }]}
            renderItem={renderHiringPlayersItems}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={widthPercentageToDP(100)}
            itemWidth={widthPercentageToDP(94)}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.lookingForTeamTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('LookingTeamScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderEntityListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.refereesTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('RefereesListScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderRefereesScorekeeperListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <View>
          <TCTitleWithArrow
            title={strings.scorekeeperTitle}
            showArrow={true}
            viewStyle={{ marginTop: 20, marginBottom: 15 }}
            onPress={() => navigation.navigate('ScorekeeperListScreen')}
          />
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={['', '', '', '', '']}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderRefereesScorekeeperListView}
            style={{ marginLeft: 15 }}
          />
        </View>
        <Modal
          backdropColor="black"
          onBackdropPress={() => false}
          backdropOpacity={1}
          animationType="slide"
          transparent={true}
          visible={locationPopup}>

          <View style={styles.bottomPopupContainer}>
            <View
                style={styles.viewsContainer}>
              <Text
              onPress={() => setLocationPopup(false)}
                  style={styles.cancelText}>
                Cancel
              </Text>
              <Text
                  style={styles.locationText}>
                Location
              </Text>
              <Text
               onPress={() => setLocationPopup(false)}
                  style={styles.doneText}>
                Done
              </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableOpacity onPress={() => setSelectedLocationOption(0)}>
              {selectedLocationOption === 0 ? <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                <Text
                  style={[styles.curruentLocationText, { color: colors.whiteColor }]}>
                  Current location
                </Text>
              </LinearGradient> : <View style={styles.backgroundView}>
                <Text
                  style={styles.curruentLocationText}>
                  Current location
                </Text>
              </View>}

            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedLocationOption(1)}>

              {selectedLocationOption === 1 ? <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                <Text
                  style={[styles.myCityText, { color: colors.whiteColor }]}>
                  My home city
                </Text>
              </LinearGradient> : <View style={styles.backgroundView}>
                <Text
                  style={styles.myCityText}>
                  My home city
                </Text>
              </View>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedLocationOption(2)}>

              {selectedLocationOption === 2 ? <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                <Text
                  style={[styles.worldText, { color: colors.whiteColor }]}>
                  World
                </Text>
              </LinearGradient> : <View style={styles.backgroundView}>
                <Text
                  style={styles.worldText}>
                  World
                </Text>
              </View>}
            </TouchableOpacity>
            <Text
                style={styles.orText}>
              Or
            </Text>
            <TCSearchBox
                style={{ alignSelf: 'center' }}
                placeholderText={'Search by city, state or country'}
              />
          </View>

        </Modal>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  townsCupIcon: {
    resizeMode: 'cover',
    height: 30,
    width: 30,
    marginLeft: 15,
  },
  gpsIconStyle: {
    resizeMode: 'cover',
    height: 30,
    width: 30,
  },
  titleHeaderView: {
    flexDirection: 'row',
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
  },
  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 15,
    color: colors.lightBlackColor,
  },
  sportName: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 15,
  },
  sportsListView: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    marginBottom: 5,
    elevation: 5,
  },
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('86%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  orText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    margin: 15,
  },
  worldText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  doneText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
});
