// @flow
import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import {Gallery, useMessageContext} from 'stream-chat-react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {checkIsMessageDeleted} from '../../../utils/streamChat';
import {strings} from '../../../../Localization/translation';

const CustomMediaView = ({onPress = () => {}, chatUserId = ''}) => {
  const {message} = useMessageContext();

  const isDeletedMessage = checkIsMessageDeleted(chatUserId, message);

  if (isDeletedMessage) {
    return (
      <View style={{padding: 8}}>
        <View style={styles.row}>
          <Image source={images.deleteChat} style={styles.infoIcon} />
          <Text style={styles.deletedText}>{strings.messageDeletedText}</Text>
        </View>
      </View>
    );
  }

  return (
    <Gallery
      message={message}
      onPress={() => {
        onPress({
          attachments: message.attachments,
          entityName: message.user.name,
          msgId: message.id,
        });
      }}
    />
  );

  // if (message.attachments.length > 0) {
  //   if (message.attachments.length === 1) {
  //     return (
  //       <Pressable
  //         style={styles.parent}
  //         onPress={() =>
  //           onPress({
  //             attachments: message.attachments,
  //             entityName: message.user.name,
  //             msgId: message.id,
  //           })
  //         }
  //         onLongPress={onLongPress}>
  //         <Image
  //           source={{
  //             uri:
  //               message.attachments[0].image_url ??
  //               message.attachments[0].thumb_url,
  //           }}
  //           style={styles.image}
  //         />

  //         {message.attachments[0].type === Verbs.mediaTypeVideo ? (
  //           <View style={styles.overlayContainer}>
  //             <Image
  //               source={images.videoPlayIcon}
  //               style={{width: 30, height: 30, resizeMode: 'cover'}}
  //             />
  //           </View>
  //         ) : null}
  //       </Pressable>
  //     );
  //   }

  //   const list = [...message.attachments].slice(0, 4);

  //   return (
  //     <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
  //       {list.map((attachemnt, index) => (
  //         <Pressable
  //           key={index}
  //           style={[
  //             {width: '50%', height: 120},
  //             message.attachments.length % 2 !== 0 &&
  //             index === message.attachments.length - 1
  //               ? {width: '100%'}
  //               : {},
  //           ]}
  //           onPress={() =>
  //             onPress({
  //               attachments: message.attachments,
  //               entityName: message.user.name,
  //               msgId: message.id,
  //             })
  //           }
  //           onLongPress={onLongPress}>
  //           <Image
  //             source={{uri: attachemnt.image_url ?? attachemnt.thumb_url}}
  //             style={styles.image}
  //           />
  //           {message.attachments.length > 4 && index === 3 ? (
  //             <View
  //               style={[
  //                 styles.overlayContainer,
  //                 {backgroundColor: colors.modalBackgroundColor},
  //               ]}>
  //               <Text style={styles.overlayText}>
  //                 +{message.attachments.length - list.length}
  //               </Text>
  //             </View>
  //           ) : null}
  //           {attachemnt.type === Verbs.mediaTypeVideo ? (
  //             <View style={styles.overlayContainer}>
  //               <Image
  //                 source={images.videoPlayIcon}
  //                 style={{width: 30, height: 30, resizeMode: 'cover'}}
  //               />
  //             </View>
  //           ) : null}
  //         </Pressable>
  //       ))}
  //     </View>
  //   );
  // }
  // return null;
};

const styles = StyleSheet.create({
  // parent: {
  //   width: 150,
  //   height: 150,
  // },
  // image: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'cover',
  // },
  // overlayContainer: {
  //   width: '100%',
  //   height: '100%',
  //   position: 'absolute',
  //   zIndex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // overlayText: {
  //   color: colors.whiteColor,
  //   fontSize: 20,
  //   lineHeight: 30,
  //   fontFamily: fonts.RMedium,
  // },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
    resizeMode: 'contain',
  },
  deletedText: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
  },
});
export default CustomMediaView;
