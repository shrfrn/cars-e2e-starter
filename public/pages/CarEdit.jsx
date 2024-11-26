const { useState, useEffect } = React
const { Link, useNavigate, useParams } = ReactRouterDOM

import { carService } from "../services/car.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveCar } from "../store/actions/car.actions.js"


export function CarEdit() {
    const navigate = useNavigate()
    const [carToEdit, setCarToEdit] = useState(carService.getEmptyCar())
    const { carId } = useParams()

    useEffect(() => {
        if (carId) loadCar()
    }, [])

    function loadCar() {
        carService.getById(carId)
            .then(car => setCarToEdit(car))
            .catch(err => {
                console.log('Had issues in car edit', err)
                navigate('/car')
            })
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setCarToEdit((prevCar) => ({ ...prevCar, [field]: value }))
    }

    function onSaveCar(ev) {
        ev.preventDefault()
        if (!carToEdit.price) carToEdit.price = 1000
        saveCar(carToEdit)
            .then(() => {
                showSuccessMsg('Car Saved!')
                navigate('/car')
            })
            .catch(err => {
                console.log('Had issues in car details', err)
                showErrorMsg('Had issues in car details')
            })
    }

    return (
        <section className="car-edit">
            <h2>{carToEdit._id ? 'Edit' : 'Add'} Car</h2>

            <form onSubmit={onSaveCar} >
                <label htmlFor="vendor">Vendor : </label>
                <input type="text"
                    name="vendor"
                    id="vendor"
                    placeholder="Enter vendor..."
                    value={carToEdit.vendor}
                    onChange={handleChange}
                />
                <label htmlFor="price">Price : </label>
                <input type="number"
                    name="price"
                    id="price"
                    placeholder="Enter price"
                    value={carToEdit.price}
                    onChange={handleChange}
                />

                <div>
                    <button>{carToEdit._id ? 'Save' : 'Add'}</button>
                    <Link to="/car">Cancel</Link>
                </div>
            </form>
        </section>
    )
}