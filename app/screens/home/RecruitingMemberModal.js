import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {format} from 'react-string-format';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {patchGroup} from '../../api/Groups';
import {setAuthContextData} from '../../utils';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

const hiringPlayersOptions = [
  {key: strings.yesDisplayItText, id: 1},
  {key: strings.noDisplayItText, id: 0},
];

export default function RecruitingMemberModal({visible, onClose}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [hiringPlayersSelection, setHiringPlayersSelection] = useState(
    authContext.entity.obj.hiringPlayers ?? 1,
  );

  const saveTeam = (selectionid) => {
    const bodyParams = {
      hiringPlayers: selectionid,
    };
    setloading(true);

    patchGroup(authContext.entity.uid, bodyParams, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await setAuthContextData(response.payload, authContext);
          onClose();
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getImage = () => {
    if (authContext.entity.obj.entity_type === Verbs.entityTypeClub) {
      return hiringPlayersSelection
        ? images.recruitingMemberClubYesImg
        : images.recruitingMemberClubNoImg;
    }
    return hiringPlayersSelection
      ? images.recruitingMemberYesImg
      : images.recruitingMemberNoImg;
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={onClose}
      modalType={ModalTypes.style4}
      title={strings.recruitingPlayerText}
      containerStyle={{padding: 0, flex: 1}}>
      <View style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        <Text style={styles.opetionsTitle}>
          {format(
            strings.isYourTeamRecruitingMember,
            authContext.entity.obj.entity_type === Verbs.entityTypeClub
              ? Verbs.entityTypeClub
              : Verbs.entityTypeTeam,
          )}
        </Text>
        <View style={styles.recruitingContainer}>
          <Text style={styles.recruitingContainerText}>
            {strings.recruitingPlayerText}
          </Text>
        </View>

        {hiringPlayersOptions.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => {
              setHiringPlayersSelection(item.id);
              saveTeam(item.id);
            }}
            style={styles.radioItem}>
            <View style={{flex: 1}}>
              <Text style={styles.labelText}>{item.key}</Text>
            </View>
            <View style={styles.checkbox}>
              {hiringPlayersSelection === item.id ? (
                <Image
                  source={images.radioCheckYellow}
                  style={styles.checkboxImg}
                />
              ) : (
                <Image
                  source={images.radioUnselect}
                  style={styles.checkboxImg}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 40,
            marginBottom: 70,
          }}>
          <View
            style={{
              width: 240,
              height: 230,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={getImage()}
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
        </View>
        <Text
          style={[
            styles.labelText,
            {paddingHorizontal: 15, paddingVertical: 6},
          ]}>
          {authContext.entity.obj.entity_type === Verbs.entityTypeClub
            ? strings.recruitingBottomClubText
            : strings.recruitingBottomText}
        </Text>
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  opetionsTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  recruitingContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: colors.themeColor,
    alignSelf: 'baseline',
    marginLeft: 15,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recruitingContainerText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
  },
});
