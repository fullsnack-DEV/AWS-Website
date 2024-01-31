// @flow
import React, {useContext, useRef, useState} from 'react';
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
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Orientation from 'react-native-orientation';
import Video from 'react-native-video';
import colors from '../../Constants/Colors';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import ActivityLoader from '../../components/loader/ActivityLoader';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';

const MessageMediaFullScreen = ({navigation, route}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const videoRef = useRef();

  const {attachments, entityName, msgId} = route.params;

  const deleteImageFromMessage = async (messageId) => {
    setLoading(true);
    try {
      const message = await authContext.chatClient.getMessage(messageId);
      if (message) {
        const updatedAttachments = attachments.filter(
          (item, index) => index !== currentViewIndex,
        );

        const obj = {
          attachments: updatedAttachments,
          deleted_for_me: {
            status: true,
            user_id: [],
            is_media_only: true,
          },
        };
        if (updatedAttachments.length === 0) {
          obj.text = 'dummy';
        }

        await authContext.chatClient.partialUpdateMessage(messageId, {
          set: {...obj},
        });
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const downloadImage = async (url = '') => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const renderItem = ({item}) => {
    if (item.type === Verbs.mediaTypeImage) {
      return (
        <Pressable
          style={{
            flex: 1,
            paddingVertical: showFullScreen ? 0 : 50,
          }}
          onPress={() => setShowFullScreen(!showFullScreen)}>
          <Image
            source={{uri: item.image_url ?? item.asset_url}}
            style={styles.image}
          />
        </Pressable>
      );
    }

    if (item.type === Verbs.mediaTypeVideo) {
      return (
        <Pressable
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setShowFullScreen(!showFullScreen)}>
          <Video
            ref={videoRef}
            source={{uri: item.asset_url}}
            style={{width: '100%', height: '100%'}}
            resizeMode={'contain'}
            controls
            onLoad={() => {
              setShowFullScreen(true);
              Orientation.unlockAllOrientations();
              videoRef.current.seek(0);
            }}
          />
        </Pressable>
      );
    }

    return null;
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
          isRightIconText
          rightButtonText={`${currentViewIndex + 1}/${attachments.length}`}
          rightButtonTextStyle={{color: colors.whiteColor}}
          rightButtonTextContainerStyle={{
            backgroundColor: colors.userPostTimeColor,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 20,
          }}
        />
      )}

      <Carousel
        data={attachments}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        onSnapToItem={(itemIndex) => {
          setCurrentViewIndex(itemIndex);
          setShowFullScreen(false);
        }}
      />

      {!showFullScreen && (
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>
              downloadImage(attachments[currentViewIndex].image_url)
            }>
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
    resizeMode: 'contain',
  },
});
export default MessageMediaFullScreen;
