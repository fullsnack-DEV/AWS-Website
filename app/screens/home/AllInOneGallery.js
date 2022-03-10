/* eslint-disable no-unsafe-optional-chaining */
import {
 FlatList, Text, TouchableOpacity, View,
} from 'react-native';
import _ from 'lodash';
import React, {
    forwardRef,
    useCallback, useContext, useEffect, useImperativeHandle, useState,
} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import { GALLERY_TYPE, getWholeGallery } from '../../api/Gallery';
import AddPhotoItem from '../../components/Home/AddPhotoItem';
import { MAX_UPLOAD_POST_ASSETS } from '../../utils/imageAction';
import SingleImageRender from '../../components/Home/SingleImageRender';
import MultipleImageRender from '../../components/Home/MultipleImageRender';
import SingleVideoRender from '../../components/Home/SingleVideoRender';
import MultipleVideoRender from '../../components/Home/MultipleVideoRender';

const AllInOneGallery = ({
    isAdmin,
    entity_id,
    entity_type,
    onAddPhotoPress,
    showSubTabs = true,
 }, galleryRef) => {
    const authContext = useContext(AuthContext);
    const [galleryType, setGalleryType] = useState(GALLERY_TYPE.FROMME)
    const [galleryData, setGalleryData] = useState([]);
    const [isNextDataLoading, setIsNextDataLoading] = useState(true);

    useImperativeHandle(galleryRef, () => ({
        refreshGallery() { onLoadGallery() },
        onEndReached() { onEndReached() },
    }))
    useEffect(() => {
        onLoadGallery();
    }, [galleryType])

    const onLoadGallery = () => {
        setIsNextDataLoading(true);
        getWholeGallery(galleryType, entity_type, entity_id, authContext).then((res) => {
            if (res?.payload?.next === '') setIsNextDataLoading(false);
            setGalleryData([...res.payload?.results]);
        }).catch(() => {
            setIsNextDataLoading(false);
        })
    }

    const onEndReached = () => {
        if (isNextDataLoading) {
            getWholeGallery(galleryType, entity_type, entity_id, authContext, galleryData?.[galleryData?.length - 1]?.id).then((res) => {
                if (res?.payload?.next === '') setIsNextDataLoading(false);
                setGalleryData([...galleryData, ...res.payload?.results]);
            }).catch(() => {
                setIsNextDataLoading(false);
            })
        }
    }

    const allGalleryRenderItem = useCallback(({ item, index }) => {
        const myItem = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object
        if (index === 0 && isAdmin) {
            return (
              <AddPhotoItem
                    onAddPhotoPress={() => {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 400,
                            multiple: true,
                            maxFiles: MAX_UPLOAD_POST_ASSETS,
                        }).then((pickImages) => {
                            onAddPhotoPress(pickImages)
                        });
                    }}
                />
            );
        }

        if (myItem?.attachments?.length > 0) {
            if (myItem?.attachments?.[0]?.type === 'image') {
                if (myItem?.attachments?.length === 1) return <SingleImageRender data={myItem} />
                return <MultipleImageRender data={myItem}/>
            }
            if (myItem?.attachments?.[0]?.type === 'video') {
                if (myItem?.attachments?.length === 1) return <SingleVideoRender data={myItem} />
                return <MultipleVideoRender data={myItem} />
            }
        }
        return <View />
    }, [isAdmin, onAddPhotoPress])
    const finalGalleryData = isAdmin ? ['0', ...galleryData] : galleryData
    return (
      <View>
        <View style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                borderBottomColor: colors.lightgrayColor,
                borderBottomWidth: 1,
                marginBottom: 15,
        }}>
          {showSubTabs && [GALLERY_TYPE.FROMME, GALLERY_TYPE.TAGGED].map((item) => (
            <TouchableOpacity key={item} style={{ padding: 10 }} onPress={() => {
                setGalleryData([]);
                setGalleryType(item)
            }}>
              <Text style={{
                            color: item === galleryType ? colors.themeColor : colors.lightBlackColor,
                            fontFamily: item === galleryType ? fonts.RBold : fonts.RRegular,
              }}>
                {_.startCase(item)}
              </Text>
            </TouchableOpacity>
                ))}

        </View>
        <FlatList
                ListEmptyComponent={<Text style={{ textAlign: 'center', fontFamily: fonts.RLight, fontSize: 16 }}>No Gallery Found</Text>}
                data={finalGalleryData}
                bounces={false}
                renderItem={allGalleryRenderItem}
                numColumns={3}
                style={{ marginHorizontal: 1.5 }}
                keyExtractor={(item, index) => `mainGallery${index}`}
            />
      </View>
    )
}

export default forwardRef(AllInOneGallery);
