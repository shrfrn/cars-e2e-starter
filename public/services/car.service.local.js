import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'carDB'

_createCars()

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
            {
                console.log(car.vendor, regExp.test(car.vendor))
                console.log(car.price, car.price <= filterBy.maxPrice)
                return regExp.test(car.vendor) &&
                car.price <= filterBy.maxPrice

            }
            )
        })
}

function getById(carId) {
    return storageService.get(STORAGE_KEY, carId)
}

function remove(carId) {
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
        speed: '',
    }
}

function getRandomCar() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
        speed: utilService.getRandomIntInclusive(50, 150),
    }
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '' }
}

function _createCars() {
    var cars = utilService.loadFromStorage(STORAGE_KEY)
    if (cars && cars.length > 0) return

    cars = []
    for(var i = 0; i < 12; i++){
        const car = getRandomCar()
        car._id = utilService.makeId()
        cars.push(car)
    }
    utilService.saveToStorage(STORAGE_KEY, cars)
}