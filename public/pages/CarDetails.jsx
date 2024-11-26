const { useEffect, useState } = React
const { Link, useParams } = ReactRouterDOM

import { carService } from "../services/car.service.local.js"

export function CarDetails() {
    const [car, setCar] = useState(null)
    const { carId } = useParams()

    useEffect(() => {
        if (carId) loadCar()
    }, [carId])

    function loadCar() {
        carService.getById(carId)
            .then(car => setCar(car))
            .catch(err => {
                console.log('Had issues in car details', err)
                navigate('/car')
            })
    }
    if (!car) return <div>Loading...</div>
    return (
        <section className="car-details">
            <h1>Car vendor : {car.vendor}</h1>
            <h5>Price: ${car.price}</h5>
            <p>⛐</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi voluptas cumque tempore, aperiam sed dolorum rem! Nemo quidem, placeat perferendis tempora aspernatur sit, explicabo veritatis corrupti perspiciatis repellat, enim quibusdam!</p>
            <Link to={`/car/edit/${car._id}`}>Edit</Link> &nbsp;
            <Link to={`/car`}>Back</Link>
            <p>
                <Link to="/car/nJ5L4">Next Car</Link>
            </p>
        </section>
    )
}