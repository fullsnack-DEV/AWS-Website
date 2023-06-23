import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useCallback, useContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import SportsListModal from '../account/registerPlayer/modals/SportsListModal';
import MemberListModal from '../../components/MemberListModal/MemberListModal';
import {getTeamSportOnlyList} from './LocalHomeUtils';
import {getUserIndex} from '../../api/elasticSearch';
import TCThinDivider from '../../components/TCThinDivider';
import {UserActionTiles, tilesArray} from '../../utils/constant';

export default function TopTileSection({
  handleTileClick,
  onRegisterAsTilePress,
  visibleSportsModalForTeam,
  visibleSportsModalForClub,
  setTeamModal,
  setClubModal,
}) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const updateWidth = () => {
    setScreenWidth(Dimensions.get('window').width);
  };
  const [doubleSport, setDoubleSport] = useState();
  const [memberListModal, setMemberListModal] = useState();
  const [loading, setloading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [teamSport, setTeamSport] = useState([]);

  const getUsers = useCallback(() => {
    const generalsQuery = {
      size: 100,
      query: {bool: {must: [{bool: {should: []}}]}},
    };

    getUserIndex(generalsQuery)
      .then((response) => {
        setloading(false);
        if (response.length > 0) {
          const result = response.map((obj) => {
            const newObj = {
              ...obj,
              isChecked: false,
            };
            return newObj;
          });

          const filteredResult = result.filter(
            (e) => e.user_id !== authContext.entity.auth.user.user_id,
          );
          setPlayers([...filteredResult]);
        }
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(error.message);
      });
  }, [authContext]);

  useEffect(() => {
    const TeamSportList = getTeamSportOnlyList(
      authContext,
      Verbs.entityTypeTeam,
    );
    setTeamSport(TeamSportList);

    getUsers();
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => {
      subscription.remove();
      setTeamSport([]);
    };
  }, [screenWidth, getUsers, authContext]);

  const setMemberListModalHandler = () => {
    setMemberListModal(true);
  };

  const setdoubleSportHandler = (sport) => {
    setDoubleSport(sport);
  };

  const onTilePress = (i) => {
    switch (i.action) {
      case Verbs.CREATE_CLUB:
        setClubModal(true);
        break;
      case Verbs.CREATE_TEAM:
        setTeamModal(true);
        break;
      case Verbs.CREATE_LEAGUE:
        console.log('Create League');
        break;

      case Verbs.JOIN_TEAM:
        console.log('join team');
        break;
      case Verbs.JOIN_CLUB:
        console.log('join club');
        break;
      case Verbs.JOIN_LEAGUE:
        console.log('join league');
        break;

      default:
        onRegisterAsTilePress(i);
    }
  };

  const RenderTiles = ({item, index}) => (
    <Pressable key={index} onPress={() => handleTileClick(item)} style={{}}>
      <View
        key={index}
        style={[
          styles.tileView,
          {
            marginBottom: 12,
            width: screenWidth >= 430 ? 88 : 75,
          },
        ]}>
        <FastImage
          source={item.icon}
          style={styles.tileImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.tiletitleContainer}>
        <Text style={styles.tiletitleText}>
          {item.title === strings.createEventhomeTitle &&
          authContext.entity.role !== Verbs.entityTypeTeam
            ? strings.eventHomeTile
            : item.title}
        </Text>
      </View>
    </Pressable>
  );

  const RenderTileClub = ({item, index}) => (
    <Pressable
      key={index}
      onPress={() => {
        handleTileClick(item);
      }}>
      <View
        key={index}
        style={[styles.clubTileView, {width: screenWidth >= 430 ? 123 : 105}]}>
        <FastImage
          source={item.icon}
          style={styles.clubTileImg}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.clubTitle}>{item.title}</Text>
    </Pressable>
  );

  const RenderHorizontalTileView = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {UserActionTiles.map((item) => (
        <View key={item.index.toString()} style={styles.cardsContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.registerAsText}>{item.title}</Text>
          </View>

          {/* Blocks */}

          <View style={styles.miniCardContainer}>
            {item.createData.map((i) => (
              <Pressable
                key={i.index.toString()}
                style={styles.miniCards}
                onPress={() => onTilePress(i)}>
                <FastImage
                  source={i.icon}
                  style={styles.miniCardImg}
                  resizeMode="contain"
                />
                <Text style={styles.miniCardName}>{i.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const RenderInviteMemberbutton = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('InviteMembersBySearchScreen')}
      style={styles.memberInviteButton}>
      <FastImage
        source={images.invitememberbuttonicon}
        style={styles.memberInviteIcon}
      />
      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.RRegular,
        }}>
        {strings.inviteMemberText}
      </Text>
    </TouchableOpacity>
  );

  const renderhorizontalTileContent = () => {
    if (authContext.entity.role === Verbs.entityTypeClub) {
      return null;
    }
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      return RenderInviteMemberbutton();
    }

    return RenderHorizontalTileView();
  };

  return (
    <View>
      <Pressable style={styles.tilesContainer}>
        {authContext.entity.role === Verbs.entityTypeClub ? (
          <>
            {tilesArray.clubSection.map((item, index) => (
              <RenderTileClub key={index} item={item} index={index} />
            ))}
          </>
        ) : (
          <>
            {tilesArray.PersonalTeamSection.map((item, index) => (
              <RenderTiles key={index} item={item} index={index} />
            ))}
          </>
        )}
      </Pressable>
      {/* horizontal tile view */}

      {renderhorizontalTileContent()}
      <TCThinDivider
        marginTop={authContext.entity.role === Verbs.entityTypeClub ? -5 : 20}
        width={'100%'}
      />

      {/* club Modal */}

      <SportListMultiModal
        isVisible={visibleSportsModalForClub}
        closeList={() => setClubModal(false)}
        title={strings.createClubText}
        onNext={(sports) => {
          setClubModal(false);
          navigation.navigate('Account', {
            screen: 'CreateClubForm1',
            params: sports,
          });
        }}
      />

      {/* Team Modal */}
      <MemberListModal
        isVisible={memberListModal}
        title={strings.createTeamText}
        loading={loading}
        closeList={() => setMemberListModal(false)}
        doubleSport={doubleSport}
        sportsList={players}
      />

      <SportsListModal
        isVisible={visibleSportsModalForTeam}
        closeList={() => {
          setTeamModal(false);
        }}
        title={strings.createTeamText}
        sportsList={teamSport}
        forTeam={true}
        authContext={authContext}
        setMemberListModalHandler={setMemberListModalHandler}
        setdoubleSportHandler={setdoubleSportHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tilesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: Dimensions.get('window').width - 60 / 3,
    marginBottom: 20,
  },
  tileView: {
    height: 75,
    width: 75,
    backgroundColor: '#FFF7EE',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  tileImage: {
    width: 56,
    height: 50,
  },
  clubTileView: {
    width: 123,
    height: 55,
    justifyContent: 'center',
    backgroundColor: '#FFF7EE',
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  clubTileImg: {
    width: 34,
    height: 27,
    resizeMode: 'contain',
  },
  clubTitle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    lineHeight: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 12,
  },
  tiletitleContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 30,
    alignItems: 'center',
  },
  tiletitleText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    lineHeight: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cardsContainer: {
    width: 280,
    height: 88,
    backgroundColor: '#F8F8F8',
    marginLeft: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registerAsText: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    lineHeight: 16,
  },

  miniCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniCards: {
    width: 80,
    height: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  miniCardImg: {
    width: 30,
    height: 16,
    marginTop: 7,
  },
  miniCardName: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  memberInviteButton: {
    width: 345,
    height: 28,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  memberInviteIcon: {
    width: 10,
    height: 15,
    marginRight: 10,
  },
});
