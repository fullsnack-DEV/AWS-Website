import React, {useContext, useState, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';
import {
  getEntitySportList,
  getSportDetails,
} from '../../utils/sportsActivityUtils';

const Options = [
  strings.playingTitleText,
  strings.refereeingTitleText,
  strings.scorekeepingTitleText,
];

export default function SportActivityScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [userObject] = useState(authContext.entity.obj);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getEntityType = (option) => {
    switch (option) {
      case strings.playingTitleText:
        return Verbs.entityTypePlayer;

      case strings.refereeingTitleText:
        return Verbs.entityTypeReferee;

      case strings.scorekeepingTitleText:
        return Verbs.entityTypeScorekeeper;

      default:
        return Verbs.entityTypePlayer;
    }
  };

  const renderSports = (item = {}, entityType = Verbs.entityTypePlayer) => {
    const sport = getSportDetails(
      item.sport,
      item.sport_type,
      authContext.sports,
      entityType,
    );
    return (
      <>
        <Pressable
          style={styles.listContainer}
          onPress={() => {
            navigation.navigate('SportAccountSettingScreen', {
              type: entityType,
              sport: item,
              isFromSettings: true,
            });
          }}>
          <View>
            <Text style={styles.label}>{sport.sport_name}</Text>
          </View>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </Pressable>
        <View style={styles.separator} />
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.sportActivity}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (route.params?.parentStack) {
            navigation.navigate(route.params?.parentStack, {
              screen: route.params.screen,
            });
          } else {
            navigation.goBack();
          }
        }}
        containerStyle={styles.headerRow}
      />

      <View style={{paddingTop: 25, flex: 1}}>
        <FlatList
          data={Options}
          keyExtractor={(item) => item}
          renderItem={({item}) => {
            const list = getEntitySportList(
              userObject,
              getEntityType(item),
            ).filter(
              (obj) =>
                obj.sport && (obj.is_active === true || !('is_active' in obj)),
            );
            if (list.length === 0) return null;
            return (
              <View style={{marginBottom: 35}}>
                <Text style={styles.title}>{item.toUpperCase()}</Text>
                {list
                  .sort((a, b) => a.sport.localeCompare(b.sport))
                  .map((ele) => renderSports(ele, getEntityType(item)))}
              </View>
            );
          }}
          ListFooterComponent={() => (
            <Pressable
              style={[styles.listContainer, {marginBottom: 20}]}
              onPress={() => {
                navigation.navigate('DeactivatedSportsListScreen');
              }}>
              <View>
                <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
                  {strings.deactivatedSportsActivities.toUpperCase()}
                </Text>
              </View>
              <Image source={images.nextArrow} style={styles.nextArrow} />
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 25,
    marginBottom: 35,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  nextArrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
