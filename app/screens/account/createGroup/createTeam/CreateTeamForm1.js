import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  FlatList,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';

import Modal from 'react-native-modal';

import TCGradientButton from '../../../../components/TCGradientButton';
import { getUserDoubleTeamFollower } from '../../../../api/Users';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';

import TCFormProgress from '../../../../components/TCFormProgress';

import TCThinDivider from '../../../../components/TCThinDivider';
import { getGroupIndex } from '../../../../api/elasticSearch';

export default function CreateTeamForm1({ navigation, route }) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);

  const [sports, setSports] = useState('');
  const [sportsData, setSportsData] = useState([]);

  const [followersData, setFollowersData] = useState();

  const [parentGroupID, setParentGroupID] = useState();

  const [teamName, setTeamName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (isFocused) {
      getSports();

      if (route.params && route.params.clubObject) {
        setParentGroupID(route.params.clubObject.group_id);
      }
      if (route.params && route.params.city) {
        setCity(route.params.city);
        setState(route.params.state);
        setCountry(route.params.country);
        setLocation(
          `${route.params.city}, ${route.params.state}, ${route.params.country}`,
        );
      } else {
        setCity('');
        setState('');
        setCountry('');
        setLocation('');
      }
    }
  }, [isFocused]);

  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        setTimeout(() => {
          setSports(item?.sport_name);
          setVisibleSportsModal(false);
          if (
            item?.sport === 'tennis' && item?.sport_type === 'double'
            && authContext?.entity?.role === ('user' || 'player')
          ) {
            getUserDoubleTeamFollower(item?.sport, item?.sport_type, authContext)
              .then((res) => {
                setFollowersData(res?.payload);
              })
              .catch((e) => {
                Alert.alert(strings.alertmessagetitle, e.message);
              });
          }
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.sport_name}</Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      const filterFormat = item.format.filter((obj) => obj.entity_type === 'team')
      sportArr = [...sportArr, ...filterFormat];
      return null;
    });
    setSportsData([...sportArr]);
  };

  const nextOnPress = () => {
    const query = {
      _source: ['group_id'],
      query: {
        bool: {
          must: [
            {
              term: {
                'group_name.keyword': {
                  value: teamName,
                  case_insensitive: true,
                },
              },
            },
            { term: { entity_type: 'team' } },
            {
              term: {
                'city.keyword': {
                  value: city,
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      },
    };

    getGroupIndex(query).then((teams) => {
      console.log('hiringPlayers::=>', teams);
      if (teams.length === 0) {
        const obj = {
          sport: sportsSelection.sport,
          sport_type: sportsSelection.sport_type,
          group_name: teamName,
          city,
          state_abbr: state,
          country,
          currency_type: authContext?.entity?.obj?.currency_type,
        };
        if (parentGroupID) {
          obj.parent_group_id = parentGroupID;
        }
        console.log('Form1 Object:=>', obj);

        if (
          sportsSelection.sport === 'tennis' && sportsSelection.sport_type === 'double'
          && authContext?.entity?.role === ('user' || 'player')
        ) {
          if (followersData?.length > 0) {
            navigation.navigate('CreateTeamForm2', {
              followersList: followersData,
              createTeamForm1: {
                ...obj,
              },
            });
          } else {
            Alert.alert(strings.noFollowersTocreateTeam);
          }
        } else {
          navigation.navigate('CreateTeamForm2', {
            createTeamForm1: {
              ...obj,
            },
          });
        }
      } else {
        Alert.alert(strings.teamExist);
      }
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={1} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <View>
          <TCLabel title={strings.SportsTextFieldTitle} required={false} />
          <TouchableOpacity onPress={() => setVisibleSportsModal(true)}>
            <View style={styles.searchView}>
              <TextInput
                style={styles.searchTextField}
                placeholder={strings.selectSportPlaceholder}
                value={sports}
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldView}>
          <TCLabel title={strings.teamNameTitle} required={false} />
          <TextInput
            placeholder={strings.teamNamePlaceholder}
            style={styles.matchFeeTxt}
            onChangeText={(text) => setTeamName(text)}
            value={teamName}></TextInput>
        </View>
        <View style={styles.fieldView}>
          <TCLabel title={strings.locationTitle} required={false} />
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchLocationScreen', {
                comeFrom: 'CreateTeamForm1',
              })
            }>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={[styles.matchFeeTxt, { marginBottom: 5 }]}
              value={location}
              editable={false}
              pointerEvents="none"></TextInput>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
      </ScrollView>
      <SafeAreaView>
        <TCGradientButton
          isDisabled={sports === '' || teamName === '' || location === ''}
          title={strings.nextTitle}
          style={{ marginBottom: 5 }}
          onPress={nextOnPress}
        />
      </SafeAreaView>
      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    marginTop: 15,
  },

  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mainContainer: {
    flex: 1,
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {},
});
