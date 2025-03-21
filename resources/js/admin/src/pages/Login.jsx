import { useMutation, useQuery } from "@tanstack/react-query";
import { App, Button, Col, Divider, Form, Input, Layout, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import http from "../utils/http";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Header, Content } = Layout
const hasNotfiy = false
export default function Login() {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const csrf_init = useQuery({
        queryKey: ['app-csrf-query-init'],
        queryFn: () => axios.get('/sanctum/csrf-cookie')
    })
    const login_mutation = useMutation({
        mutationKey: ['login-mutation'],
        mutationFn: (data) => http.post('/api/login', data),
        onSuccess: (data) => {
            console.log('login success', data)
            Cookies.set('access_token', data.data?.access_token, { expires: new Date(Date.now() + data.data?.expires * 60 * 1000) })
            navigate('/')
        },
        onError: (e) => {
            console.error(e)
            message.error('登录出错, 请确认填写的用户信息正确.')
        }
    });

    const validate_token_query = useMutation({
        mutationKey: ['global-validate-token-query'],
        mutationFn: () => http.get('/api/validate-token'),
        onSuccess: () => {
            navigate('/')
        },
        onError: () => {
            Cookies.remove('access_token')
            setLoading(false)
        }
    })


    const handleSubmit = async () => {
        await form.validateFields();
        const data = form.getFieldsValue()
        // console.log(data);return;

        login_mutation.mutate(data)
    }
    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            handleSubmit()
        }
    }

    useEffect(() => {
        const access_token = Cookies.get('access_token');
        if (access_token) {
            setLoading(true)
            validate_token_query.mutate()
        } else {
            setLoading(false)
            setShowContent(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <>
        {showContent ? <Layout className="h-screen">
            <Spin spinning={loading} fullscreen />
            {hasNotfiy ? <Header className="h-[40px]"></Header> : ''}
            <Content>
                <Row className="h-full" >
                    <Col span={16} >
                        <div className={`w-full h-[calc(100vh-30px)] bg-[url('/images/default/login_banner.png')] bg-center bg-auto`}></div>
                        <Divider className="!m-0" />
                        <div className="h-[30px] text-center align-middle py-[5px] border-r-[1px]">
                            copyright 2024 Bo.
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="flex justify-center align-middle self-center h-full">
                            <Form
                                form={form}
                                layout={'vertical'}
                                className="w-[70%] h-fit self-center"
                            >
                                <Form.Item name={'name'} label="用户" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={'password'} label="密码" rules={[{ required: true }]}>
                                    <Input.Password visibilityToggle={false} onKeyDown={handleKeyDown} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} onClick={handleSubmit}>登录</Button>
                                </Form.Item>
                            </Form>
                        </div>

                    </Col>
                </Row>
            </Content>
        </Layout>
            : ""}
    </>
}