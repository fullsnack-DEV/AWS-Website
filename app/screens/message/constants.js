import {Dimensions} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export const TAB_ITEMS = [
  {
    url: '',
    type: 'all',
  },
  {
    url: images.emojiHappy,
    type: 'happy',
  },
  {
    url: images.emojiWow,
    type: 'wow',
  },
  {
    url: images.emojiSad,
    type: 'sad',
  },
  {
    url: images.emojiCorrect,
    type: 'correct',
  },
  {
    url: images.emojiLike,
    type: 'like',
  },
  {
    url: images.emojiLove,
    type: 'love',
  },
];

export const themeStyle = {
  messageSimple: {
    content: {
      textContainer: {
        borderWidth: 0,
      },
      markdown: {
        text: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.lightBlackColor,
          fontFamily: fonts.RRegular,
        },
      },
      deletedContainerInner: {
        borderWidth: 0,
        backgroundColor: colors.whiteColor,
      },
      containerInner: {
        maxWidth: Dimensions.get('window').width * 0.7,
      },
    },
  },

  messageList: {
    container: {
      backgroundColor: colors.lightGrayBackground,
    },
  },
};

export const myMessageTheme = {
  messageSimple: {
    content: {
      textContainer: {
        //
      },
      markdown: {
        text: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.lightBlackColor,
          fontFamily: fonts.RRegular,
        },
      },
      containerInner: {
        borderWidth: 0,
        backgroundColor: colors.chatBubbleContainer,
      },
      deletedContainerInner: {
        borderWidth: 0,
      },
      container: {
        borderWidth: 0,
      },
    },
  },
};

export const newReactionData = [
  {
    Icon: images.emojiHappy,
    type: 'happy',
  },
  {
    Icon: images.emojiSad,
    type: 'sad',
  },
  {
    Icon: images.emojiWow,
    type: 'wow',
  },
  {
    Icon: images.emojiCorrect,
    type: 'correct',
  },
  {
    Icon: images.emojiLike,
    type: 'like',
  },
  {
    Icon: images.emojiLove,
    type: 'love',
  },
];
