import { CarPreview } from "./CarPreview.jsx"

export function CarList({ cars, onRemoveCar, onEditCar, addToCart }) {
    return (
        <ul className="car-list">
            {cars.map(car =>
                <li className="car-preview" key={car._id}>
                    <CarPreview car={car} />

                    <div>
                        <button onClick={() => onRemoveCar(car._id)}>x</button>
                        <button onClick={() => onEditCar(car)}>Edit</button>
                    </div>

                    <button className="buy" onClick={() => addToCart(car)}>
                        Add to Cart
                    </button>
                </li>)}
        </ul>
    )
}