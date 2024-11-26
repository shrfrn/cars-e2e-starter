import { carService } from "../../services/car.service.js"

//* Cars
export const SET_CARS = 'SET_CARS'
export const REMOVE_CAR = 'REMOVE_CAR'
export const ADD_CAR = 'ADD_CAR'
export const UPDATE_CAR = 'UPDATE_CAR'
export const CAR_UNDO = 'CAR_UNDO'

//* Shopping cart
export const TOGGLE_CART_IS_SHOWN = 'TOGGLE_CART_IS_SHOWN'
export const ADD_CAR_TO_CART = 'ADD_CAR_TO_CART'
export const REMOVE_CAR_FROM_CART = 'REMOVE_CAR_FROM_CART'
export const CLEAR_CART = 'CLEAR_CART'

export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    cars: [],
    isCartShown: false,
    shoppingCart: [],
    isLoading: false,
    filterBy: carService.getDefaultFilter(),
    lastCars: []
}

export function carReducer(state = initialState, action = {}) {
    switch (action.type) {
        //* Cars
        case SET_CARS:
            return { ...state, cars: action.cars }
        case REMOVE_CAR:
            const lastCars = [...state.cars]
            return {
                ...state,
                cars: state.cars.filter(car => car._id !== action.carId),
                lastCars
            }
        case ADD_CAR:

            return {
                ...state,
                cars: [...state.cars, action.car]
            }
        case UPDATE_CAR:
            return {
                ...state,
                cars: state.cars.map(car => car._id === action.car._id ? action.car : car)
            }

        //* Shopping cart
        case TOGGLE_CART_IS_SHOWN:
            return { ...state, isCartShown: !state.isCartShown }

        case ADD_CAR_TO_CART:
            return {
                ...state,
                shoppingCart: [...state.shoppingCart, action.car]
            }

        case REMOVE_CAR_FROM_CART:
            const shoppingCart = state.shoppingCart.filter(car => car._id !== action.carId)
            return { ...state, shoppingCart }


        case CLEAR_CART:
            return { ...state, shoppingCart: [] }

        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }

        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case CAR_UNDO:
            return {
                ...state,
                cars: [...state.lastCars]
            }


        default:
            return state
    }
}