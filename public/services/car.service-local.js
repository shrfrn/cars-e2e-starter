
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'carDB'

export const carService = {
    query,
    getById,
    save,
    remove,
    getEmptyCar,
    getRandomCar,
    getDefaultFilter
}

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(cars => {
            if (!filterBy.txt) filterBy.txt = ''
            if (!filterBy.maxPrice) filterBy.maxPrice = Infinity
            const regExp = new RegExp(filterBy.txt, 'i')
            return cars.filter(car =>
                regExp.test(car.vendor) &&
                car.price <= filterBy.maxPrice
            )
        })
}

function getById(carId) {
    return storageService.get(STORAGE_KEY, carId)
}

function remove(carId) {
    // return Promise.reject('Not now!')
    return storageService.remove(STORAGE_KEY, carId)
}


function save(car) {
    if (car._id) {
        return storageService.put(STORAGE_KEY, car)
    } else {
        // when switching to backend - remove the next line
        car.owner = userService.getLoggedinUser()
        return storageService.post(STORAGE_KEY, car)
    }
}

function getEmptyCar() {
    return {
        vendor: '',
        price: '',
    }
}

function getRandomCar() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '' }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 6', price: 980}).then(x => console.log(x))


