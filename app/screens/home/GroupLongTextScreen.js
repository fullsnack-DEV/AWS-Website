import React, {
  useState,
  useLayoutEffect,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import {patchGroup} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';

export default function GroupLongTextScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const [description, setDescription] = useState('');

  const {groupDetails} = route.params;
  const authContext = useContext(AuthContext);
  const inputRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (groupDetails.bio) {
      setDescription(groupDetails.bio);
    }
  }, [groupDetails.bio]);

  const onSaveButtonClicked = () => {
    setloading(true);
    if (!description) {
      navigation.goBack();
      return;
    }

    const groupProfile = {
      ...groupDetails,
      bio: description,
    };

    patchGroup(
      route.params.groupDetails.group_id,
      groupProfile,
      authContext,
    ).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        const entity = authContext.entity;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 0.1);
      }
    });
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.editBioText}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={onSaveButtonClicked}
      />
      <ActivityLoader visible={loading} />
      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <Pressable
          style={styles.inputContainer}
          onPress={() => {
            inputRef.current.focus();
          }}>
          <TextInput
            ref={inputRef}
            placeholder={strings.enterBioPlaceholder}
            onChangeText={(text) => setDescription(text)}
            multiline
            maxLength={500}
            value={description}
            style={styles.input}
          />
        </Pressable>
      </View>
    </SafeAreaView>
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
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1608,
    elevation: 1,
  },
  input: {
    padding: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});
