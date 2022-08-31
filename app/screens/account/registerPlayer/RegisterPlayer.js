import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import TCFormProgress from '../../../components/TCFormProgress';
import TCGradientButton from '../../../components/TCGradientButton';
import {getHitSlop, getSportName} from '../../../utils';

export default function RegisterPlayer({navigation}) {
  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();

  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    let sportArr = [];

    console.log('authContext.sports', authContext.sports);
    authContext.sports.map((item) => {
      const sportData = item.format.map((obj) => ({
        ...obj,
        player_image: item.player_image,
      }));
      sportArr = [...sportArr, ...sportData];
      console.log('sportArrsportArr', sportArr);
      return null;
    });
    setSportsData([...sportArr]);
  }, [authContext.sports]);

  const renderSports = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        console.log('selected sport:=>', item);
        setTimeout(() => {
          setVisibleSportsModal(false);
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport &&
          sportsSelection?.sport_type === item?.sport_type ? (
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

  const nextOnPress = () => {
    console.log('authContext?.entity?.obj', authContext?.entity?.obj);
    if (sportsSelection.sport !== '') {
      if (
        authContext?.entity?.obj?.registered_sports?.some(
          (e) =>
            e.sport === sportsSelection.sport &&
            e.sport_type === sportsSelection.sport_type &&
            e.is_published,
        )
      ) {
        Alert.alert(strings.alertmessagetitle, strings.sportAlreadyRegisterd);
      } else {
        const bodyParams = {};
        bodyParams.sport_type = sportsSelection.sport_type;
        bodyParams.sport = sportsSelection.sport;
        bodyParams.sport_name = sportsSelection.sport_name;
        bodyParams.player_image = sportsSelection.player_image;
        bodyParams.is_active = true;
        console.log('body params for register player', bodyParams);
        navigation.navigate('RegisterPlayerForm2', {
          bodyParams,
        });
      }
    }
  };
  return (
    <View style={{flex: 1}}>
      <TCFormProgress totalSteps={2} curruentStep={1} />
      <Text style={styles.LocationText}>{strings.sportsText}</Text>
      <TouchableOpacity
        testID="choose-sport"
        onPress={() => setVisibleSportsModal(true)}>
        <View style={styles.searchView}>
          <TextInput
            style={styles.searchTextField}
            placeholder={strings.selectSportPlaceholderPlayer}
            value={getSportName(sportsSelection, authContext)}
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>
      <View style={{flex: 1}} />
      <Modal
        isVisible={visibleSportsModal}
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
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
            shadowOffset: {width: 0, height: 1},
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
              hitSlop={getHitSlop(15)}
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
      <TCGradientButton
        isDisabled={!sportsSelection}
        title={strings.nextTitle}
        style={{marginBottom: 30}}
        onPress={nextOnPress}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  LocationText: {
    marginTop: hp('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
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
    shadowOffset: {width: 0, height: 1},
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
