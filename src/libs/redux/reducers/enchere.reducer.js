import { _add_bid_data, _add_bid_data_enchere, _create_enchere, _delete_enchere, _dislike_enchere, _edit_enchere, _error_enchere, _filtre_enchere, _filtre_enchere_by_category, _get_all_encheres, _get_all_encheres_without_loading, _get_enchere, _like_enchere, _loading_enchere, _participate_in_enchere, _upload_enchere_file, _vider_bid_data, _vider_filtre_enchere, _vider_filtre_enchere_by_category, _vider_new_enchere } from "../constants/constants"

const init = {
    enchere: null,
    encheres: [],
    new_enchere: null,
    search_result: [],
    bid_data: null,
    message: null,
    errors: null,
    loading: false
}

const enchere_reducer = (state = init, action) => {
    switch (action.type) {
        case _loading_enchere:
            return { ...state, loading: true }

        case _error_enchere:
            return { ...state, errors: action.payload }

        case _get_all_encheres:
            return { ...state, encheres: action.payload, new_enchere: null, loading: false, errors: null }

        case _get_all_encheres_without_loading:
            return { ...state, encheres: action.payload, new_enchere: null, loading: false, errors: null }

        case _get_enchere:
            return { ...state, enchere: action.payload, new_enchere: null, loading: false, errors: null }

        case _like_enchere:
            return {
                ...state,
                encheres: state.encheres.map(enchere => {
                    if (enchere._id === action.payload.enchere_id) {
                        return { ...enchere, likes: [...enchere.likes, action.payload.user_id] }
                    } else return enchere
                }),
                new_enchere: null, loading: false, errors: null
            }

        case _dislike_enchere:
            return {
                ...state,
                encheres: state.encheres.map(enchere => {
                    if (enchere._id === action.payload.enchere_id) {
                        return { ...enchere, likes: enchere.likes.filter(userId => userId !== action.payload.user_id) }
                    } else return enchere
                }),
                new_enchere: null, loading: false, errors: null
            }

        case _filtre_enchere:
            return { ...state, search_result: action.payload, new_enchere: null, loading: false, errors: null }

        case _vider_filtre_enchere:
            return { ...state, search_result: action.payload, new_enchere: null, loading: false, errors: null }

        case _filtre_enchere_by_category:
            return { ...state, search_result: action.payload, new_enchere: null, loading: false, errors: null }

        case _vider_filtre_enchere_by_category:
            return { ...state, search_result: action.payload, new_enchere: null, loading: false, errors: null }

        case _create_enchere:
            return { ...state, encheres: [action.payload, ...state.encheres], new_enchere: action.payload, loading: false, errors: null }

        case _vider_new_enchere:
            return { ...state, new_enchere: action.payload, loading: false, errors: null }

        case _delete_enchere:
            return {
                ...state,
                encheres: state.encheres.filter(enchere => enchere._id !== action.payload),
                new_enchere: null, loading: false, errors: null
            }

        case _edit_enchere:
            return {
                ...state,
                encheres: state.encheres.map(enchere => {
                    if (enchere._id === action.payload.enchere_id) return action.payload.data
                    else return enchere
                }),
                new_enchere: null, loading: false, errors: null
            }

        case _add_bid_data:
            return { ...state, bid_data: action.payload, new_enchere: null, loading: false, errors: null }

        case _vider_bid_data:
            return { ...state, bid_data: action.payload, new_enchere: null, loading: false, errors: null }

        case _add_bid_data_enchere:
            if (action.payload.reserve_price === true) {
                return {
                    ...state,
                    enchere: { ...state.enchere, enchere_status: "closed", history: [...state.enchere.history, { buyerID: action.payload.hostID, real_montant: action.payload.real_montant, montant: action.payload.montant, reserve_price: action.payload.reserve_price, date: action.payload.date }] },
                    new_enchere: null, loading: false, errors: null
                }
            } else {
                return {
                    ...state,
                    enchere: { ...state.enchere, history: [...state.enchere.history, { buyerID: action.payload.hostID, real_montant: action.payload.real_montant, montant: action.payload.montant, reserve_price: action.payload.reserve_price, date: action.payload.date }] },
                    new_enchere: null, loading: false, errors: null
                }
            }

        default:
            return state
    }
}

export default enchere_reducer