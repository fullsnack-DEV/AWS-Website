/* eslint-disable no-shadow */
import {
  View,
  FlatList,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useContext, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import TCTitleWithArrow from '../../components/TCTitleWithArrow';
import {strings} from '../../../Localization/translation';
import TeamCard from './TeamCard';
import HorizontalsCards from './HorizontalsCards';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';

import {
  dummyEventdata,
  dummyPlayerData,
  dummyTeamData,
  gameData,
} from '../../utils/constant';
import TCGameCardPlaceholder from '../../components/TCGameCardPlaceholder';
import PlayersCard from './PlayersCard';
import {getDataForNextScreen} from './LocalHomeUtils';
import {getSingleSportList} from '../../utils/sportsActivityUtils';
import {getSportName} from '../../utils';
import {getGameHomeScreen} from '../../utils/gameUtils';
import PlayersCardPlaceHolder from './PlayersCardPlaceHolder';
import TCThinDivider from '../../components/TCThinDivider';
import colors from '../../Constants/Colors';
import EventsCard from './EventsCard';
import fonts from '../../Constants/Fonts';
import PlayerShimmerCard from './PlayerShimmerCard';

const LocalHomeMenuItems = memo(
  ({
    item,
    selectedSport,
    sportType,
    sports,
    selectedLocationOption,
    filter,
    location,
    navigateToRefreeScreen,
    navigateToScoreKeeper,
    owners,
    allUserData,
    cardLoader,
  }) => {
    const navigation = useNavigation();
    const authContext = useContext(AuthContext);

    const onCardPress = (card, item) => {
      if (
        card.key === strings.completedMatches ||
        card.key === strings.upcomingMatchesTitle
      ) {
        const sportName = getSportName(item, authContext);
        const routeName = getGameHomeScreen(sportName);

        if (routeName) navigation.push(routeName, {gameId: item?.game_id});
      } else {
        navigation.navigate('HomeScreen', {
          uid: [Verbs.entityTypeUser, Verbs.entityTypePlayer]?.includes(
            item?.entity_type,
          )
            ? item?.user_id
            : item?.group_id,
          role: [Verbs.entityTypeUser, Verbs.entityTypePlayer]?.includes(
            item?.entity_type,
          )
            ? Verbs.entityTypeUser
            : item.entity_type,
          backButtonVisible: true,
          menuBtnVisible: false,
        });
      }
    };

    const onTitlePress = (item) => {
      switch (item?.key) {
        case strings.playersAvailableforChallenge:
          {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );

            navigation.navigate('LookingForChallengeScreen', {
              filters: data,
              registerFavSports: getSingleSportList(sports),
            });
          }
          break;

        case strings.refreesAvailable:
          navigateToRefreeScreen();
          break;

        case strings.scorekeepersAvailable:
          navigateToScoreKeeper();

          break;

        case strings.hiringPlayerTitle:
          {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );

            navigation.navigate('RecruitingPlayerScreen', {
              filters: {
                ...data,
              },
            });
          }

          break;

        case strings.completedMatches:
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            const data = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('RecentMatchScreen', {
              filters: {
                location: data.location,
                locationOption: data.locationOption,
              },
              teamSportData: data.teamSportData,
            });
          } else {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );

            navigation.navigate('RecentMatchScreen', {
              filters: data,
            });
          }

          break;

        case strings.upcomingMatchesTitle:
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            const data = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('UpcomingMatchScreen', {
              filters: {
                location: data.location,
                locationOption: data.locationOption,
              },
              teamSportData: data.teamSportData,
            });
          } else {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('UpcomingMatchScreen', {
              filters: data,
            });
          }

          break;

        case strings.teamAvailableforChallenge:
          {
            const data = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LookingForChallengeScreen', {
              filters: {
                location: data.location,
                locationOption: data.locationOption,
              },
              teamSportData: data.teamSportData,
              registerFavSports: sports,
            });
          }

          break;

        case strings.lookingForTeamTitle:
          {
            const data = getDataForNextScreen(
              Verbs.SPORT_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LookingTeamScreen', {
              filters: data,
            });
          }

          break;

        case strings.eventHometitle:
          Alert.alert('Pressd');
          break;

        default:
          console.log('Pressed');
      }
    };

    const RenderMenuItem = (items) => {
      switch (items.key) {
        case strings.rankingInWorld:
          return (
            <>
              <TCTitleWithArrow
                title={strings.rankingInWorld}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                isDisabled={!(items.data.length > 0)}
              />

              <FlatList
                data={[]}
                extraData={[]}
                horizontal
                scrollEnabled={items.data.length > 0}
                contentContainerStyle={{paddingVertical: 6}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => <TeamCard item={item} />}
                ListEmptyComponent={() => (
                  <>
                    {cardLoader ? (
                      <PlayerShimmerCard data={dummyPlayerData} />
                    ) : (
                      <PlayersCardPlaceHolder
                        data={dummyTeamData}
                        forTeams={true}
                        placeholdertext={strings.hiringPlayersPlaceholderText}
                      />
                    )}
                  </>
                )}
              />

              <TCThinDivider
                height={7}
                backgroundColor={colors.grayBackgroundColor}
                width={'100%'}
                marginTop={25}
              />
            </>
          );
        case strings.completedMatches:
          return (
            <>
              <TCTitleWithArrow
                title={strings.completedMatches}
                showArrow={true}
                viewStyle={{marginBottom: 15, marginTop: 25}}
                isDisabled={!(items.data.length > 0)}
                onPress={() => onTitlePress(item)}
              />

              {items.data.map((item, index) => (
                <Text style={styles.titleTextStyle} key={index}>
                  {item.title}
                </Text>
              ))}

              {items.data.length > 0 ? (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {items.data.map((section, index) => (
                      <React.Fragment key={index}>
                        {section.data.map((item) => (
                          <View key={item.id} style={{marginRight: 10}}>
                            <HorizontalsCards
                              item={item}
                              onPress={() => onCardPress(items, item)}
                            />
                          </View>
                        ))}
                      </React.Fragment>
                    ))}
                  </ScrollView>
                </>
              ) : (
                <TCGameCardPlaceholder
                  data={gameData}
                  placeholderText={strings.noMatch}
                  upComingMatch={true}
                />
              )}
            </>
          );

        case strings.upcomingMatchesTitle:
          return (
            <>
              <TCTitleWithArrow
                title={strings.upcomingMatchesTitle}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                isDisabled={!(items.data.length > 0)}
                onPress={() => onTitlePress(item)}
              />

              {items.data.map((item, index) => (
                <Text style={styles.titleTextStyle} key={index}>
                  {item.title}
                </Text>
              ))}

              {items.data.length > 0 ? (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {items.data.map((section, index) => (
                      <React.Fragment key={index}>
                        {section.data.map((item) => (
                          <View key={item.id} style={{marginRight: 10}}>
                            <HorizontalsCards
                              item={item}
                              onPress={() => onCardPress(items, item)}
                            />
                          </View>
                        ))}
                      </React.Fragment>
                    ))}
                  </ScrollView>

                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              ) : (
                <TCGameCardPlaceholder
                  data={gameData}
                  placeholderText={strings.noMatch}
                  upComingMatch={true}
                />
              )}
            </>
          );

        case strings.eventHometitle:
          return (
            <>
              {authContext.entity.role === Verbs.entityTypeUser && (
                <>
                  <TCTitleWithArrow
                    title={strings.eventHometitle}
                    showArrow={true}
                    viewStyle={{marginTop: 20, marginBottom: 10}}
                    isDisabled={!(items?.data?.length > 0)}
                    onPress={() =>
                      navigation.navigate('Schedule', {
                        screen: 'CreateEventScreen',
                        params: {
                          comeName: 'HomeScreen',
                        },
                      })
                    }
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    scrollEnabled={items.data?.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <EventsCard
                        data={item}
                        owners={owners}
                        allUserData={allUserData}
                        onItemPress={() => {
                          if (item?.game_id) {
                            if (item?.game?.sport) {
                              const gameHome = getGameHomeScreen(
                                item.game.sport.replace(' ', '_'),
                              );

                              navigation.navigate(gameHome, {
                                gameId: item?.game_id,
                              });
                            }
                          } else {
                            navigation.navigate('EventScreen', {
                              data: item,
                              gameData: item,
                            });
                          }
                        }}
                      />
                    )}
                    ListFooterComponent={() => <View style={{width: 15}} />}
                    ListEmptyComponent={() => (
                      <PlayersCardPlaceHolder
                        forevent={true}
                        data={dummyEventdata}
                        placeholdertext={'No Events'}
                      />
                    )}
                  />
                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              )}
            </>
          );

        case strings.teamAvailableforChallenge:
          return (
            <>
              {((authContext.entity.role === Verbs.entityTypeTeam &&
                selectedSport === strings.all) ||
                (authContext.entity.role === Verbs.entityTypeTeam &&
                  sportType !== Verbs.singleSport)) && (
                <>
                  <TCTitleWithArrow
                    title={strings.teamAvailableforChallenge}
                    showArrow={true}
                    isDisabled={!(items.data.length > 0)}
                    onPress={() => onTitlePress(item)}
                    viewStyle={{marginTop: 20, marginBottom: 15}}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TeamCard
                        item={item}
                        onPress={() => onCardPress(items, item)}
                      />
                    )}
                    ListFooterComponent={() => <View style={{width: 15}} />}
                    ListEmptyComponent={() => (
                      <>
                        {cardLoader ? (
                          <PlayerShimmerCard data={dummyPlayerData} />
                        ) : (
                          <PlayersCardPlaceHolder
                            data={dummyTeamData}
                            forTeams={true}
                            placeholdertext={strings.noTeams}
                          />
                        )}
                      </>
                    )}
                  />
                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              )}
            </>
          );

        case strings.playersAvailableforChallenge:
          return (
            <>
              {((authContext.entity.role === Verbs.entityTypeUser &&
                selectedSport === strings.all) ||
                (authContext.entity.role === Verbs.entityTypeUser &&
                  sportType === Verbs.singleSport)) && (
                <>
                  <TCTitleWithArrow
                    title={strings.playersAvailableforChallenge}
                    showArrow={true}
                    viewStyle={{marginTop: 20, marginBottom: 15}}
                    isDisabled={!(items.data.length > 0)}
                    onPress={() => onTitlePress(item)}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <PlayersCard
                        selectedSport={selectedSport}
                        sportType={sportType}
                        item={item}
                        hiring={true}
                        onPress={() => onCardPress(items, item)}
                      />
                    )}
                    ListFooterComponent={() => <View style={{width: 15}} />}
                    ListEmptyComponent={() => (
                      <>
                        {cardLoader ? (
                          <PlayerShimmerCard data={dummyPlayerData} />
                        ) : (
                          <PlayersCardPlaceHolder
                            data={dummyPlayerData}
                            placeholdertext={
                              strings.lookingTeamsPlaceholderText
                            }
                          />
                        )}
                      </>
                    )}
                  />
                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              )}
            </>
          );

        case strings.refreesAvailable:
          return (
            <>
              <TCTitleWithArrow
                title={strings.refreesAvailable}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                isDisabled={!(items.data.length > 0)}
                onPress={() => onTitlePress(item)}
              />
              <FlatList
                data={items.data}
                horizontal={true}
                contentContainerStyle={{paddingVertical: 6}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <PlayersCard
                    selectedSport={selectedSport}
                    sportType={sportType}
                    item={item}
                    onPress={() => onCardPress(items, item)}
                    refree={true}
                  />
                )}
                ListFooterComponent={() => <View style={{width: 15}} />}
                ListEmptyComponent={() => (
                  <>
                    {cardLoader ? (
                      <PlayerShimmerCard data={dummyPlayerData} />
                    ) : (
                      <PlayersCardPlaceHolder
                        data={dummyPlayerData}
                        placeholdertext={strings.refereesPlaceholderText}
                      />
                    )}
                  </>
                )}
              />
              <TCThinDivider
                height={7}
                backgroundColor={colors.grayBackgroundColor}
                width={'100%'}
                marginTop={25}
              />
            </>
          );

        case strings.scorekeepersAvailable:
          return (
            <>
              <TCTitleWithArrow
                title={strings.scorekeepersAvailable}
                showArrow={true}
                viewStyle={{marginTop: 20, marginBottom: 15}}
                isDisabled={!(items.data.length > 0)}
                onPress={() => onTitlePress(item)}
              />
              <FlatList
                data={items.data}
                scrollEnabled={items.data.length > 0}
                horizontal={true}
                contentContainerStyle={{paddingVertical: 6}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <PlayersCard
                    selectedSport={selectedSport}
                    sportType={sportType}
                    item={item}
                    onPress={() => onCardPress(items, item)}
                    scoreKeeper={true}
                  />
                )}
                ListFooterComponent={() => <View style={{width: 15}} />}
                ListEmptyComponent={() => (
                  <>
                    {cardLoader ? (
                      <PlayerShimmerCard data={dummyPlayerData} />
                    ) : (
                      <PlayersCardPlaceHolder
                        data={dummyPlayerData}
                        placeholdertext={strings.scorekeepersPlaceholderText}
                      />
                    )}
                  </>
                )}
              />
              <TCThinDivider
                height={7}
                backgroundColor={colors.grayBackgroundColor}
                width={'100%'}
                marginTop={25}
              />
            </>
          );

        case strings.hiringPlayerTitle:
          return (
            <>
              {authContext.entity.role === Verbs.entityTypeUser && (
                <>
                  <TCTitleWithArrow
                    title={strings.hiringPlayerTitle}
                    showArrow={true}
                    isDisabled={!(items.data.length > 0)}
                    viewStyle={{
                      marginTop: 20,
                      marginBottom: 15,
                    }}
                    onPress={() => onTitlePress(item)}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{
                      paddingVertical: 6,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TeamCard
                        item={item}
                        onPress={() => onCardPress(items, item)}
                      />
                    )}
                    ListFooterComponent={() => <View style={{width: 15}} />}
                    ListEmptyComponent={() => (
                      <>
                        {cardLoader ? (
                          <PlayerShimmerCard data={dummyPlayerData} />
                        ) : (
                          <PlayersCardPlaceHolder
                            data={dummyPlayerData}
                            placeholdertext={strings.noMembers}
                          />
                        )}
                      </>
                    )}
                  />
                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              )}
            </>
          );
        case strings.lookingForTeamTitle:
          return (
            <>
              {(authContext.entity.role === Verbs.entityTypeTeam ||
                authContext.entity.role === Verbs.entityTypeClub) && (
                <>
                  <TCTitleWithArrow
                    title={strings.lookingForTeamTitle}
                    showArrow={true}
                    isDisabled={!(items.data.length > 0)}
                    onPress={() => onTitlePress(item)}
                    viewStyle={{marginTop: 20, marginBottom: 15}}
                  />

                  <FlatList
                    data={items.data}
                    scrollEnabled={items.data.length > 0}
                    horizontal={true}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <PlayersCard
                        selectedSport={selectedSport}
                        sportType={sportType}
                        item={item}
                        onPress={() => onCardPress(items, item)}
                      />
                    )}
                    ListFooterComponent={() => <View style={{width: 15}} />}
                    ListEmptyComponent={() => (
                      <>
                        {cardLoader ? (
                          <PlayerShimmerCard data={dummyPlayerData} />
                        ) : (
                          <PlayersCardPlaceHolder
                            data={dummyPlayerData}
                            placeholdertext={strings.noTeamclub}
                          />
                        )}
                      </>
                    )}
                  />
                  <TCThinDivider
                    height={7}
                    backgroundColor={colors.grayBackgroundColor}
                    width={'100%'}
                    marginTop={25}
                  />
                </>
              )}
            </>
          );

        default:
          return null;
      }
    };

    return <View style={{flex: 1}}>{RenderMenuItem(item)}</View>;
  },
);

const styles = StyleSheet.create({
  titleTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 15,
    textTransform: 'uppercase',
  },
});

export default LocalHomeMenuItems;
