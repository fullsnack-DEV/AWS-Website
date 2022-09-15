import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import RecentMatchItems from '../../components/Home/RecentMatchItems';
import AuthContext from '../../auth/context';
import {getEventById} from '../../api/Schedule';
import {getGameHomeScreen} from '../../utils/gameUtils';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

export default function ScoreboardSportsScreen({
  sportsData,
  showEventNumbers,
  navigation,
  onItemPress,
  comeFrom = '',
  onBackPress = () => {},
}) {
  const authContext = useContext(AuthContext);
  const filterData = [];
  let dataNotFound = true;
  if (sportsData) {
    const todayData = [];
    const yesterdayData = [];
    const pastData = [];
    const futureData = [];
    sportsData.filter((item_filter) => {
      const startDate = new Date(item_filter.start_datetime * 1000);
      const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      let dateText = null;
      if (startDate.getTime() > new Date().getTime()) {
        dateText = 'Future';
      } else {
        dateText = moment(dateFormat).calendar(null, {
          sameDay: '[Today]',
          lastDay: '[Yesterday]',
          lastWeek: '[Past]',
          sameElse: '[Past]',
        });
      }
      if (dateText === 'Today') {
        todayData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Yesterday') {
        yesterdayData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Past') {
        pastData.push(item_filter);
        dataNotFound = false;
      }

      if (dateText === 'Future') {
        futureData.push(item_filter);
        dataNotFound = false;
      }
      return null;
    });
    if (pastData?.length > 0) filterData.push({title: 'Past', data: pastData});
    if (todayData?.length > 0)
      filterData.push({title: 'Today', data: todayData});
    if (yesterdayData?.length > 0)
      filterData.push({title: 'Yesterday', data: yesterdayData});
    if (futureData?.length > 0)
      filterData.push({title: 'Future', data: futureData});
  }

  const onGameCardClick = (item) => {
    if (comeFrom !== 'UserScoreboardScreen') {
      onItemPress();
    }
    setTimeout(() => {
      const entity = authContext.entity;
      if (item?.game_id) {
        if (item?.sport) {
          const gameHome = getGameHomeScreen(item?.sport);
          navigation.navigate(gameHome, {
            gameId: item?.game_id,
            onBackPress: () => onBackPress(),
          });
        }
      } else {
        getEventById(
          entity.role === Verbs.entityTypeUser ? 'users' : 'groups',
          entity.uid || entity.auth.user_id,
          item.cal_id,
          authContext,
        )
          .then((response) => {
            navigation.navigate('EventScreen', {
              data: response.payload,
              gameData: item,
            });
          })
          .catch((e) => {
            console.log('Error :-', e);
          });
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>
      {dataNotFound ? (
        <Text style={styles.dataNotFoundText}>
          {strings.noScorekeeperFound}
        </Text>
      ) : (
        <SectionList
          renderItem={({item}) => {
            let isAssistantReferee = false;
            const myRefereeData = item?.referees?.filter(
              (refereeItem) =>
                refereeItem?.referee_id === authContext?.entity?.uid,
            );
            if (myRefereeData?.length > 0 && !myRefereeData?.[0]?.chief_referee)
              isAssistantReferee = true;
            return (
              <RecentMatchItems
                data={item}
                // onThreeDotPress={() => {}}
                showEventNumbers={showEventNumbers}
                showAssistReferee={isAssistantReferee}
                onItemPress={() => onGameCardClick(item)}
              />
            );
          }}
          renderSectionHeader={({section}) =>
            section.data.length > 0 && (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )
          }
          sections={filterData}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
        />
      )}
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
