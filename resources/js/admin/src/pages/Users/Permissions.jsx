import { useMutation } from "@tanstack/react-query"
import http from "../../utils/http"
import { App, Button, Card, Col, Empty, Form, Input, Modal, Row, TreeSelect } from "antd"
import { useEffect, useRef, useState } from "react"
import Icon from "@ant-design/icons"
import ArrowDownSLineSvg from '../../assets/icons/arrow_down_s_line.svg?react'
import BoxAddLineSvg from '../../assets/icons/box_add_line.svg?react'
import BoxSubLineSvg from '../../assets/icons/box_sub_line.svg?react'
import EditSvg from '../../assets/icons/edit_box.svg?react'
import RemoveSvg from '../../assets/icons/remove.svg?react'

import Nestable from "react-nestable"

export default function Permissions() {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const nestableRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const list_query = useMutation({
        mutationKey: ['permission-list-query'],
        mutationFn: () => http.get('/api/user/permission'),
        onSuccess: (data) => {
            let real_data = JSON.parse(JSON.stringify(data?.data))
            real_data.shift()
            setItems(real_data)
        }
    })
    const permission_create_mutation = useMutation({
        mutationKey: ['permission-create-mutation'],
        mutationFn: (data) => http.post('/api/user/permission', data),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            setOpen(false)
            form.resetFields()
            list_query.mutate()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const permission_details_query = useMutation({
        mutationKey: ['permission-details-query'],
        mutationFn: (data) => http.get(`/api/user/permission/${data.id}`),
        onSuccess: (data) => {
            let formdata = data.data;
            setIsEdit(true)
            form.setFieldsValue(formdata)
            setOpen(true)
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const permission_update_mutation = useMutation({
        mutationKey: ['permission-update-mutation'],
        mutationFn: (data) => http.put(`/api/user/permission/${data.id}`, data),
        onSuccess: () => {
            setIsEdit(false)
            setOpen(false)
            form.resetFields()
            list_query.mutate()
            message.success('权限更新成功')
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })

    const permission_sort_update_mutation = useMutation({
        mutationKey: ['menu-update-mutation'],
        mutationFn: (data) => http.post(`/api/user/permission/sort`, data),
        onSuccess: (data) => {
            message.success(data?.data?.msg)
            list_query.mutate()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })

    const destory_mutation = useMutation({
        mutationKey: ['permission-destory-mutation'],
        mutationFn: (data) => http.delete(`/api/user/permission/${data.id}`),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            list_query.mutate()
        }
    })

    const handleCreate = () => {
        setIsEdit(false)
        setOpen(!open)
    }
    const handleCancel = () => {
        setOpen(!open)
        form.resetFields()
    }
    const handleSubmit = async () => {
        await form.validateFields()
        // console.log('提交权限变更表单', form.getFieldValue()); return;
        if (isEdit) {
            permission_update_mutation.mutate(form.getFieldsValue())
            return;
        }
        permission_create_mutation.mutate(form.getFieldsValue())
    }
    const handleEdit = (id) => {
        console.log(id);
        permission_details_query.mutate({ id: id })
    }
    const renderItem = ({ item, collapseIcon }) => (<div className="nestable-items-wrapper flex items-center border rounded-[5px] px-2 py-1">
        <div className="mr-[3px]">{collapseIcon}</div>
        <div className="grow flex items-center justify-between">
            <div className="label">{item.label}</div>
            <div className="actions">
                <Button size={'small'} icon={<Icon component={EditSvg} />} onClick={() => handleEdit(item.id)} />
                <Button size={'small'} icon={<Icon component={RemoveSvg} />} onClick={() => handleRemove(item.id)} />
            </div>
        </div>
    </div>)
    const handleTreeChange = (ev) => {
        setItems(ev.items)
    }
    const handleSaveSort = () => {
        permission_sort_update_mutation.mutate({ items: items })
    }
    const handleExpand = () => {
        nestableRef.current.collapse('NONE')
    }
    const handleCollapse = () => {
        nestableRef.current.collapse('ALL')
    }
    const handleRefresh = () => {
        list_query.mutate()
    }
    const handleRemove = (id) => {
        destory_mutation.mutate({ id })
    }

    useEffect(() => {
        list_query.mutate()
    }, [])
    const public_form = ({ form }) => (
        <Form
            form={form}
            layout={'vertical'}
            autoComplete='off'
        >
            {isEdit ? <Form.Item hidden name={'id'}><Input /></Form.Item> : ''}
            {
                !isEdit
                    ? <Form.Item label="父级权限" name={'parent_id'} rules={[{ required: true }]}>
                        <TreeSelect loading={list_query.isFetching || list_query.isLoading} treeDefaultExpandAll treeData={list_query.data?.data} />
                    </Form.Item>
                    : ''
            }
            <Form.Item label="权限名称" name={'name'} rules={[{ required: true, max: 40 }]}>
                <Input />
            </Form.Item>
            <Form.Item label="标识" name={'slug'} rules={[{ required: true }, { pattern: /^[a-zA-Z0-9_-]+$/, message: '仅支持字母,数字,下划线,连接线组合.' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="描述" name={'description'} rules={[{}]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item >
                <Button loading={permission_create_mutation.isPending} onClick={handleSubmit} >提交</Button>
            </Form.Item>
        </Form>
    )


    return <>
        <Row className="mb-[5px]" justify={'end'}>
            <Button onClick={handleCreate}>创建权限</Button>
        </Row>

        <Row gutter={20}>
            <Col span={24}>
                <Row className="mb-[8px]">
                    <Button.Group className="mr-[15px]">
                        <Button onClick={handleExpand} icon={<Icon component={BoxAddLineSvg} />}>展开</Button>
                        <Button onClick={handleCollapse} icon={<Icon component={BoxSubLineSvg} />}>合并</Button>
                    </Button.Group>
                    <Button className="mr-[5px]" type={'primary'} onClick={handleSaveSort}>保存</Button>
                    <Button onClick={handleRefresh}>刷新</Button>
                </Row>
                <Card loading={list_query.isPending}>
                    {
                        items.length
                            ? <Nestable
                                ref={nestableRef}
                                collapsed={false}
                                items={items}
                                maxDepth={3}
                                renderItem={renderItem}
                                onChange={handleTreeChange}
                                renderCollapseIcon={({ isCollapsed }) => isCollapsed
                                    ? <Icon component={ArrowDownSLineSvg} style={{ transform: 'rotate(-90deg)', transition: 'all .3s' }} />
                                    : <Icon component={ArrowDownSLineSvg} style={{ transition: 'all .3s' }} />}
                            />
                            : <Empty />
                    }
                </Card>
            </Col>
        </Row>
        <Modal
            maskClosable={false}
            open={open}
            footer={null}
            onCancel={handleCancel}
            forceRender
        >
            {public_form({ form })}
        </Modal>
    </>
}
