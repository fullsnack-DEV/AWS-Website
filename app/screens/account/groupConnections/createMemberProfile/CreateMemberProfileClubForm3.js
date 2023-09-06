import React, {useState, useLayoutEffect, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {format} from 'react-string-format';
import {createMemberProfile} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCLabel from '../../../../components/TCLabel';
import {showAlert} from '../../../../utils';

let entity = {};
export default function CreateMemberProfileClubForm3({navigation, route}) {
  const [note, setNote] = useState('');
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [joinTCCheck, setJoinTCCheck] = useState(true);
  const [groups, setGroups] = useState({
    createdAt: 0.0,
    homefield_address_latitude: 0.0,
    follower_count: 0,
    am_i_admin: false,
    homefield_address_longitude: 0.0,
    privacy_profile: 'members',
    allclubmembermannually_sync: true,
    member_count: 0,
    privacy_events: 'everyone',
    privacy_members: 'everyone',
    office_address_latitude: 0.0,
    office_address_longitude: 0.0,
    approval_required: false,
    is_following: false,
    should_hide: false,
    entity_type: '',
    privacy_followers: 'everyone',
    join_type: 'anyone',
    is_joined: false,
  });
  useEffect(() => {
    getAuthEntity();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>
          {strings.done}
        </Text>
      ),

      headerLeft: () => (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation, joinTCCheck]);

  const getAuthEntity = async () => {
    entity = authContext.entity;

    setGroups({...groups, entity_type: entity.role});
  };
  const createMember = () => {
    setloading(true);
    let bodyParams = {};
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
            full_image: attachments[0].url,
            thumbnail: attachments[0].thumbnail,
            group: groups,
            group_id: entity.uid,
            note,
          };

          createProfile(bodyParams);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            showAlert(e.message);
          }, 10);
        });
    } else {
      bodyParams = {
        ...route.params.form2,
        group: groups,
        group_id: entity.uid,
        note,
        is_invite: joinTCCheck,
      };

      createProfile(bodyParams);
    }
  };
  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setloading(false);

        if (response?.payload?.user_id && response?.payload?.group_id) {
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
        setloading(false);
        setTimeout(() => {
          showAlert(e.message);
        }, 10);
      });
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <TCFormProgress totalSteps={3} curruentStep={3} />

      <View
        style={{
          marginTop: -8,
        }}>
        <TCLabel
          title={strings.writeNotesPlaceholder.toUpperCase()}
          style={{marginBottom: 7}}
        />
        <TCTextField
          value={note}
          height={100}
          multiline={true}
          onChangeText={(text) => setNote(text)}
          placeholder={strings.notesPlaceholder}
          keyboardType={'default'}
          style={{
            marginBottom: 30,
          }}
        />

        <View style={{flexDirection: 'row', paddingHorizontal: 25}}>
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
      </View>
      <View style={{marginBottom: 20}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
