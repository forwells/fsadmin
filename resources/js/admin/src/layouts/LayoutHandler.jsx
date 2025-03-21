
import { FloatButton, Layout, App, Card, Row, Divider, Skeleton, Spin } from "antd";
import Routes from "../Routes";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import { useEffect, useState } from "react";
import Auth from "../comps/Auth";
import Nav from "./Nav";
import Logo from "./Logo";
import Toolbar from "./Toolbar";
import http from '../utils/http'
import { setUser } from '../states/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from "@tanstack/react-query";
const { Header, Content, Sider } = Layout

export default function LayoutHandler() {
    const hasNotify = false;
    const location = useLocation()
    const pages = import.meta.glob("../pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });

    const isLogin = location.pathname == '/login' ? true : false
    const dispatch = useDispatch()
    const userInformation = useMutation({
        mutationKey: ['account-information'],
        mutationFn: () => http.get('/api/user'),
        onSuccess: (data) => {
            // console.log('mutation 获取到用户信息', data.data)
            dispatch(setUser(data.data))
        }
    })

    useEffect(() => {
        if (!isLogin) {
            userInformation.mutate()
        }
    }, [isLogin, location.pathname])

    return <>
        <App>
            {
                isLogin ? <Login /> : <Auth>
                    <Layout className="h-screen">
                        {hasNotify ? <Header></Header> : ''}
                        <Sider
                            breakpoint="md"
                            className=""
                            theme={'light'}
                            // collapsible
                            collapsedWidth={0}>
                            <Logo />
                            <Nav />
                        </Sider>
                        <Layout>
                            <div className="header px-[12px] mb-[2px] h-[35px] flex justify-end items-center">
                                <Toolbar />
                            </div>
                            <Divider className="!my-0 !mb-[2px]" />
                            <Content>
                                <div className="content-wrapper h-full">
                                    <Card id="content-main" className="h-full max-h-[100%] overflow-auto">
                                        <Routes pages={pages} />
                                    </Card>
                                </div>
                            </Content>
                        </Layout>
                        <FloatButton.BackTop target={() => document.getElementById('content-main')} />
                    </Layout>
                </Auth>
            }
        </App>
    </>
}
