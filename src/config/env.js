/* eslint-disable import/no-unresolved */
import {
 DEV_BASE_URL, STAGE_BASE_URL, DEV_GAME_INDEX, STAGE_GAME_INDEX, DEV_USER_INDEX, STAGE_USER_INDEX, DEV_GROUP_INDEX, STAGE_GROUP_INDEX, DEV_CALENDAR_INDEX, STAGE_CALENDAR_INDEX,
} from '@env'

const devEnvironment = {
    BASE_URL: DEV_BASE_URL,
    GAME_INDEX: DEV_GAME_INDEX,
    USER_INDEX: DEV_USER_INDEX,
    GROUP_INDEX: DEV_GROUP_INDEX,
    CALENDAR_INDEX: DEV_CALENDAR_INDEX,
}

const stageEnvironment = {
    BASE_URL: STAGE_BASE_URL,
    GAME_INDEX: STAGE_GAME_INDEX,
    USER_INDEX: STAGE_USER_INDEX,
    GROUP_INDEX: STAGE_GROUP_INDEX,
    CALENDAR_INDEX: STAGE_CALENDAR_INDEX,
}

export default __DEV__ ? devEnvironment : stageEnvironment
