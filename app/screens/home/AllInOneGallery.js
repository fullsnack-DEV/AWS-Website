/* eslint-disable no-unsafe-optional-chaining */
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ScreenHeader from '../../components/ScreenHeader';
import AuthContext from '../../auth/context';
import {GALLERY_TYPE, getWholeGallery} from '../../api/Gallery';
import {MAX_UPLOAD_POST_ASSETS} from '../../utils/imageAction';
import SingleImageRender from '../../components/Home/SingleImageRender';
import MultipleImageRender from '../../components/Home/MultipleImageRender';
import SingleVideoRender from '../../components/Home/SingleVideoRender';
import MultipleVideoRender from '../../components/Home/MultipleVideoRender';
import {strings} from '../../../Localization/translation';
import {widthPercentageToDP} from '../../utils';
import images from '../../Constants/ImagePath';

const AllInOneGallery = ({
  navigation,
  isAdmin,
  entity_id,
  entity_type,
  onAddPhotoPress,
  showSubTabs = true,
  galleryRef,
  isCreatePost = false,
  handleBackPress = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const [galleryType, setGalleryType] = useState(GALLERY_TYPE.FROMME);
  const [galleryData, setGalleryData] = useState([]);
  const [isNextDataLoading, setIsNextDataLoading] = useState(true);
  const [taggedNumber, setTaggedNumber] = useState(0);
  const [uplodedNumber, setUploadedNumber] = useState(0);

  useImperativeHandle(galleryRef, () => ({
    refreshGallery() {
      onLoadGallery();
    },
    onEndReached() {
      onEndReached();
    },
  }));

  const setUploadNumbers = () => {
    getWholeGallery(GALLERY_TYPE.FROMME, entity_type, entity_id, authContext)
      .then((res) => {
        setUploadedNumber(res.payload?.results.length);
      })
      .catch(() => {
        // setIsNextDataLoading(false);
      });
  };
  const setTaggedNumbers = () => {
    getWholeGallery(GALLERY_TYPE.TAGGED, entity_type, entity_id, authContext)
      .then((res) => {
        setTaggedNumber(res.payload?.results.length);
      })
      .catch(() => {
        // setIsNextDataLoading(false);
      });
  };

  useEffect(() => {
    setUploadNumbers();
    setTaggedNumbers();
  }, []);

  const onLoadGallery = useCallback(() => {
    setIsNextDataLoading(true);
    getWholeGallery(galleryType, entity_type, entity_id, authContext)
      .then((res) => {
        if (res?.payload?.next === '') {
          setIsNextDataLoading(false);
        }

        setGalleryData([...res.payload?.results]);
      })
      .catch(() => {
        setIsNextDataLoading(false);
      });
  }, [galleryType, entity_type, entity_id, authContext]);

  useEffect(() => {
    onLoadGallery();
  }, [galleryType, onLoadGallery, isCreatePost]);

  const onEndReached = () => {
    if (isNextDataLoading) {
      getWholeGallery(
        galleryType,
        entity_type,
        entity_id,
        authContext,
        galleryData?.[galleryData?.length - 1]?.id,
      )
        .then((res) => {
          if (res?.payload?.next === '') setIsNextDataLoading(false);
          setGalleryData([...galleryData, ...res.payload?.results]);
        })
        .catch(() => {
          setIsNextDataLoading(false);
        });
    }
  };

  const allGalleryRenderItem = useCallback(
    ({item}) => {
      const myItem =
        typeof item?.object === 'string'
          ? JSON.parse(item?.object)
          : item?.object;
      // if (
      //   (index === 0 && authContext.entity.uid === entity_id) ||
      //   (index === 0 && entity_type === 'game' && isAdmin)
      // ) {
      //   return (
      //     <AddPhotoItem
      //       onAddPhotoPress={() => {
      //         ImagePicker.openPicker({
      //           height: widthPercentageToDP(32.3),
      //           width: widthPercentageToDP(32.3),
      //           multiple: true,
      //           maxFiles: MAX_UPLOAD_POST_ASSETS,
      //         }).then((pickImages) => {
      //           onAddPhotoPress(pickImages);
      //         });
      //       }}
      //     />
      //   );
      // }

      if (myItem?.attachments?.length > 0) {
        if (myItem?.attachments?.[0]?.type === 'image') {
          if (myItem?.attachments?.length === 1)
            return <SingleImageRender data={myItem} />;
          return <MultipleImageRender data={myItem} />;
        }
        if (myItem?.attachments?.[0]?.type === 'video') {
          if (myItem?.attachments?.length === 1)
            return <SingleVideoRender data={myItem} />;
          return <MultipleVideoRender data={myItem} />;
        }
      }
      return <View />;
    },
    [authContext.entity.uid, entity_id, onAddPhotoPress],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.galleryTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (isCreatePost) {
            handleBackPress();
          } else {
            navigation.goBack();
          }
        }}
        rightIcon1={
          authContext.entity.uid === entity_id || isAdmin
            ? images.plusInvoice
            : null
        }
        rightIcon1Press={() => {
          ImagePicker.openPicker({
            height: widthPercentageToDP(32.3),
            width: widthPercentageToDP(32.3),
            multiple: true,
            maxFiles: MAX_UPLOAD_POST_ASSETS,
          }).then((pickImages) => {
            onAddPhotoPress(pickImages);
          });
        }}
        rightButtonTextStyle={{marginLeft: 15}}
      />
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: colors.lightgrayColor,
          borderBottomWidth: 1,
          padding: 15,
        }}>
        {showSubTabs &&
          [GALLERY_TYPE.FROMME, GALLERY_TYPE.TAGGED].map((item) => (
            <TouchableOpacity
              key={item}
              style={{marginRight: 20}}
              onPress={() => {
                setGalleryData([]);
                setGalleryType(item);
              }}>
              <Text
                style={{
                  color:
                    item === galleryType
                      ? colors.themeColor
                      : colors.lightBlackColor,
                  fontFamily:
                    item === galleryType ? fonts.RBold : fonts.RRegular,
                  lineHeight: 24,
                  fontSize: 16,
                }}>
                {_.startCase(item)} (
                {item === GALLERY_TYPE.FROMME ? uplodedNumber : taggedNumber})
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.RLight,
                  fontSize: 16,
                }}>
                {strings.noGalleryFound}
              </Text>
            </View>
          }
          data={galleryData}
          bounces={false}
          renderItem={allGalleryRenderItem}
          numColumns={3}
          style={{marginHorizontal: 1.5}}
          keyExtractor={(item, index) => `mainGallery${index}`}
        />
      </View>
    </SafeAreaView>
  );
};

export default forwardRef(AllInOneGallery);
