const { useSelector, useDispatch } = ReactRedux

import { TOGGLE_CART_IS_SHOWN } from '../store/reducers/car.reducer.js'

import { UserMsg } from './UserMsg.jsx'
import { ShoppingCart } from './ShoppingCart.jsx'

export function AppFooter() {
    const dispatch = useDispatch()
    const isCartShown = useSelector(storeState => storeState.carModule.isCartShown)
    const count = useSelector(storeState => storeState.userModule.count)
    const carsLength = useSelector(storeState => storeState.carModule.cars.length)
    const shoppingCartLength = useSelector(storeState => storeState.carModule.shoppingCart.length)


    return (
        <footer className='app-footer'>
            <h5>
                Currently {carsLength} cars in the shop
            </h5>
            <p>
                Coffeerights to all - Count: {count}
            </p>
            <h5>
                <span>{shoppingCartLength}</span> Products in your Cart
                <a href="#" onClick={(ev) => {
                    ev.preventDefault()
                    dispatch({ type: TOGGLE_CART_IS_SHOWN })
                }}>
                    ({(isCartShown) ? 'hide' : 'show'})
                </a>
            </h5>
            <ShoppingCart isCartShown={isCartShown} />
            <UserMsg />
        </footer>
    )
}
