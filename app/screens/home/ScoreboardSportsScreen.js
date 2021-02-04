import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import RecentMatchItems from '../../components/Home/RecentMatchItems';
import AuthContext from '../../auth/context';
import { getEventById } from '../../api/Schedule';
import { getGameHomeScreen } from '../../utils/gameUtils';

export default function ScoreboardSportsScreen({
  sportsData,
  showEventNumbers,
  showAssistReferee,
  navigation,
  onItemPress,
}) {
  const authContext = useContext(AuthContext)
  let filterData = [];
  let dataNotFound = true;
  if (sportsData) {
    const todayData = [];
    const yesterdayData = [];
    const pastData = [];
    sportsData.filter((item_filter) => {
      const startDate = new Date(item_filter.start_datetime * 1000);
      const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      const dateText = moment(dateFormat).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Past]',
        sameElse: '[Past]',
      })
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
      return null;
    })
    filterData = [
      {
        title: 'Today',
        data: todayData,
      },
      {
        title: 'Yesterday',
        data: yesterdayData,
      },
      {
        title: 'Past',
        data: pastData,
      },
    ];
  }
  return (
    <KeyboardAvoidingView style={ styles.mainContainer }>
      {dataNotFound
        ? <Text style={styles.dataNotFoundText}>Data Not Found!</Text>
        : <SectionList
          renderItem={ ({ item }) => (
            <RecentMatchItems
              data={item}
              // onThreeDotPress={() => {}}
              showEventNumbers={showEventNumbers}
              showAssistReferee={showAssistReferee}
              onItemPress={() => {
                onItemPress();
                setTimeout(() => {
                  const entity = authContext.entity
                  if (item?.game_id) {
                    if (item?.sport) {
                      const gameHome = getGameHomeScreen(item?.sport);
                      navigation.navigate(gameHome, {
                        gameId: item?.game_id,
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
              }}
            />
          ) }
          renderSectionHeader={ ({ section }) => (
            section.data.length > 0 && <Text style={ styles.sectionHeader }>{section.title}</Text>
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
