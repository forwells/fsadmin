import { useMutation, useQuery } from "@tanstack/react-query"
import http from "../../utils/http"
import { App, Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Switch, Table } from "antd"
import { useEffect, useState } from "react"
import EditSvg from '../../assets/icons/edit_box.svg?react'
import RemoveSvg from '../../assets/icons/remove.svg?react'
import Icon from "@ant-design/icons"

export default function Index() {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [pwdEnable, setPwdEnable] = useState(false)
    const user_list_query = useQuery({
        queryKey: ['query-key'],
        queryFn: () => http.get('/api/user/rs')
    })
    const user_create_mutation = useMutation({
        mutationKey: ['user-create-mutation'],
        mutationFn: (data) => http.post('/api/user/rs', data),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            setOpen(false)
            form.resetFields()
            user_list_query.refetch()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const user_details_query = useMutation({
        mutationKey: ['user-details-query'],
        mutationFn: (data) => http.get(`/api/user/rs/${data.id}`),
        onSuccess: (data) => {
            let formdata = data.data;
            formdata.password = null
            setIsEdit(true)
            form.setFieldsValue(formdata)
            setOpen(true)
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const user_update_mutation = useMutation({
        mutationKey: ['user-update-mutation'],
        mutationFn: (data) => http.put(`/api/user/rs/${data.id}`, data),
        onSuccess: () => {
            setIsEdit(false)
            setOpen(false)
            form.resetFields()
            user_list_query.refetch()
            message.success('用户更新成功')
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })

    const roles_query = useMutation({
        mutationKey: ['roles-query'],
        mutationFn: () => http.get('/api/user/role'),
        onSuccess: (data) => {
        }
    })
    /** @type {import('antd').TableColumnProps} */
    const user_cols = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
        },
        {
            key: 'email',
            dataIndex: 'email',
            title: '邮箱',
        },
        {
            key: 'created_at',
            dataIndex: 'created_at',
            title: '创建时间',
        },
        {
            key: 'updated_at',
            dataIndex: 'updated_at',
            title: '更新时间',
        },
        {
            key: 'operation',
            title: '',
            render: (_, data) => {
                return <Button.Group>
                    <Button onClick={() => handleEdit(data.id)} icon={<Icon component={EditSvg} />} title={'编辑'} />
                    <Button onClick={() => handleRemove(data.id)} icon={<Icon component={RemoveSvg} />} title={'删除'} />
                </Button.Group >
            }
        },
    ];

    const handleCreate = () => {
        setOpen(!open)
    }
    const handleCancel = () => {
        setOpen(!open)
        form.resetFields()
    }
    const handleSubmit = async () => {
        await form.validateFields()
        // console.log(form.getFieldsValue());
        // return;
        if (isEdit) {
            user_update_mutation.mutate(form.getFieldsValue())
            return;
        }
        user_create_mutation.mutate(form.getFieldsValue())
    }
    const handleEdit = (id) => {
        console.log(id);
        user_details_query.mutate({ id: id })
    }
    const handleRemove = (id) => {

    }

    useEffect(() => {
        roles_query.mutate()
    }, [])
    return <>
        <Row className="mb-[5px]" justify={'end'}>
            <Button onClick={handleCreate}>创建用户</Button>
        </Row>
        <Table columns={user_cols} rowKey={'id'} dataSource={user_list_query.data?.data} />
        <Modal
            maskClosable={false}
            open={open}
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                layout={'vertical'}
                autoComplete='off'
            >
                {isEdit ? <Form.Item hidden name={'id'}><Input /></Form.Item> : ''}
                <Form.Item label="用户名" name={'name'} rules={[{ required: true, max: 40 }]} tooltip={'如需修改用户名, 请联系运维'}>
                    <Input disabled={isEdit} />
                </Form.Item>
                <Form.Item label="邮箱" name={'email'} rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name={'password'} initialValue={null} rules={[{ required: !isEdit, min: 6, max: 20 }]}>
                    <Space direction={'horizontal'}>
                        <Input.Password autoComplete="new-password" visibilityToggle={false} placeholder="****" />
                        {isEdit ? <Switch defaultChecked={false} onChange={() => setPwdEnable(!pwdEnable)} /> : ''}
                    </Space>
                </Form.Item>
                <Form.Item label="角色" name={'role_ids'} initialValue={[]} rules={[]}>
                    <Select allowClear optionFilterProp="label" options={roles_query.data?.data} mode={'multiple'} />
                </Form.Item>
                <Form.Item >
                    <Button loading={user_create_mutation.isPending} onClick={handleSubmit} >提交</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}
