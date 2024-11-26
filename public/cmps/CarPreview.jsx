const { Link } = ReactRouterDOM

export function CarPreview({ car }) {

    return (
        <article>
            <h4>{car.vendor}</h4>
            <h1>⛐</h1>
            <p>Price: <span>${car.price.toLocaleString()}</span></p>
            <p>Speed: <span>{car.speed.toLocaleString()} km/h</span></p>
            {car.owner && <p>Owner: <Link to={`/user/${car.owner._id}`}>{car.owner.fullname}</Link></p>}
            <hr />
            <Link to={`/car/edit/${car._id}`}>Edit</Link> &nbsp; | &nbsp;
            <Link to={`/car/${car._id}`}>Details</Link>

        </article>
    )
}