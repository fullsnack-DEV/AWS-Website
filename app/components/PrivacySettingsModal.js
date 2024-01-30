// @flow
import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomModalWrapper from './CustomModalWrapper';
import {ModalTypes} from '../Constants/GeneralConstants';
import {strings} from '../../Localization/translation';
import QuestionAndOptionsComponent from '../screens/account/privacySettings/QuestionAndOptionsComponent';
import colors from '../Constants/Colors';
import {patchPlayer} from '../api/Users';
import AuthContext from '../auth/context';
import {setAuthContextData} from '../utils';
import ActivityLoader from './loader/ActivityLoader';
import Verbs from '../Constants/Verbs';
import {patchGroup} from '../api/Groups';

const PrivacySettingsModal = ({
  isVisible = false,
  closeModal = () => {},
  title = strings.privacySettings,
  options = [],
  selectedOptions = {},
  onSelect = () => {},
  onSave = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSave = () => {
    const privacyOptions = {};

    options.forEach((item) => {
      privacyOptions[item.key] = selectedOptions[item.key].value;
    });

    const payload = {...privacyOptions};

    if (
      [Verbs.entityTypeTeam, Verbs.entityTypeClub].includes(
        authContext.entity.role,
      )
    ) {
      setLoading(true);
      patchGroup(authContext.entity.uid, payload, authContext)
        .then(async (response) => {
          await setAuthContextData(response.payload, authContext);
          setLoading(false);
          onSave(response.payload);
        })
        .catch((err) => {
          console.log('error ==>', err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      patchPlayer(payload, authContext)
        .then(async (response) => {
          await setAuthContextData(response.payload, authContext);
          setLoading(false);
          onSave(response.payload);
        })
        .catch((err) => {
          console.log('error ==>', err);
          setLoading(false);
        });
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style1}
      title={title}
      headerRightButtonText={strings.save}
      containerStyle={{paddingHorizontal: 15, paddingVertical: 20, flex: 1}}
      onRightButtonPress={handleSave}>
      <View style={styles.parent}>
        <ActivityLoader visible={loading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((item, index) => (
            <View key={index}>
              <QuestionAndOptionsComponent
                title={strings[item.question]}
                subText={item?.subText ? strings[item?.subText] : null}
                options={item.options}
                privacyKey={item.key}
                onSelect={(option) => {
                  onSelect(item.key, option);
                }}
                selectedOption={selectedOptions[item.key]}
              />
              {options.length - 1 !== index && (
                <View style={styles.separatorLine} />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
});
export default PrivacySettingsModal;
