import * as nav from './action-type';
export const subSite = (value) => { // 子网站
    return dispatch => {
            dispatch({
                type: nav.SUB_SITE,
                value: value
            })
    }
}
export const noSubSite = (value) => {
    return dispatch => {
        dispatch({
            type: nav.NO_SUB_SITE,
            value: value
        })
    }
}