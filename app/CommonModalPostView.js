import Modal from 'react-native-modal';
import React from 'react';
import MultiImagePostView from './components/newsFeed/MultiImagePostView';

const CommonModalPostView = ({
    visible = false,
    currentPage = 0,
    openPostModal = () => {},
    attachedImages = [],
    data = [],
    item = {},
    caller_id,
    navigation,
    backBtnPress,
    onImageProfilePress,
    onLikePress,
}) => (
  <Modal
    isVisible={visible}
    backdropColor="black"
    style={{ margin: 0 }}
    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
    backdropOpacity={0}>
    <MultiImagePostView
        currentPage={currentPage}
        openPostModal={openPostModal}
        attachedImages={attachedImages}
        data={data}
        item={item}
        caller_id={caller_id}
        navigation={navigation}
        backBtnPress={backBtnPress}
        onImageProfilePress={onImageProfilePress}
        onLikePress={onLikePress}
    />
  </Modal>
)

export default CommonModalPostView;
