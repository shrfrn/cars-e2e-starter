const { useState } = React
const { useSelector, useDispatch } = ReactRedux

import { CHANGE_BY } from "../store/reducers/user.reducer.js"

export function HomePage() {
    const dispatch = useDispatch()
    const [_count, setCount] = useState(10)
    const count = useSelector(storeState => storeState.count)

    function changeCount(diff) {
        dispatch({ type: CHANGE_BY, diff })
    }

    return (
        <section>
            <h2>
                Count {count}
                <button onClick={() => {
                    changeCount(1)
                }}>+</button>
                <button onClick={() => {
                    changeCount(10)
                }}>+10</button>
            </h2 >
            <img src="assets/img/logo.png" />
        </section >
    )
}