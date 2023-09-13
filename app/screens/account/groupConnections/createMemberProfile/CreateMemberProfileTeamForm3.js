import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {format} from 'react-string-format';
import {createMemberProfile} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCFormProgress from '../../../../components/TCFormProgress';
import {showAlert} from '../../../../utils';
import ScreenHeader from '../../../../components/ScreenHeader';

let entity = {};
export default function CreateMemberProfileTeamForm3({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const [loading, setLoading] = useState(false);
  const [playerStatus, setPlayerStatus] = useState([]);
  const [joinTCCheck, setJoinTCCheck] = useState(true);

  const [groupMemberDetail, setGroupMemberDetail] = useState({
    is_player: true,
    is_coach: false,
    is_parent: false,
    is_others: false,
  });
  const [positions, setPositions] = useState([
    {
      id: 0,
      position: '',
    },
  ]);

  const addPosition = () => {
    const obj = {
      id: positions.length === 0 ? 0 : positions.length,
      code: '',
      number: '',
    };
    setPositions([...positions, obj]);
  };

  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setLoading(false);
        if (response.payload.user_id && response.payload.group_id) {
          const routeData = {
            memberID: response.payload.user_id,
            whoSeeID: response.payload.group_id,
            groupID: authContext.entity.uid,
          };

          if (route.params?.comeFrom === 'HomeScreen') {
            routeData.comeFrom = 'HomeScreen';
            routeData.routeParams = {...route.params?.routeParams};
            routeData.showBackArrow = true;
          }
          navigation.navigate('MembersProfileScreen', routeData);

          setTimeout(() => {
            showAlert(format(strings.profileCreated, authContext.entity.role));
          }, 10);
        }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          showAlert(e.message);
        }, 10);
      });
  };
  const createMember = () => {
    setLoading(true);
    let bodyParams = {is_invite: joinTCCheck};

    if (route.params.form2.full_image) {
      const imageArray = [];

      imageArray.push({path: route.params.form2.full_image});
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));

          bodyParams = {
            ...route.params.form2,
            ...groupMemberDetail,
            full_image: attachments[0].url,
            thumbnail: attachments[0].thumbnail,
          };

          createProfile(bodyParams);
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            showAlert(e.message);
          }, 10);
        });
    } else {
      bodyParams = {
        ...route.params.form2,
        ...groupMemberDetail,
      };

      createProfile(bodyParams);
    }
  };
  const renderPosition = ({item, index}) => (
    <TCTextField
      value={item.position}
      clearButtonMode="always"
      onChangeText={(text) => {
        const tempPosition = [...positions];
        tempPosition[index].position = text;
        setPositions(tempPosition);
        const filteredPosition = positions.filter(
          (obj) => ![null, undefined, ''].includes(obj),
        );
        setGroupMemberDetail({
          ...groupMemberDetail,
          positions: filteredPosition.map((e) => e.position),
        });
      }}
      placeholder={strings.positionPlaceholder}
      keyboardType={'default'}
      style={{marginBottom: 10}}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.createMemberProfileText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        onRightButtonPress={() => createMember()}
        isRightIconText
        rightButtonText={strings.next}
      />

      <TCFormProgress totalSteps={2} curruentStep={2} />
      <TCKeyboardView>
        <ActivityLoader visible={loading} />
        <TCLable title={strings.roles.toUpperCase()} />
        <View style={styles.mainCheckBoxContainer}>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.player}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_player: !groupMemberDetail.is_player,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_player
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.coach}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_coach: !groupMemberDetail.is_coach,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_coach
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.parent}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_parent: !groupMemberDetail.is_parent,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_parent
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>{strings.othersText}</Text>
            <TouchableOpacity
              onPress={() => {
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  is_others: !groupMemberDetail.is_others,
                });
              }}>
              <Image
                source={
                  groupMemberDetail.is_others
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TCLable title={strings.positionPlaceholder.toUpperCase()} />
          <FlatList
            data={positions}
            renderItem={renderPosition}
            keyExtractor={(item, index) => index.toString()}
            style={{marginTop: 10}}></FlatList>
        </View>
        {positions.length < 5 && (
          <TCMessageButton
            title={strings.addPosition}
            width={120}
            alignSelf="center"
            marginTop={15}
            onPress={() => addPosition()}
            borderColor={colors.whiteColor}
            color={colors.lightBlackColor}
            elevation={0}
            backgroundColor={colors.lightGrey}
            styletext={{
              fontFamily: fonts.RBold,
            }}
          />
        )}
        <View>
          <TCLable
            title={strings.jerseyNumberPlaceholder.toUpperCase()}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={groupMemberDetail.jersey_number}
            onChangeText={(text) =>
              setGroupMemberDetail({...groupMemberDetail, jersey_number: text})
            }
            placeholder={strings.jerseyNumberPlaceholder}
            keyboardType={'number-pad'}
          />
        </View>

        <TCLable title={strings.status.toUpperCase()} />
        <View style={styles.mainCheckBoxContainer}>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.injuredPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (playerStatus.indexOf(strings.injuredPlaceholder) !== -1) {
                  playerStatus.splice(
                    playerStatus.indexOf(strings.injuredPlaceholder),
                    1,
                  );
                } else {
                  playerStatus.push(strings.injuredPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.indexOf(strings.injuredPlaceholder) !== -1
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.longTermAwayPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (
                  playerStatus.indexOf(strings.longTermAwayPlaceholder) !== -1
                ) {
                  playerStatus.splice(
                    playerStatus.indexOf(strings.longTermAwayPlaceholder),
                    1,
                  );
                } else {
                  playerStatus.push(strings.longTermAwayPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.some(
                    (el) => el === strings.longTermAwayPlaceholder,
                  )
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.checkBoxContainer}>
            <Text style={styles.checkBoxItemText}>
              {strings.suspendedPlaceholder}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (playerStatus.indexOf(strings.suspendedPlaceholder) !== -1) {
                  playerStatus.splice(
                    playerStatus.indexOf(strings.suspendedPlaceholder),
                    1,
                  );
                } else {
                  playerStatus.push(strings.suspendedPlaceholder);
                }
                setPlayerStatus(playerStatus);
                setGroupMemberDetail({
                  ...groupMemberDetail,
                  status: playerStatus,
                });
              }}>
              <Image
                source={
                  playerStatus.some((el) => el === strings.suspendedPlaceholder)
                    ? images.orangeCheckBox
                    : images.uncheckWhite
                }
                style={{height: 22, width: 22, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TCLable
            title={strings.writeNotesPlaceholder.toUpperCase()}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={groupMemberDetail.note}
            height={100}
            multiline={true}
            onChangeText={(text) =>
              setGroupMemberDetail({...groupMemberDetail, note: text})
            }
            placeholder={strings.notesPlaceholder}
            keyboardType={'default'}
          />
        </View>

        <View style={{flexDirection: 'row', margin: 15}}>
          <TouchableOpacity
            onPress={() => {
              setJoinTCCheck(!joinTCCheck);
            }}>
            <Image
              source={
                // item.join_membership_acceptedadmin === false
                joinTCCheck ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>
            {strings.sentEmailInvitation}
          </Text>
        </View>
        <View style={{marginBottom: 30}} />
      </TCKeyboardView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 25,
    marginBottom: 10,
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 15,
  },

  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
