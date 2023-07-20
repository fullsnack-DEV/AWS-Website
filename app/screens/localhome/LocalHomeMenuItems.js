/* eslint-disable no-shadow */
import {
  View,
  FlatList,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import React, {useContext, memo, useState, useEffect} from 'react';
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
import {
  getSingleSportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';
import {getSportName, getStorage} from '../../utils';
import {getGameHomeScreen} from '../../utils/gameUtils';
import PlayersCardPlaceHolder from './PlayersCardPlaceHolder';
import TCThinDivider from '../../components/TCThinDivider';
import colors from '../../Constants/Colors';
import EventsCard from './EventsCard';
import fonts from '../../Constants/Fonts';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
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
    const [playerDetailPopup, setPlayerDetailPopup] = useState();
    const [playerDetail, setPlayerDetail] = useState();
    const [imageBaseUrl, setImageBaseUrl] = useState('');
    useEffect(() => {
      getStorage('appSetting').then((setting) => {
        setImageBaseUrl(setting.base_url_sporticon);
      });
    }, []);
    const sportsView = (item) => (
      <Pressable
        style={[
          styles.sportView,
          styles.row,
          {borderLeftColor: colors.redColorCard},
        ]}
        onPress={() => {
          setPlayerDetailPopup(false);
          navigation.navigate('SportActivityHome', {
            sport: item.sport,
            sportType: item?.sport_type,
            uid: playerDetail.user_id,
            entityType: playerDetail.entity_type,
            showPreview: true,
            backScreen: 'LocalHomeScreen',
          });
        }}
        disabled={item.is_hide}>
        <View style={styles.innerViewContainer}>
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Image
                // source={{uri: `${imageBaseUrl}${item.player_image}`}}
                source={{
                  uri: `${imageBaseUrl}${
                    getSportDetails(
                      item.sport,
                      item.sport_type,
                      authContext.sports,
                    ).sport_image
                  }`,
                }}
                style={styles.sportIcon}
              />
            </View>
            <View>
              <Text style={styles.sportName}>{item.sport_name}</Text>
              <Text style={styles.matchCount}>0 match</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );

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

        console.log('item  =>', item);
        console.log('card  =>', card);
        let sportsList = [];
        switch (card.key) {
          case strings.refreesAvailable:
            sportsList = item.referee_data ?? [];
            break;

          case strings.scorekeepersAvailable:
            sportsList = item.scorekeeper_data ?? [];
            break;

          case strings.lookingForTeamTitle:
            sportsList = item.registered_sports ?? [];
            break;
          default:
            console.log('Pressed');
        }
        if (sportsList.length > 1) {
          setPlayerDetailPopup(true);
          setPlayerDetail({
            user_id: uid,
            entity_type: role,
            sports: sportsList,
          });
        } else {
          navigation.navigate('HomeScreen', {
            uid,
            role,
            backButtonVisible: true,
            menuBtnVisible: false,
          });
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
          navigation.navigate('LookingForChallengeScreen', {
            filters: data,
            registerFavSports: getSingleSportList(sports),
          });
          break;

        case strings.refreesAvailable:
          navigateToRefreeScreen();
          break;

        case strings.scorekeepersAvailable:
          navigateToScoreKeeper();
          break;

        case strings.hiringPlayerTitle:
          navigation.navigate('RecruitingPlayerScreen', {
            filters: data,
          });
          break;

        case strings.completedMatches:
        case strings.upcomingMatchesTitle:
          // eslint-disable-next-line no-case-declarations
          const filters = {
            location,
            locationOption: selectedLocationOption,
            teamSportData: data.teamSportData,
          };

          if (authContext.entity.role === Verbs.entityTypeTeam) {
            navigation.navigate(
              item.key === strings.completedMatches
                ? 'RecentMatchScreen'
                : 'UpcomingMatchScreen',
              {
                filters,
                teamSportData: data.teamSportData,
              },
            );
          } else {
            navigation.navigate(
              item.key === strings.completedMatches
                ? 'RecentMatchScreen'
                : 'UpcomingMatchScreen',
              {
                filters: data,
              },
            );
          }
          break;

        case strings.teamAvailableforChallenge:
          navigation.navigate('LookingForChallengeScreen', {
            filters: data,
            teamSportData: data.teamSportData,
            registerFavSports: sports,
          });
          break;

        case strings.lookingForTeamTitle:
          navigation.navigate('LookingTeamScreen', {
            filters: data,
          });
          break;

        case strings.eventHometitle:
          Alert.alert('Pressed');
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
                        screen: 'EventScheduleScreen',
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

    return (
      <View style={{flex: 1}}>
        <View>{RenderMenuItem(item)}</View>
        <CustomModalWrapper
          isVisible={playerDetailPopup}
          closeModal={() => {
            setPlayerDetailPopup(false);
          }}
          modalType={ModalTypes.style2}>
          <View style={{paddingTop: 0, paddingHorizontal: 0}}>
            <FlatList
              data={playerDetail?.sports}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => sportsView(item, item.type, index)}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </CustomModalWrapper>
      </View>
    );
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
  sportView: {
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.lightGrayBackground,
    shadowColor: colors.googleColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 20,
    borderLeftWidth: 8,
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerViewContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  matchCount: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  sportIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});

export default LocalHomeMenuItems;
