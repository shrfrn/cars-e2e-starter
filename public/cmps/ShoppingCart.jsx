const { useSelector, useDispatch } = ReactRedux

import { REMOVE_CAR_FROM_CART } from '../store/reducers/car.reducer.js'
import { checkout } from '../store/actions/user.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function ShoppingCart({ isCartShown }) {
    const dispatch = useDispatch()
    const shoppingCart = useSelector(storeState => storeState.carModule.shoppingCart)
    const user = useSelector(storeState => storeState.userModule.loggedInUser)

    function removeFromCart(carId) {
        console.log(`Todo: remove: ${carId} from cart`)
        dispatch({ type: REMOVE_CAR_FROM_CART, carId })
    }

    function getCartTotal() {
        return shoppingCart.reduce((acc, car) => acc + car.price, 0)
    }

    function onCheckout() {
        const amount = getCartTotal()
        checkout(amount)
            .then(()=>{
                showSuccessMsg(`Charged you: $ ${amount.toLocaleString()}`)
            })
            .catch(()=>{
                showErrorMsg('There was a problem checking out!')
            })
    }

    if (!isCartShown) return <span></span>
    const total = getCartTotal()
    return (
        <section className="cart" >
            <h5>Your Cart</h5>
            <ul>
                {
                    shoppingCart.map((car, idx) => <li key={idx}>
                        <button onClick={() => {
                            removeFromCart(car._id)
                        }}>x</button>
                        {car.vendor} | ${car.price}
                    </li>)
                }
            </ul>
            <p>Total: ${total} </p>
            <button disabled={!user || !total} onClick={onCheckout}>Checkout</button>
        </section>
    )
}
