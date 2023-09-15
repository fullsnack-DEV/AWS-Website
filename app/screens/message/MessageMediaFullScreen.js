// @flow
import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import colors from '../../Constants/Colors';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';

const MessageMediaFullScreen = ({navigation, route}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const {url, entityName, msgId} = route.params;

  const deleteImageFromMessage = async (messageId) => {
    setLoading(true);
    try {
      const message = await authContext.chatClient.getMessage(messageId);
      if (message) {
        const updatedAttachments = [];

        await authContext.chatClient.partialUpdateMessage(messageId, {
          set: {
            attachments: updatedAttachments,
          },
        });
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.blackColor}
      />
      <ActivityLoader visible={loading} />
      {!showFullScreen && (
        <ScreenHeader
          title={entityName}
          containerStyle={{borderBottomWidth: 0}}
          labelStyle={{color: colors.whiteColor}}
          leftIcon={images.whiteBackArrow}
          leftIconPress={() => navigation.goBack()}
        />
      )}

      <Pressable
        style={{flex: 1, paddingVertical: showFullScreen ? 0 : 50}}
        onPress={() => setShowFullScreen(!showFullScreen)}>
        <Image source={{uri: url}} style={styles.image} />
      </Pressable>

      {!showFullScreen && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={downloadImage}>
            <Image source={images.downloadImage} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{strings.download}</Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              deleteImageFromMessage(msgId);
            }}>
            <Image source={images.deleteImage} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{strings.delete}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.blackColor,
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  buttonIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
  },
  verticalLine: {
    width: 1,
    height: 30,
    backgroundColor: colors.veryLightBlack,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default MessageMediaFullScreen;
