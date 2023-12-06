/* eslint-disable no-shadow */
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

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
import fonts from '../../Constants/Fonts';

import PlayerShimmerCard from './PlayerShimmerCard';
import TCEventCard from '../../components/Schedule/TCEventCard';

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
    isdeactivated = false,
    isdeactivatedForRefree = false,
    isdeactivatedForScorekeeper = false,
    isdeactivateForLookingForTeamsAndClubs = false,
    cardLoader,
    openPlayerDetailsModal = () => {},
  }) => {
    const navigation = useNavigation();
    const authContext = useContext(AuthContext);

    const navigateAndSetDataForSportActivityView = (uid, role, sportsList) => {
      if (sportsList.length > 1 && selectedSport === strings.all) {
        openPlayerDetailsModal({
          user_id: uid,
          entity_type: role,
          sports: sportsList,
        });
      } else if (role === Verbs.entityTypePlayer) {
        if (selectedSport === strings.all) {
          navigation.navigate('HomeStack', {
            screen: 'SportActivityHome',
            params: {
              sport: sportsList[0]?.sport,
              sportType: sportsList[0]?.sport_type,
              uid,
              entityType: role,
              showPreview: true,
              parentStack: 'App',
              backScreen: 'LocalHome',
            },
          });
        } else {
          navigation.navigate('HomeStack', {
            screen: 'SportActivityHome',
            params: {
              sport: selectedSport,
              sportType,
              uid,
              entityType: role,
              showPreview: true,
              parentStack: 'App',
              backScreen: 'LocalHome',
            },
          });
        }
      } else {
        // get the sport if the length is grater than one

        const foundObj = sportsList.find((obj) => obj.sport === selectedSport);

        navigation.navigate('HomeStack', {
          screen: 'SportActivityHome',
          params: {
            sport: foundObj?.sport,
            sportType: foundObj?.sport_type,
            uid,
            entityType: role,
            showPreview: true,
            parentStack: 'App',
            backScreen: 'LocalHome',
          },
        });
      }
    };
    const navigateToHomeScreen = (uid, role) => {
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          uid,
          role,
          backButtonVisible: true,
          menuBtnVisible: false,
        },
      });
    };

    const onCardPress = (card, item) => {
      if (
        [strings.completedMatches, strings.upcomingMatchesTitle].includes(
          card.key,
        )
      ) {
        const sportName = getSportName(item, authContext);
        const routeName = getGameHomeScreen(sportName);
        if (routeName) {
          navigation.push(routeName, {gameId: item?.game_id});
        }
      } else {
        const uid = [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(
          item?.entity_type,
        )
          ? item?.user_id
          : item?.group_id;

        const role = [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(
          item?.entity_type,
        )
          ? Verbs.entityTypeUser
          : item?.entity_type;
        let sportsList = [];
        switch (card.key) {
          case strings.refreesAvailable:
            sportsList = item.referee_data ?? [];
            navigateAndSetDataForSportActivityView(
              uid,
              Verbs.entityTypeReferee,
              sportsList,
            );
            break;

          case strings.scorekeepersAvailable:
            sportsList = item.scorekeeper_data ?? [];
            navigateAndSetDataForSportActivityView(
              uid,
              Verbs.entityTypeScorekeeper,
              sportsList,
            );
            break;
          case strings.playersAvailableforChallenge:
            sportsList = item.registered_sports ?? [];

            navigateAndSetDataForSportActivityView(
              uid,
              Verbs.entityTypePlayer,
              sportsList,
            );
            break;
          case strings.lookingForTeamTitle:
            sportsList = item.registered_sports ?? [];
            navigateAndSetDataForSportActivityView(uid, role, sportsList);
            break;
          case strings.hiringPlayerTitle:
            navigateToHomeScreen(uid, role);
            break;
          case strings.teamAvailableforChallenge:
            navigateToHomeScreen(uid, role);
            break;

          case strings.eventHometitle:
            navigation.navigate('ScheduleStack', {
              screen: 'EventScreen',
              params: {
                data: item,
                gameData: item,
                comeFrom: 'App',
                screen: 'LocalHome',
              },
            });
            break;

          default:
            break;
        }
      }
    };

    const onTitlePress = (item) => {
      const data = getDataForNextScreen(
        Verbs.SPORT_DATA,
        filter,
        location,
        selectedLocationOption,
        authContext,
      );

      switch (item.key) {
        case strings.playersAvailableforChallenge:
          navigation.navigate('LocalHomeStack', {
            screen: 'LookingForChallengeScreen',
            params: {
              filters: data,
              registerFavSports: getSingleSportList(sports),
            },
          });
          break;

        case strings.refreesAvailable:
          navigateToRefreeScreen();
          break;

        case strings.scorekeepersAvailable:
          navigateToScoreKeeper();
          break;

        case strings.hiringPlayerTitle:
          navigation.navigate('LocalHomeStack', {
            screen: 'RecruitingPlayerScreen',
            params: {
              filters: data,
            },
          });
          break;

        case strings.completedMatches:
        case strings.upcomingMatchesTitle:
          // eslint-disable-next-line no-case-declarations

          if (authContext.entity.role === Verbs.entityTypeTeam) {
            const teamData = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen:
                item.key === strings.completedMatches
                  ? 'RecentMatchScreen'
                  : 'UpcomingMatchScreen',
              params: {
                filters: teamData.filters,
                teamSportData: teamData.teamSportData,
              },
            });
          } else {
            navigation.navigate('LocalHomeStack', {
              screen:
                item.key === strings.completedMatches
                  ? 'RecentMatchScreen'
                  : 'UpcomingMatchScreen',
              params: {
                filters: data,
              },
            });
          }
          break;

        case strings.teamAvailableforChallenge:
          {
            const teamData = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen: 'LookingForChallengeScreen',
              params: {
                filters: teamData.filters,
                teamSportData: teamData.teamSportData,
                registerFavSports: sports,
                forTeams: true,
              },
            });
          }
          break;

        case strings.lookingForTeamTitle:
          if (authContext.entity.role === Verbs.entityTypeTeam) {
            const teamData = getDataForNextScreen(
              Verbs.TEAM_DATA,
              filter,
              location,
              selectedLocationOption,
              authContext,
            );
            navigation.navigate('LocalHomeStack', {
              screen: 'LookingTeamScreen',
              params: {
                filters: teamData.filters,
                teamSportData: teamData.teamSportData,
              },
            });
          } else {
            navigation.navigate('LocalHomeStack', {
              screen: 'LookingTeamScreen',
              params: {
                filters: data,
              },
            });
          }
          break;

        case strings.eventHometitle:
          navigation.navigate('LocalHomeStack', {
            screen: 'LocalHomEventScreen',
          });
          break;

        default:
          break;
      }
    };

    function expandUsersWithSports(users) {
      const expandedData = [];

      for (const user of users) {
        if (user.registered_sports && user.registered_sports.length > 0) {
          for (const sport of user.registered_sports) {
            if (
              sport.sport_type === Verbs.sportTypeSingle &&
              sport.setting.availibility === Verbs.on
            ) {
              const newUser = {...user};
              newUser.registered_sports = [sport];
              expandedData.push(newUser);
            }
          }
        } else {
          expandedData.push(user);
        }
      }

      return expandedData;
    }

    const getItemLayout = (data, index) => ({
      length: 149,
      offset: 149 * index,
      index,
    });

    const getItemLayoutForPlayerCard = (data, index) => ({
      length: 178,
      offset: 178 * index,
      index,
    });

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
                renderToHardwareTextureAndroid
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
                isDisabled={!(items.data.length > 0) || isdeactivated}
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
                      <View key={index}>
                        {section.data.map((item) => (
                          <View key={item.id} style={{marginRight: 10}}>
                            <HorizontalsCards
                              isdeactivated={isdeactivated}
                              item={item}
                              onPress={() => onCardPress(items, item)}
                            />
                          </View>
                        ))}
                      </View>
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
                isDisabled={!(items.data.length > 0) || isdeactivated}
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
                      <View key={index}>
                        {section.data.map((item) => (
                          <View key={item.id} style={{marginRight: 10}}>
                            <HorizontalsCards
                              isdeactivated={isdeactivated}
                              item={item}
                              onPress={() => onCardPress(items, item)}
                            />
                          </View>
                        ))}
                      </View>
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
              {(authContext.entity.role === Verbs.entityTypeUser ||
                authContext.entity.role === Verbs.entityTypePlayer) && (
                <>
                  <TCTitleWithArrow
                    title={strings.eventHometitle}
                    showArrow={true}
                    viewStyle={{marginTop: 20, marginBottom: 10}}
                    isDisabled={!(items?.data?.length > 0) || isdeactivated}
                    onPress={() => onTitlePress(item)}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    scrollEnabled={items.data?.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderToHardwareTextureAndroid
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    getItemLayout={getItemLayout}
                    renderItem={({item}) => (
                      <View style={{marginLeft: 15}}>
                        <TCEventCard
                          onPress={() => onCardPress(items, item)}
                          data={item}
                          profileID={authContext.entity.uid}
                          //   onThreeDotPress={() => onThreeDotPress(item)}
                          eventBetweenSection={item.game}
                          eventOfSection={
                            item.game &&
                            item.game.referees &&
                            item.game.referees.length > 0
                          }
                          entity={authContext.entity}
                          owners={owners}
                          allUserData={owners}
                          containerStyle={{marginBottom: 0, width: 305}}
                        />
                      </View>
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
              {
                <>
                  <TCTitleWithArrow
                    title={strings.teamAvailableforChallenge}
                    showArrow={true}
                    isDisabled={!(items.data.length > 0) || isdeactivated}
                    onPress={() => onTitlePress(item)}
                    viewStyle={{marginTop: 20, marginBottom: 15}}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    renderToHardwareTextureAndroid
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TeamCard
                        item={item}
                        onPress={() => onCardPress(items, item)}
                        isdeactivated={isdeactivated}
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
              }
            </>
          );

        case strings.playersAvailableforChallenge:
          // eslint-disable-next-line no-case-declarations
          const modifiedPlayers = expandUsersWithSports(items.data);

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
                    isDisabled={!(items.data.length > 0) || isdeactivated}
                    onPress={() => onTitlePress(item)}
                  />
                  <FlatList
                    data={
                      selectedSport === strings.allSport
                        ? modifiedPlayers
                        : items.data
                    }
                    extraData={
                      selectedSport === strings.allSport
                        ? modifiedPlayers
                        : items.data
                    }
                    horizontal={true}
                    renderToHardwareTextureAndroid
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    getItemLayout={getItemLayoutForPlayerCard}
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <PlayersCard
                        selectedSport={selectedSport}
                        sportType={sportType}
                        item={item}
                        playeravail={true}
                        onPress={() => onCardPress(items, item)}
                        isdeactivated={isdeactivated}
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
                isDisabled={
                  !(items?.data?.length > 0) ||
                  isdeactivated ||
                  isdeactivatedForRefree
                }
                onPress={() => onTitlePress(item)}
              />
              <FlatList
                data={items.data}
                horizontal={true}
                contentContainerStyle={{paddingVertical: 6}}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={10}
                renderToHardwareTextureAndroid
                maxToRenderPerBatch={10}
                style={{
                  opacity: isdeactivatedForRefree ? 0.5 : 1,
                }}
                getItemLayout={getItemLayoutForPlayerCard}
                renderItem={({item}) => (
                  <PlayersCard
                    selectedSport={selectedSport}
                    sportType={sportType}
                    item={item}
                    onPress={() => onCardPress(items, item)}
                    refree={true}
                    isdeactivated={isdeactivated || isdeactivatedForRefree}
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
                isDisabled={
                  !(items.data.length > 0) ||
                  isdeactivated ||
                  isdeactivatedForScorekeeper
                }
                onPress={() => onTitlePress(item)}
              />
              <FlatList
                data={items.data}
                scrollEnabled={items.data.length > 0}
                horizontal={true}
                renderToHardwareTextureAndroid
                contentContainerStyle={{paddingVertical: 6}}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={10}
                style={{
                  opacity: isdeactivatedForScorekeeper ? 0.5 : 1,
                }}
                maxToRenderPerBatch={10}
                getItemLayout={getItemLayoutForPlayerCard}
                renderItem={({item}) => (
                  <PlayersCard
                    selectedSport={selectedSport}
                    sportType={sportType}
                    item={item}
                    onPress={() => onCardPress(items, item)}
                    scoreKeeper={true}
                    isdeactivated={isdeactivated || isdeactivatedForScorekeeper}
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
                    isDisabled={!(items.data.length > 0) || isdeactivated}
                    viewStyle={{
                      marginTop: 20,
                      marginBottom: 15,
                    }}
                    onPress={() => onTitlePress(item)}
                  />
                  <FlatList
                    data={items.data}
                    horizontal={true}
                    renderToHardwareTextureAndroid
                    scrollEnabled={items.data.length > 0}
                    contentContainerStyle={{
                      paddingVertical: 6,
                    }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <TeamCard
                        item={item}
                        onPress={() => onCardPress(items, item)}
                        isdeactivated={isdeactivated}
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
              {
                <>
                  <TCTitleWithArrow
                    title={
                      sportType === Verbs.sportTypeSingle
                        ? strings.lookingForClubTitle
                        : strings.lookingForTeamTitle
                    }
                    showArrow={true}
                    isDisabled={
                      !(items.data.length > 0) ||
                      isdeactivated ||
                      isdeactivateForLookingForTeamsAndClubs
                    }
                    onPress={() => onTitlePress(item)}
                    viewStyle={{marginTop: 20, marginBottom: 15}}
                  />

                  <FlatList
                    data={items.data}
                    renderToHardwareTextureAndroid
                    scrollEnabled={items.data.length > 0}
                    horizontal={true}
                    contentContainerStyle={{paddingVertical: 6}}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={10}
                    style={{
                      opacity: isdeactivateForLookingForTeamsAndClubs ? 0.5 : 1,
                    }}
                    maxToRenderPerBatch={10}
                    getItemLayout={getItemLayoutForPlayerCard}
                    renderItem={({item}) => (
                      <PlayersCard
                        selectedSport={selectedSport}
                        sportType={sportType}
                        item={item}
                        onPress={() => onCardPress(items, item)}
                        lookingTeamClub={true}
                        isdeactivated={
                          isdeactivated ||
                          isdeactivateForLookingForTeamsAndClubs
                        }
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
              }
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

export default React.memo(LocalHomeMenuItems);
