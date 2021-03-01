import React, {
  useCallback,
  useLayoutEffect,
} from 'react';
import {
View, StyleSheet, FlatList, Text, Image,
 ScrollView,
} from 'react-native';

// import ActivityLoader from '../../components/loader/ActivityLoader';

// import AuthContext from '../../auth/context';
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

export default function LocalHomeScreen({ navigation }) {
  // const [loading, setloading] = useState(false);

  // const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image source={images.townsCupIcon} style={styles.townsCupIcon} />
      ),
      headerTitle: () => (
        <View style={styles.titleHeaderView}>
          <Text style={styles.headerTitle}>Vancuver</Text>
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
    [navigation],
  );

  const shortsListView = useCallback(
    () => <ShortsCard />,
    [navigation],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderGameItems = useCallback(
    ({ item }) => <View style={{ marginBottom: 15 }}><TCGameCard data={item} cardWidth={'92%'}/></View>,
    [],
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
          title={strings.upcomingMatchesTitle}
          showArrow={true}
          viewStyle={{ marginTop: 20, marginBottom: 15 }}
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
          data={[
            '',
            '',
            '',
            '',
            '',
          ]}
          keyExtractor={keyExtractor}
          renderItem={shortsListView}
        />
        </View>
        <View>
          <TCTitleWithArrow
          title={strings.lookingForTitle}
          showArrow={true}
          viewStyle={{ marginTop: 20, marginBottom: 15 }}
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
  },
});
