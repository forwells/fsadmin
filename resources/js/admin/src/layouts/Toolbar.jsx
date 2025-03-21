import { useMutation, useQuery } from '@tanstack/react-query'
import AccountSvg from '../assets/icons/account.svg?react'
import ArrowDownSvg from '../assets/icons/arrow_down.svg?react'
import Icon from '@ant-design/icons'
import http from '../utils/http'
import { useEffect } from 'react'
import { App, Button, Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
export default function Toolbar() {
    const { message } = App.useApp()
    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    const logout_mutation = useMutation({
        mutationKey: ['mutation-user-logout'],
        mutationFn: () => http.post('/api/user/logout'),
        onSuccess: () => {
            Cookies.remove('access_token')
            navigate('/login')
        },
        onError: (error) => {
            console.error('logout failed:' + error)
        }
    })
    const handleLogout = () => {
        logout_mutation.mutate();
    }

    useEffect(() => {
        // console.log('user信息变化', user)
    }, [user])

    return <>
        <div className="user flex justify-end items-center">
            <Icon component={AccountSvg} style={{ fontSize: '24px' }} />
            <Dropdown
                trigger={'click'}
                menu={{
                    items: [{
                        key: '1',
                        label: <Button onClick={handleLogout}>退出</Button>
                    }],
                }}
            >
                <a className='inline-block' onClick={e => e.preventDefault()}>
                    {user?.name}
                    <Icon component={ArrowDownSvg} />
                </a>
            </Dropdown>
        </div >
    </>
}