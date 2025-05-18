import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
    const [message, setMessage] = useState("Загрузка...")

    useEffect(() => {
        axios.get('/status')
            .then(response => setMessage(response.data))
            .catch(() => setMessage("Ошибка подключения к серверу"))
    }, [])

    return (
        <div>
            <h1>{message}</h1>
        </div>
    )
}

export default App
