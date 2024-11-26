import { carService } from "../../services/car.service.js";
import { showSuccessMsg } from "../../services/event-bus.service.js";
import { ADD_CAR, CAR_UNDO, REMOVE_CAR, SET_CARS, SET_FILTER_BY, SET_IS_LOADING, UPDATE_CAR } from "../reducers/car.reducer.js";
import { store } from "../store.js";

export function loadCars() {
    const filterBy = store.getState().carModule.filterBy
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return carService.query(filterBy)
        .then(cars => {
            store.dispatch({ type: SET_CARS, cars })
        })
        .catch(err => {
            console.log('car action -> Cannot load cars', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeCar(carId) {
    return carService.remove(carId)
        .then(() => {
            store.dispatch({ type: REMOVE_CAR, carId })
        })
        .catch(err => {
            console.log('car action -> Cannot remove car', err)
            throw err
        })
}

export function removeCarOptimistic(carId) {
    store.dispatch({ type: REMOVE_CAR, carId })
    return carService.remove(carId)
        .then(() => {
            showSuccessMsg('Removed Car!')
        })
        .catch(err => {
            store.dispatch({ type: CAR_UNDO })
            console.log('car action -> Cannot remove car', err)
            throw err
        })
}

export function saveCar(car) {
    const type = car._id ? UPDATE_CAR : ADD_CAR
    return carService.save(car)
        .then(savedCar => {
            store.dispatch({ type, car: savedCar })
            return savedCar
        })
        .catch(err => {
            console.log('car action -> Cannot save car', err)
            throw err
        })
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}