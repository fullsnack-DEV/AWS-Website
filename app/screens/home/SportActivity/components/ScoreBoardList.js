// @flow
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import moment from 'moment';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import GameStatus from '../../../../Constants/GameStatus';
import ScoreboardCard from './ScoreboardCard';
import images from '../../../../Constants/ImagePath';

const ScoreBoardList = ({
  loading = false,
  matchList = [],
  onSeeAll = () => {},
  screenType = Verbs.screenTypeModal,
  sectionList = [],
  matchCount = 0,
  title = strings.scoreboard,
  onCardPress = () => {},
}) => {
  const [scoreboardList, setScoreboardList] = useState({});
  const prepareSeparateList = useCallback(() => {
    const list = {};

    matchList.forEach((item) => {
      const isGameEnded = item.status === GameStatus.ended;
      const today = moment().diff(moment(item.start_datetime), 'days') === 0;
      const yesterday =
        isGameEnded &&
        moment()
          .subtract(1, 'days')
          .diff(moment(item.start_datetime), 'days') === -1;
      const past =
        isGameEnded &&
        moment().subtract(1, 'days').diff(moment(item.start_datetime), 'days') >
          -1;

      const tomorrow =
        !isGameEnded &&
        moment().add(1, 'days').diff(moment(item.start_datetime), 'days') === 1;

      const future =
        !isGameEnded &&
        moment().add(1, 'days').diff(moment(item.start_datetime), 'days') > 1;

      if (today) {
        list[strings.today] =
          (list[strings.today] ?? []).length > 0
            ? [...list[strings.today], item]
            : [item];
      }
      if (yesterday) {
        list[strings.yesterday] =
          (list[strings.yesterday] ?? []).length > 0
            ? [...list[strings.yesterday], item]
            : [item];
      }
      if (past) {
        list[strings.past] =
          (list[strings.past] ?? []).length > 0
            ? [...list[strings.past], item]
            : [item];
      }
      if (tomorrow) {
        list[strings.tomorrow] =
          (list[strings.tomorrow] ?? []).length > 0
            ? [...list[strings.tomorrow], item]
            : [item];
      }
      if (future) {
        list[strings.future] =
          (list[strings.future] ?? []).length > 0
            ? [...list[strings.future], item]
            : [item];
      }
    });

    setScoreboardList({...list});
  }, [matchList]);

  useEffect(() => {
    if (matchList.length > 0 && screenType === Verbs.screenTypeMainScreen) {
      prepareSeparateList();
    }
  }, [matchList, prepareSeparateList, screenType]);

  const renderList = () => {
    if (loading) {
      return (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'small'} />
        </View>
      );
    }
    if (matchList.length > 0) {
      return (
        <FlatList
          data={matchList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <ScoreboardCard
              item={item}
              style={[{marginVertical: 15}, index > 0 ? {marginLeft: 15} : {}]}
            />
          )}
        />
      );
    }
    return (
      <Image
        style={{height: 188, width: '100%', marginTop: 10}}
        source={images.noScoreboardImage}
      />
    );
  };

  const renderFullScreenView = () => {
    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (matchCount === 0) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.warningText}>{strings.noMatchText}</Text>
        </View>
      );
    }

    if (sectionList.length > 0) {
      return (
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {sectionList.map((ele, idx) =>
            (scoreboardList[ele] ?? []).length > 0 ? (
              <View key={idx} style={{marginBottom: 15}}>
                <Text style={styles.sectionHeader}>{ele}</Text>
                <FlatList
                  data={scoreboardList[ele] ?? []}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <ScoreboardCard
                      item={item}
                      style={[
                        {marginTop: 5, marginBottom: 20, width: '100%'},
                        index > 0 ? {marginLeft: 15} : {},
                      ]}
                      onCardPress={onCardPress}
                    />
                  )}
                />
              </View>
            ) : null,
          )}
        </ScrollView>
      );
    }

    return null;
  };

  return screenType === Verbs.screenTypeModal ? (
    <View style={styles.parent}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.buttonText}>{strings.seeAllText}</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={
          styles.text
        }>{`${matchList.length} ${strings.completedText}`}</Text>
      {renderList()}
    </View>
  ) : (
    <View style={styles.container}>{renderFullScreenView()}</View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginVertical: 25,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 22,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
  },
  sectionHeader: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  loaderView: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ScoreBoardList;
