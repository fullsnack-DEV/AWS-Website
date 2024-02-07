import React, {useState, useCallback, useContext} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import _ from 'lodash';
import SingleImageModal from '../newsFeed/SingleImageModal';
import colors from '../../Constants/Colors';
import {createReaction} from '../../api/NewsFeeds';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';

function SingleImageRender({data, extraData}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [postData, setPostData] = useState(extraData);

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: Verbs.clap,
        activity_id: item.id,
      };
      createReaction(bodyParams, authContext)
        .then((res) => {
          const pData = _.cloneDeep(extraData);
          const pIndex = pData.findIndex((pItem) => pItem?.id === item?.id);
          const likeIndex =
            pData[pIndex].own_reactions?.clap?.findIndex(
              (likeItem) => likeItem?.user_id === authContext?.entity?.uid,
            ) ?? -1;
          if (likeIndex === -1) {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap.push(res?.payload);
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap + 1 ?? 0;
          } else {
            pData[pIndex].own_reactions = {...pData?.[pIndex]?.own_reactions};
            pData[pIndex].own_reactions.clap = [
              ...pData?.[pIndex]?.own_reactions?.clap,
            ];
            pData[pIndex].own_reactions.clap = pData?.[
              pIndex
            ]?.own_reactions?.clap?.filter(
              (likeItem) => likeItem?.user_id !== authContext?.entity?.uid,
            );
            pData[pIndex].reaction_counts = {
              ...pData?.[pIndex]?.reaction_counts,
            };
            pData[pIndex].reaction_counts.clap =
              pData?.[pIndex]?.reaction_counts?.clap - 1 ?? 0;
          }
          setPostData(pData);
        })
        .catch((e) => {
          console.log('Townsucp', e.message);
        });
    },
    [authContext, extraData],
  );

  const toggleModal = () => {
    navigation.navigate('NewsFeedStack', {
      screen: 'FeedViewScreen',
      params: {
        feedItem: postData,
        currentPage: 9,
        updateCommentCount: 9,
        onLikePress,
      },
    });
  };

  return (
    <View style={styles.imagesViewStyle}>
      <TouchableWithoutFeedback
        onPress={() => {
          toggleModal();
        }}
        style={styles.imagesViewStyle}>
        <FastImage
          style={styles.imageStyle}
          source={{uri: data?.attachments[0]?.thumbnail}}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableWithoutFeedback>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{margin: 0}}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        backdropOpacity={0}>
        <SingleImageModal
          uploadImageURL={data.attachments[0].thumbnail}
          backBtnPress={() => setModalVisible(false)}
          data={data}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 130,
    width: 130,
    resizeMode: 'contain',
  },
  imagesViewStyle: {
    flexDirection: 'row',

    borderWidth: 0.5,
    borderColor: colors.disableColor,
  },
});

export default SingleImageRender;
