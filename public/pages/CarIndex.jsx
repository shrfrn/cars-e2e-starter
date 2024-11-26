const { useEffect } = React
const { Link } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { carService } from '../services/car.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { ADD_CAR_TO_CART } from '../store/reducers/car.reducer.js'
import { loadCars, removeCarOptimistic, saveCar, setFilterBy } from '../store/actions/car.actions.js'

import { CarFilter } from '../cmps/CarFilter.jsx'
import { CarList } from '../cmps/CarList.jsx'

export function CarIndex() {

    const dispatch = useDispatch()
    const cars = useSelector(storeState => storeState.carModule.cars)
    const filterBy = useSelector(storeState => storeState.carModule.filterBy)
    const isLoading = useSelector(storeState => storeState.carModule.isLoading)

    useEffect(() => {
        loadCars()
            .catch(err => {
                showErrorMsg('Cannot load cars!')
            })
    }, [filterBy])
    
    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function onRemoveCar(carId) {
        removeCarOptimistic(carId)
            .then(() => {
                showSuccessMsg('Car removed')
            })
            .catch(err => {
                showErrorMsg('Cannot remove car')
            })
    }

    function onAddCar() {
        const carToSave = carService.getRandomCar()
        saveCar(carToSave)
            .then((savedCar) => {
                showSuccessMsg(`Car added (id: ${savedCar._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot add car')
            })
    }
    
    function onEditCar(car) {
        const price = +prompt('New price?')
        const carToSave = { ...car, price }

        saveCar(carToSave)
            .then((savedCar) => {
                showSuccessMsg(`Car updated to price: $${savedCar.price}`)
            })
            .catch(err => {
                showErrorMsg('Cannot update car')
            })
    }

    function addToCart(car) {
        console.log(`Adding ${car.vendor} to Cart`)
        dispatch({ type: ADD_CAR_TO_CART, car })
        showSuccessMsg('Added to Cart')
    }

    return (
        <div>
            <h3>Cars App</h3>
            <main>
                <Link to="/car/edit">Add Car</Link>
                <button className='add-btn' onClick={onAddCar}>Add Random Car ⛐</button>
                <CarFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                {!isLoading
                    ? <CarList
                        cars={cars}
                        onRemoveCar={onRemoveCar}
                        onEditCar={onEditCar}
                        addToCart={addToCart}
                    />
                    : <div>Loading...</div>
                }
                <hr />
            </main>
        </div>
    )
}