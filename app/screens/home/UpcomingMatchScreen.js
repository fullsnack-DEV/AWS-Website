import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import UpcomingMatchItems from '../../components/Home/UpcomingMatchItems';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import { getEventById } from '../../api/Schedule';
import { getGameHomeScreen } from '../../utils/gameUtils';

export default function UpcomingMatchScreen({
  sportsData,
  showEventNumbers,
  navigation,
  onItemPress,
  onBackPress,
}) {
  const authContext = useContext(AuthContext)
  let filterData = [];
  let dataNotFound = true;
  if (sportsData) {
    const todayData = [];
    const tomorrowData = [];
    const futureData = [];
    sportsData.filter((item_filter) => {
      const startDate = new Date(item_filter.start_datetime * 1000);
      const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      const dateText = moment(dateFormat).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[Future]',
        sameElse: '[Future]',
      })
      if (dateText === 'Today') {
        todayData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Tomorrow') {
        tomorrowData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Future') {
        futureData.push(item_filter);
        dataNotFound = false;
      }
      return null;
    })
    filterData = []
    if (todayData?.length > 0) filterData.push({ title: 'Today', data: todayData })
    if (tomorrowData?.length > 0) filterData.push({ title: 'Tomorrow', data: tomorrowData })
    if (futureData?.length > 0) filterData.push({ title: 'Future', data: futureData })
  }

  const onGameCardClick = (item) => {
    onItemPress();
    setTimeout(() => {
      const entity = authContext.entity
      if (item?.game_id) {
        if (item?.sport) {
          const gameHome = getGameHomeScreen(item?.sport);
          navigation.navigate(gameHome, {
            gameId: item?.game_id,
            onBackPress: () => onBackPress(),
          })
        }
      } else {
        getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, item.cal_id, authContext).then((response) => {
          navigation.navigate('EventScreen', { data: response.payload, gameData: item });
        }).catch((e) => {
          console.log('Error :-', e);
        })
      }
    }, 1000)
  }
  return (
    <KeyboardAvoidingView style={ styles.mainContainer }>
      {dataNotFound
        ? <Text style={styles.dataNotFoundText}>Data Not Found!</Text>
        : <SectionList
          renderItem={ ({ item }) => (
            <UpcomingMatchItems
              data={item}
              // onThreeDotPress={() => {}}
              onItemPress={() => onGameCardClick(item)}
              showEventNumbers={showEventNumbers}
            />
          ) }
          renderSectionHeader={ ({ section: { title } }) => (
            <Text style={ styles.sectionHeader }>{title}</Text>
          ) }
          sections={filterData}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
        />
      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    paddingTop: 15,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.whiteColor,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
});
