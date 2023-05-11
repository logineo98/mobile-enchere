import axios from "axios"
import { _add_bid_data, _add_bid_data_enchere, _create_enchere, _delete_enchere, _dislike_enchere, _edit_enchere, _error_enchere, _filtre_enchere, _filtre_enchere_by_category, _get_all_encheres, _get_all_encheres_without_loading, _get_enchere, _like_enchere, _loading_enchere, _participate_in_enchere, _upload_enchere_file, _vider_bid_data, _vider_filtre_enchere, _vider_filtre_enchere_by_category, _vider_new_enchere, api } from "../constants/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const isLoading = () => {
    return (dispatch) => {
        dispatch({ type: _loading_enchere })
    }
}

export const error_enchere = (error) => {
    return (dispatch) => {
        console.log(error.response ? error.response.data?.message : error.message)
        dispatch({ type: _error_enchere, payload: error.response ? error.response.data?.message : error.message })
    }
}

export const get_all_encheres = (hostID) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.get(`${api}/api/enchere/${hostID}`, { headers: { token } })

        dispatch({ type: _get_all_encheres, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const get_all_encheres_without_loading = (hostID) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.get(`${api}/api/enchere/${hostID}`, { headers: { token } })

        dispatch({ type: _get_all_encheres_without_loading, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const like_enchere = (enchere_id, hostID, data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.patch(`${api}/api/enchere/like-enchere/${enchere_id}/${hostID}`, data, { headers: { token } })

        dispatch({ type: _like_enchere, payload: { enchere_id, ...data } })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const dislike_enchere = (enchere_id, hostID, data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.patch(`${api}/api/enchere/dislike-enchere/${enchere_id}/${hostID}`, data, { headers: { token } })

        dispatch({ type: _dislike_enchere, payload: { enchere_id, ...data } })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const filtre_enchere = (hostID, data) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.patch(`${api}/api/enchere/search/${hostID}`, { search_by_filter: data }, { headers: { token } })

        dispatch({ type: _filtre_enchere, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const vider_filtre_enchere = () => async (dispatch) => {
    try {
        dispatch({ type: _vider_filtre_enchere, payload: [] })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const filtre_enchere_by_category = (hostID, data) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const response = await axios.patch(`${api}/api/enchere/filter_by_category/${hostID}`, data, { headers: { token } })

        dispatch({ type: _filtre_enchere_by_category, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const vider_filtre_enchere_by_category = () => async (dispatch) => {
    try {
        dispatch({ type: _vider_filtre_enchere_by_category, payload: [] })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const create_enchere = (files, data) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const config_upload = { headers: { 'Content-Type': 'multipart/form-data' } }

        const response_upload = await axios.post(`${api}/api/enchere/upload_create`, files, config_upload)

        const config = { headers: { token } }

        const response = await axios.post(`${api}/api/enchere/`, { ...data, medias: response_upload?.data?.response }, config)

        dispatch({ type: _create_enchere, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const vider_new_enchere = () => async (dispatch) => {
    try {
        dispatch({ type: _vider_new_enchere, payload: null })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const delete_enchere = (enchere_id, hostID) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const config = { headers: { token } }

        const response = await axios.delete(`${api}/api/enchere/${enchere_id}/${hostID}`, config)

        dispatch({ type: _delete_enchere, payload: enchere_id })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const get_enchere = (enchere_id, hostID) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        const config = { headers: { token } }

        const response = await axios.get(`${api}/api/enchere/${enchere_id}/${hostID}`, config)

        dispatch({ type: _get_enchere, payload: response?.data?.response })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const edit_enchere = (enchere_id, hostID, files, data) => async (dispatch) => {
    try {
        dispatch(isLoading())

        const token = await AsyncStorage.getItem('cookie')

        if (files !== null) {
            console.log("edit enchere tz ", files)

            const _parts = files?._parts

            if (_parts?.length !== 0) {
                const config_upload = { headers: { 'Content-Type': 'multipart/form-data' } }

                const response_upload = await axios.put(`${api}/api/enchere/upload_edit`, files, config_upload)

                const config = { headers: { token } }

                const response = await axios.put(`${api}/api/enchere/${enchere_id}/${hostID}`, { ...data, new_img: response_upload?.data?.response }, config)

                dispatch({ type: _edit_enchere, payload: { enchere_id, data: response?.data?.response } })
            }
        } else {
            const config = { headers: { token } }

            const response = await axios.put(`${api}/api/enchere/${enchere_id}/${hostID}`, data, config)

            dispatch({ type: _edit_enchere, payload: { enchere_id, data: response?.data?.response } })
        }
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const add_bid_data = (data) => async (dispatch) => {
    try {
        dispatch({ type: _add_bid_data, payload: data })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const vider_bid_data = () => async (dispatch) => {
    try {
        dispatch({ type: _vider_bid_data, payload: null })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}

export const add_bid_data_enchere = (data) => async (dispatch) => {
    try {
        dispatch({ type: _add_bid_data_enchere, payload: data })
    } catch (error) {
        dispatch(error_enchere(error))
    }
}
