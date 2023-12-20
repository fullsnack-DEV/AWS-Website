import {View, Alert, StyleSheet, Pressable, TextInput} from 'react-native';
import React, {useState, useContext, useRef, useEffect} from 'react';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {patchGroup} from '../../api/Groups';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import fonts from '../../Constants/Fonts';

export default function EditBioModal({
  visible,
  onClose,
  isBylaw,
  groupDetails,
}) {
  const [loading, setloading] = useState(false);
  const [description, setDescription] = useState('');
  const [byLaw, setByLaw] = useState('');

  const authContext = useContext(AuthContext);
  const inputRef = useRef();

  useEffect(() => {
    if (isBylaw && groupDetails?.bylaw) {
      setByLaw(groupDetails?.bylaw);
    } else if (groupDetails?.bio) {
      setDescription(groupDetails?.bio);
    }
  }, [groupDetails?.bio, groupDetails?.bylaw, isBylaw]);

  const onSaveButtonClicked = () => {
    setloading(true);

    const groupProfile = {};
    if (isBylaw) {
      groupProfile.bylaw = byLaw;
    } else {
      groupProfile.bio = description;
    }

    patchGroup(groupDetails.group_id, groupProfile, authContext).then(
      async (response) => {
        setloading(false);
        if (response && response.status === true) {
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          onClose();
        } else {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, strings.defaultError);
          }, 0.1);
        }
      },
    );
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={() => onClose()}
      modalType={ModalTypes.style1}
      title={isBylaw ? strings.editbylaw : strings.editBioText}
      leftIcon={images.backArrow}
      leftIconPress={() => {
        onClose();
      }}
      isRightIconText
      containerStyle={{padding: 0, flex: 1}}
      headerRightButtonText={strings.save}
      onRightButtonPress={onSaveButtonClicked}>
      <View style={styles.parent}>
        <ActivityLoader visible={loading} />
        <View style={{paddingTop: 20, paddingHorizontal: 15}}>
          <Pressable
            style={styles.inputContainer}
            onPress={() => {
              inputRef.current.focus();
            }}>
            <TextInput
              ref={inputRef}
              multiline
              placeholder={
                isBylaw
                  ? strings.enterBylawPlaceholder
                  : strings.enterBioPlaceholder
              }
              onChangeText={(text) => {
                if (isBylaw) {
                  setByLaw(text);
                } else {
                  setDescription(text);
                }
              }}
              maxLength={500}
              value={isBylaw ? byLaw : description}
              style={styles.input}
            />
          </Pressable>
        </View>
      </View>
    </CustomModalWrapper>
  );
}
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    padding: 10,
    minHeight: 193,
  },
  input: {
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
