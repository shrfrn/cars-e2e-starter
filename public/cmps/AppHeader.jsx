const { NavLink } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { TOGGLE_CART_IS_SHOWN } from '../store/reducers/car.reducer.js'
import { logout } from '../store/actions/user.actions.js'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
    const dispatch = useDispatch()
    const user = useSelector(storeState => storeState.userModule.loggedInUser)

    function onLogout() {
        logout()
            .then(() => {
                showSuccessMsg('logout successfully')
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function onToggleCart(ev) {
        ev.preventDefault()
        dispatch({ type: TOGGLE_CART_IS_SHOWN })
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Car App</h1>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/car" >Cars</NavLink>
                    <a onClick={onToggleCart} href="#">🛒 Cart</a>

                </nav>
            </section>
            {user ? (
                < section >
                    <span to={`/user/${user._id}`}>Hello {user.fullname} <span>${user.score.toLocaleString()}</span></span>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup />
                </section>
            )}
            <UserMsg />
        </header>
    )
}
