/* eslint-disable array-callback-return */
import _ from 'lodash';
import CreateDataContext from './CreateDataContext';
import uploadImages from '../utils/imageAction';

const imageUploadReducer = (state, action) => {
  switch (action.type) {
    case 'createUploadingData': {
      const upData = _.cloneDeep(state.uploadingData);
      upData.push(action.payload)
      return { uploadingData: upData }
    }
    case 'removeUploadingData': {
      const upData = state?.uploadingData?.filter((item) => item?.id !== action.payload)
      return { uploadingData: upData }
    }
    case 'setUploadingData': {
      const imageUploadingID = action?.payload?.id
      const imageUploadingKey = action?.payload?.key
      const imageUploadingValue = action?.payload?.value
      const upData = _.cloneDeep(state.uploadingData)
      const index = upData?.findIndex((item) => item?.id === imageUploadingID)
      if (index !== -1) upData[index][imageUploadingKey] = imageUploadingValue
      return { uploadingData: upData }
    }
    default:
      return state
  }
}

const removeUploadingData = (dispatch) => (id) => {
  dispatch({ type: 'removeUploadingData', payload: id })
}
const uploadData = (dispatch) => (authContext, dataParams, imageArray, callBack) => {
  const currentImagesDataUploadID = `IMAGE_UPLOAD_${new Date().getTime()}`
  const obj = { id: currentImagesDataUploadID, dataArray: [...imageArray] }
  dispatch({ type: 'createUploadingData', payload: obj });
  let cancelToken = {}
  const setData = (key, value) => {
    dispatch({ type: 'setUploadingData', payload: { id: currentImagesDataUploadID, key, value } })
  }
  const progressStatus = (completed, total) => {
    setData('doneUploadCount', completed < total ? (completed + 1) : total)
  }

  const cancelRequest = (axiosTokenSource) => {
    cancelToken = { ...axiosTokenSource };
    setData('cancelRequest', cancelToken)
  }
  setData('totalUploadCount', imageArray?.length ?? 1);
  console.log('imageArry:=>', imageArray);
  uploadImages(imageArray, authContext, progressStatus, cancelRequest).then((responses) => {
    console.log('Upload response:=>', responses);
    const attachments = [];
     responses.map((item, index) => {
      let objAttachment = {}
      if (item.type === 'video') {
        if (imageArray.length === 1) {
          objAttachment = {
            type: item.type,
            url: item.fullImage,
            thumbnail: item.thumbnail,
            media_height: item.height,
            media_width: item.width,
            duration: imageArray[index].duration,
            is_short: imageArray[index].duration < 30000,
          }
        } else {
          objAttachment = {
            type: item.type,
            url: item.fullImage,
            thumbnail: item.thumbnail,
            media_height: item.height,
            media_width: item.width,
            duration: imageArray[index].duration,
          }
        }
      } else {
        objAttachment = {
          type: item.type,
          url: item.fullImage,
          thumbnail: item.thumbnail,
          media_height: item.height,
          media_width: item.width,
        }
      }
      attachments.push(objAttachment)
    })
    const dParams = dataParams;
    dParams.attachments = [...dataParams?.attachments, ...attachments];
    dispatch({ type: 'removeUploadingData', payload: currentImagesDataUploadID })
    callBack(dParams);
  })
}
export const { Provider: ImageUploadProvider, Context: ImageUploadContext } = CreateDataContext(
  imageUploadReducer,
  {
    removeUploadingData,
    uploadData,
  },
  {
    uploadingData: [],
  },
);
