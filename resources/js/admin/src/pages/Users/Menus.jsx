import { useMutation, useQuery } from "@tanstack/react-query"
import http from "../../utils/http"
import { App, Button, Card, Checkbox, Col, Empty, Form, Input, Modal, Row, Tree, TreeSelect } from "antd"
import Nestable from 'react-nestable'
import 'react-nestable/dist/styles/index.css';
import '../../assets/css/nestable.change.css'
import ArrowDownSLineSvg from '../../assets/icons/arrow_down_s_line.svg?react'
import BoxAddLineSvg from '../../assets/icons/box_add_line.svg?react'
import BoxSubLineSvg from '../../assets/icons/box_sub_line.svg?react'
import EditSvg from '../../assets/icons/edit_box.svg?react'
import RemoveSvg from '../../assets/icons/remove.svg?react'
import EyeSvg from '../../assets/icons/eye.svg?react'
import EyeOffSvg from '../../assets/icons/eye_off.svg?react'
import { useEffect, useRef, useState } from "react"
import Icon from "@ant-design/icons";
// import { getAllIds, sync_form_permission_ids } from "../../utils/helpers";

export default function Menus() {
    const [createForm] = Form.useForm()
    const [editForm] = Form.useForm()
    const { message } = App.useApp()
    const nestableRef = useRef(null)
    const [items, setItems] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [open, setOpen] = useState(false)

    // const [permissions, setPermissions] = useState([])
    // const [selectedPermissions, setSelectedPermissions] = useState([])
    // const [permissionIds, setPermissionIds] = useState([])
    // const [expandPermissions, setExpandPermissions] = useState([])

    const list_query = useMutation({
        mutationKey: ['menu-list-query'],
        mutationFn: () => http.get('/api/user/menu'),
        onSuccess: (data) => {
            let real_data = JSON.parse(JSON.stringify(data?.data))
            real_data.shift()
            setItems(real_data)
        }
    })
    const menu_create_mutation = useMutation({
        mutationKey: ['menu-create-mutation'],
        mutationFn: (data) => http.post('/api/user/menu', data),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            createForm.resetFields()
            list_query.mutate()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const menu_details_query = useMutation({
        mutationKey: ['menu-details-query'],
        mutationFn: (data) => http.get(`/api/user/menu/${data.id}`),
        onSuccess: (data) => {
            let formdata = data.data;
            setIsEdit(true)
            setOpen(true)
            // setSelectedPermissions(formdata.permission_ids)
            // setExpandPermissions(permissionIds)
            editForm.setFieldsValue(formdata)
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const menu_update_mutation = useMutation({
        mutationKey: ['menu-update-mutation'],
        mutationFn: (data) => http.put(`/api/user/menu/${data.id}`, data),
        onSuccess: () => {
            setIsEdit(false)
            createForm.resetFields()
            list_query.mutate()
            message.success('菜单更新成功')
            setOpen(false)
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })

    const menu_sort_update_mutation = useMutation({
        mutationKey: ['menu-update-mutation'],
        mutationFn: (data) => http.post(`/api/user/menu/sort`, data),
        onSuccess: (data) => {
            message.success(data?.data?.msg)
            list_query.mutate()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })

    const destory_mutation = useMutation({
        mutationKey: ['menu-destory-mutation'],
        mutationFn: (data) => http.delete(`/api/user/menu/${data.id}`),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            list_query.mutate()
        }
    })
    const view_change_mutation = useMutation({
        mutationKey: ['menu-view-change-mutation'],
        mutationFn: (data) => http.post(`/api/user/menu/${data.id}/view_change`),
        onSuccess: () => {
            list_query.mutate()
        }
    })

    // const permissions_query = useMutation({
    //     mutationKey: ['permissions-query'],
    //     mutationFn: () => http.get('/api/user/permission'),
    //     onSuccess: (data) => {
    //         let real_data = JSON.parse(JSON.stringify(data?.data))
    //         real_data.shift()
    //         let ids = getAllIds(real_data)
    //         setPermissionIds(ids)
    //         setPermissions(real_data)
    //         setExpandPermissions(permissionIds)
    //     }
    // })

    const handleSubmit = async () => {

        // console.log('表单数据', form.getFieldsValue())
        // return;
        if (isEdit) {
            await editForm.validateFields()
            menu_update_mutation.mutate(editForm.getFieldsValue())
            return;
        }
        await createForm.validateFields()
        menu_create_mutation.mutate(createForm.getFieldsValue())
    }
    const handleEdit = (id) => {
        console.log(id);
        menu_details_query.mutate({ id: id })
    }

    const handleRemove = (id) => {
        destory_mutation.mutate({ id })
    }
    const handleViewChange = (id) => {
        view_change_mutation.mutate({ id })
    }
    const handleCancel = () => {
        setOpen(!open)
        setIsEdit(false);
        editForm.resetFields()
    }
    const renderItem = ({ item, collapseIcon }) => <div className="nestable-items-wrapper flex items-center border rounded-[5px] px-2 py-1">
        <div className="mr-[3px]">{collapseIcon}</div>
        <div className="grow flex items-center justify-between">
            <div className="label">{item.label}</div>
            <div className="actions">
                <Button size={'small'} icon={<Icon component={EditSvg} />} onClick={() => handleEdit(item.id)} />
                <Button size={'small'} icon={<Icon component={RemoveSvg} />} onClick={() => handleRemove(item.id)} />
                <Button size={'small'} icon={<Icon component={item.show ? EyeSvg : EyeOffSvg} />} onClick={() => handleViewChange(item.id)} />
            </div>
        </div>
    </div>
    const handleTreeChange = (ev) => {
        setItems(ev.items)
    }

    const handleSaveSort = () => {
        menu_sort_update_mutation.mutate({ items: items })
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

    // const handlePermissionSelect = (keys, info) => {
    //     sync_form_permission_ids(isEdit ? editForm : form, keys)
    //     setSelectedPermissions(keys)
    // }
    // const handlePermissionCheck = (keys, info) => {
    //     sync_form_permission_ids(isEdit ? editForm : form, keys.checked)
    //     setSelectedPermissions(keys.checked)
    // }

    // const handlePermissionExpand = (keys, info) => {
    //     setExpandPermissions(keys)
    // }


    // const handleTogglePermissionSelected = (e) => {
    //     if (e.target.checked) {
    //         console.log(permissionIds)
    //         setSelectedPermissions(permissionIds)
    //         sync_form_permission_ids(isEdit ? editForm : form, permissionIds)
    //         return;
    //     }
    //     setSelectedPermissions([])
    //     sync_form_permission_ids(isEdit ? editForm : form, [])
    // }
    // const handleTogglePermissionExpand = (e) => {
    //     if (e.target.checked) {
    //         setExpandPermissions(permissionIds)
    //         return;
    //     }
    //     setExpandPermissions([])
    // }
    useEffect(() => {
        list_query.mutate()
        // permissions_query.mutate()
    }, [])

    const public_form = ({ form }) => (
        <Form
            form={form}
            layout={'vertical'}
            autoComplete='off'
        >
            {isEdit ? <Form.Item hidden name={'id'}><Input /></Form.Item> : ''}
            {form == editForm ? '' : <Form.Item label="父级菜单" name={'parent_id'} rules={[{ required: true }]}>
                <TreeSelect loading={list_query.isFetching || list_query.isLoading} treeDefaultExpandAll treeData={list_query.data?.data} />
            </Form.Item>}
            <Form.Item label="菜单名称" name={'label'} rules={[{ required: true, max: 40 }]}>
                <Input />
            </Form.Item>
            <Form.Item label="路由" name={'uri'} rules={[{ required: true }, { pattern: /^[a-zA-Z0-9/_-]+$/, message: '仅支持字母,数字,下划线,连接线组合.' }]}>
                <Input />
            </Form.Item>
            {/* <Form.Item label={
                <div>
                    <span className="inline-block mr-3">权限:</span>
                    <Checkbox
                        checked={selectedPermissions.length === permissionIds.length}
                        indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < permissionIds.length}
                        onChange={handleTogglePermissionSelected}>选择所有</Checkbox>
                    <Checkbox defaultChecked={true} onChange={handleTogglePermissionExpand}>展开</Checkbox>
                </div>
            } initialValue={[]} name={'permission_ids'}>
                <Tree
                    checkable
                    checkStrictly
                    showLine
                    expandedKeys={expandPermissions}
                    selectedKeys={selectedPermissions}
                    onSelect={handlePermissionSelect}
                    treeData={permissions}
                    checkedKeys={selectedPermissions}
                    onCheck={handlePermissionCheck}
                    onExpand={handlePermissionExpand}
                    fieldNames={{ key: 'id' }}
                    defaultExpandAll
                    multiple
                />
            </Form.Item> */}
            <Form.Item >
                <Button loading={menu_create_mutation.isPending} onClick={handleSubmit} >提交</Button>
            </Form.Item>
        </Form>
    )

    return <>
        <Row gutter={20}>
            <Col xs={24} md={15} lg={15} xl={15} xxl={15}>
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
            <Col xs={24} md={9} lg={9} xl={9} xxl={9}>
                <Card title={'新增菜单'} size={'small'}>
                    {public_form({ form: createForm })}
                </Card>
            </Col>
        </Row>
        <Modal
            maskClosable={false}
            open={open}
            footer={null}
            onCancel={handleCancel}
        >
            {public_form({ form: editForm })}
        </Modal>
    </>
}
