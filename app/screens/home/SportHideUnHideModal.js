import React, {useContext, useState} from 'react';
import {StyleSheet, Alert, View, Text} from 'react-native';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import {patchPlayer} from '../../api/Users';
import {setAuthContextData} from '../../utils';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import OrderedSporList from '../../components/Home/OrderedSporList';
import Verbs from '../../Constants/Verbs';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

export default function SportHideUnHideModal({isVisible, onCloseModal}) {
  const [loading, setloading] = useState(false);
  const [updatedSportList, setUpdatedSportList] = useState([]);

  const authContext = useContext(AuthContext);

  const onSavePress = () => {
    const user = authContext.entity.obj;
    // setloading(true);
    let registeredSports =
      user.registered_sports?.length > 0 ? [...user.registered_sports] : [];
    let refereeSports =
      user.referee_data?.length > 0 ? [...user.referee_data] : [];
    let scorekeeperSports =
      user.scorekeeper_data?.length > 0 ? [...user.scorekeeper_data] : [];

    updatedSportList.forEach((item) => {
      if (item.type === Verbs.entityTypePlayer) {
        const list = user.registered_sports.map((ele) => {
          if (ele.sport === item.sport && ele.sport_type === item.sport_type) {
            return {...ele, ...item};
          }

          return ele;
        });

        registeredSports = list;
      }

      if (item.type === Verbs.entityTypeReferee) {
        const list = user.referee_data.map((ele) => {
          if (ele.sport === item.sport) {
            return {...ele, ...item};
          }
          return ele;
        });
        refereeSports = list;
      }

      if (item.type === Verbs.entityTypeScorekeeper) {
        const list = user.scorekeeper_data.map((ele) => {
          if (ele.sport === item.sport) {
            return {...ele, ...item};
          }
          return ele;
        });
        scorekeeperSports = list;
      }
    });

    const body = {
      registered_sports: registeredSports,
      referee_data: refereeSports,
      scorekeeper_data: scorekeeperSports,
    };

    patchPlayer(body, authContext)
      .then(async (res) => {
        setloading(false);
        onCloseModal();
        await setAuthContextData(res.payload, authContext);
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .finally(() => setloading(false));
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      modalType={ModalTypes.style1}
      title={strings.hideUnhide}
      leftIcon={images.backArrow}
      containerStyle={{padding: 0, flex: 1}}
      headerRightButtonText={strings.save}
      leftIconPress={() => onCloseModal()}
      isRightIconText
      onRightButtonPress={() => {
        onSavePress();
      }}>
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <OrderedSporList
          user={authContext.entity.obj}
          showToggleButton
          onToggle={(list) => {
            setUpdatedSportList(list);
          }}
          renderListHeader={() => (
            <View style={{paddingTop: 15}}>
              <Text style={styles.label}>{strings.hideUnhideDescription}</Text>
            </View>
          )}
        />
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
