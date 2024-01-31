import {View, Text, Alert, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {format} from 'react-string-format';
import {FlatList} from 'react-native-gesture-handler';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import {getGroupDetails, getTeamsOfClub} from '../../../api/Groups';
import Verbs from '../../../Constants/Verbs';
import {getGroupIndex} from '../../../api/elasticSearch';

import GroupIcon from '../../../components/GroupIcon';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import {shareEventPost} from '../../../api/Schedule';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const ShareEventPostModal = ({visible, onClose, eventData = {}}) => {
  const authContext = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [sharedGroups] = useState(eventData.event_share_groups);
  const [eventShareGroups, setEventShareGroups] = useState(
    eventData.event_share_groups,
  );
  const [diselectArray, setDiselectedArray] = useState([]);
  const [loading, setloading] = useState(false);

  const onEditEvent = () => {
    setloading(true);

    const data = {
      event_removed_groups: diselectArray,
      event_share_groups: eventShareGroups,
    };

    shareEventPost(eventData.cal_id, data, authContext)
      .then(() => {
        setloading(false);
        onClose();
      })
      .catch((e) => {
        setloading(false);

        Alert.alert(e.messages);
      });
  };

  const ondonePress = () => {
    onEditEvent();
  };

  const getTeamsforClubs = () => {
    getTeamsOfClub(authContext.entity.obj.group_id, authContext)
      .then((res) => {
        setGroups(res.payload);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (authContext.entity.role === Verbs.entityTypeTeam) {
      getGroupDetails(authContext.entity.uid, authContext)
        .then((res) => {
          const groupID = res.payload?.parent_groups ?? [];

          const groupQuery = {
            query: {
              terms: {
                _id: groupID,
              },
            },
          };

          getGroupIndex(groupQuery)
            .then((response) => {
              setGroups(response);
            })
            .catch((e) => {
              Alert.alert('', e.messages);
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      getTeamsforClubs();
    }
  }, []);

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={() => onClose}
      modalType={ModalTypes.style1}
      title={strings.shareEventPostText}
      isRightIconText
      headerRightButtonText={strings.done}
      containerStyle={{padding: 0, flex: 1}}
      onRightButtonPress={() => ondonePress()}>
      <Text
        style={{
          paddingHorizontal: 15,
          fontFamily: fonts.RReular,
          fontSize: 16,
          lineHeight: 24,
          marginTop: 20,
        }}>
        {format(
          strings.deseectTeamsClubsText,
          authContext.entity.role === Verbs.entityTypeClub
            ? strings.teamsText
            : strings.clubsText,
        )}
      </Text>
      <ActivityLoader visible={loading} />
      <FlatList
        data={groups}
        keyExtractor={(item) => item.group_id}
        style={{marginTop: 24, marginHorizontal: 20}}
        bounces={false}
        renderItem={({item}) => (
          <TouchableOpacity
            disabled={!sharedGroups.includes(item.group_id)}
            onPress={() => {
              const i = eventShareGroups.indexOf(item.group_id);
              if (i !== -1) {
                const newArray = [...eventShareGroups];
                newArray.splice(i, 1);
                setEventShareGroups(newArray);
                setDiselectedArray([item.group_id]);
              } else {
                setEventShareGroups((prevArray) => [
                  ...prevArray,
                  item.group_id,
                ]);

                const disselectIndex = diselectArray.indexOf(item.group_id);
                if (disselectIndex !== -1) {
                  const newDiselectArray = [...diselectArray];
                  newDiselectArray.splice(disselectIndex, 1);
                  setDiselectedArray(newDiselectArray);
                }
              }
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 15,
              marginVertical: 10,
              opacity: sharedGroups.includes(item.group_id) ? 1 : 0.5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <GroupIcon
                imageUrl={item?.thumbnail}
                groupName={item?.group_name ?? item?.full_name}
                entityType={item.entity_type}
                containerStyle={{
                  width: 30,
                  height: 30,
                  borderWidth: 1,
                }}
                textstyle={{
                  fontSize: 10,
                  marginTop: 1,
                }}
                placeHolderStyle={{
                  width: 12,
                  height: 12,
                  bottom: -2,
                  right: -2,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: fonts.RRegular,
                  marginLeft: 8,
                  marginTop: 2,
                }}>
                {item?.group_name}
              </Text>
            </View>
            <TouchableOpacity
              disabled={!eventShareGroups.includes(item.group_id)}
              onPress={() => {
                const i = eventShareGroups.indexOf(item.group_id);
                if (i !== -1) {
                  const newArray = [...eventShareGroups];
                  newArray.splice(i, 1);
                  setEventShareGroups(newArray);
                  setDiselectedArray([...diselectArray, item.group_id]);
                } else {
                  setEventShareGroups((prevArray) => [
                    ...prevArray,
                    item.group_id,
                  ]);
                  const disselectIndex = diselectArray.indexOf(item.group_id);
                  if (disselectIndex !== -1) {
                    const newDiselectArray = [...diselectArray];
                    newDiselectArray.splice(disselectIndex, 1);
                    setDiselectedArray(newDiselectArray);
                  }
                }
              }}>
              <Image
                source={
                  eventShareGroups.includes(item.group_id)
                    ? images.newSelectCheckBox
                    : images.newDiselectCheckBox
                }
                style={{
                  height: 22,
                  width: 22,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: colors.veryLightGray,
                  borderRadius: 7,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </CustomModalWrapper>
  );
};

export default ShareEventPostModal;
