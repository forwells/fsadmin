import { useEffect } from "react"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"
export default function Auth({ children }) {
    const navigate = useNavigate()
    useEffect(() => {
        const token = Cookies.get('access_token')
        if (!token) {
            navigate('/login');
        }
    }, [navigate])
    return <>
        {children}
    </>
}