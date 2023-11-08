import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext, useState, useEffect, useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import TCThinDivider from '../../components/TCThinDivider';
import {UserActionTiles, tilesArray} from '../../utils/constant';

function TopTileSection({
  handleTileClick,
  onRegisterAsTilePress,
  setClubModalVisible,
  setJoinTeamModalvisible,
  setTeamModal,
  isdeactivated = false,
  setClubModal,
}) {
  const authContext = useContext(AuthContext);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const updateWidth = () => {
    setScreenWidth(Dimensions.get('window').width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => {
      subscription.remove();
    };
  }, []);

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
        setJoinTeamModalvisible();
        break;
      case Verbs.JOIN_CLUB:
        setClubModalVisible();
        break;
      case Verbs.JOIN_LEAGUE:
        console.log('join league');
        break;

      default:
        onRegisterAsTilePress(i);
    }
  };

  const renderTileImage = useCallback(
    (icon) => (
      <FastImage source={icon} style={styles.tileImage} resizeMode="contain" />
    ),
    [],
  );

  const RenderTiles = ({item, index}) => {
    const {icon} = item;
    return (
      <TouchableOpacity
        disabled={isdeactivated}
        key={index}
        onPress={() => handleTileClick(item)}
        style={{}}>
        <View
          key={index}
          style={[
            styles.tileView,
            {
              marginBottom: 12,
              width: screenWidth >= 430 ? 88 : 75,
            },
          ]}>
          {renderTileImage(icon)}
        </View>

        <View style={styles.tiletitleContainer}>
          <Text style={styles.tiletitleText}>
            {item.title === strings.createEventhomeTitle &&
            authContext.entity.role !== Verbs.entityTypeClub
              ? strings.eventHomeTile
              : item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTileImageClub = useCallback(
    (item) => (
      <FastImage
        source={item.icon}
        style={styles.clubTileImg}
        resizeMode="contain"
      />
    ),
    [],
  );

  const RenderTileClub = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        handleTileClick(item);
      }}
      disabled={isdeactivated}>
      <View
        key={index}
        style={[styles.clubTileView, {width: screenWidth >= 430 ? 123 : 105}]}>
        {renderTileImageClub(item)}
      </View>
      <Text style={styles.clubTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderHorizontalTileImage = useCallback(
    (i) => (
      <FastImage
        source={i.icon}
        style={styles.miniCardImg}
        resizeMode="contain"
      />
    ),
    [],
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
              <TouchableOpacity
                disabled={isdeactivated}
                key={i.index.toString()}
                style={styles.miniCards}
                onPress={() => onTilePress(i)}>
                {renderHorizontalTileImage(i)}
                <Text style={styles.miniCardName}>{i.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const RenderInviteMemberbutton = () => (
    <TouchableOpacity
      disabled={isdeactivated}
      onPress={() =>
        handleTileClick({
          title: strings.inviteMemberClub,
        })
      }
      style={styles.memberInviteButton}>
      <Image
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
      <TouchableOpacity
        style={[
          styles.tilesContainer,
          {
            width:
              authContext.entity.role === Verbs.entityTypeClub
                ? Dimensions.get('window').width - 60 / 3
                : Dimensions.get('window').width - 50 / 3,
          },
        ]}
        disabled={isdeactivated}>
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
      </TouchableOpacity>
      {/* horizontal tile view */}

      {renderhorizontalTileContent()}
      <TCThinDivider
        marginTop={authContext.entity.role === Verbs.entityTypeClub ? -5 : 20}
        width={'100%'}
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
    marginBottom: 20,
  },
  tileView: {
    height: 75,
    width: 75,
    backgroundColor: '#FFF7EE',
    marginHorizontal: 10,
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
    minWidth: 80,
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

export default React.memo(TopTileSection);
