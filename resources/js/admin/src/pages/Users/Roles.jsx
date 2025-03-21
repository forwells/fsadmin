import { useMutation, useQuery } from "@tanstack/react-query"
import http from "../../utils/http"
import { App, Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Space, Table, Tree } from "antd"
import { useEffect, useState } from "react"
import EditSvg from '../../assets/icons/edit_box.svg?react'
import RemoveSvg from '../../assets/icons/remove.svg?react'
import Icon from "@ant-design/icons";
import { getAllIds, sync_form_menu_ids, sync_form_permission_ids } from "../../utils/helpers"

export default function Roles() {
    const [form] = Form.useForm()
    const { message } = App.useApp()
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [permissions, setPermissions] = useState([])
    const [menus, setMenus] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([])
    const [selectedMenus, setSelectedMenus] = useState([])
    const [expandMenus, setExpandMenus] = useState([])
    const [menuIds, setMenuIds] = useState([])
    const [permissionIds, setPermissionIds] = useState([])
    const [expandPermissions, setExpandPermissions] = useState([])
    const role_list_query = useQuery({
        queryKey: ['role-list-query'],
        queryFn: () => http.get('/api/user/role')
    })
    const role_create_mutation = useMutation({
        mutationKey: ['role-create-mutation'],
        mutationFn: (data) => http.post('/api/user/role', data),
        onSuccess: (data) => {
            message.success(data.data?.msg)
            setOpen(false)
            form.resetFields()
            role_list_query.refetch()
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const role_details_query = useMutation({
        mutationKey: ['role-details-query'],
        mutationFn: (data) => http.get(`/api/user/role/${data.id}`),
        onSuccess: (data) => {
            let formdata = data.data;
            setIsEdit(true)
            form.setFieldsValue(formdata)
            formdata.permission_ids ? setSelectedPermissions(formdata.permission_ids) : setSelectedMenus([])
            formdata.menu_ids ? setSelectedMenus(formdata.menu_ids) : setSelectedMenus([])
            setExpandPermissions(permissionIds)
            setExpandMenus(menuIds)
            setOpen(true)
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const role_update_mutation = useMutation({
        mutationKey: ['role-update-mutation'],
        mutationFn: (data) => http.put(`/api/user/role/${data.id}`, data),
        onSuccess: () => {
            setIsEdit(false)
            setOpen(false)
            form.resetFields()
            role_list_query.refetch()
            message.success('角色更新成功')
        },
        onError: (err) => {
            message.error(err.response.data?.msg || err.response.data?.message)
        }
    })
    const role_destroy_mutation = useMutation({
        mutationKey: ['role-destroy-mutation'],
        mutationFn: (data) => http.delete(`/api/user/role/${data.id}`),
        onSuccess: () => {
            role_list_query.refetch()
        }
    })
    const permissions_query = useMutation({
        mutationKey: ['permissions-query'],
        mutationFn: () => http.get('/api/user/permission'),
        onSuccess: (data) => {
            let real_data = JSON.parse(JSON.stringify(data?.data))
            real_data.shift()
            let ids = getAllIds(real_data)
            setPermissionIds(ids)
            setPermissions(real_data)
            setExpandPermissions(permissionIds)
        }
    })
    const menus_query = useMutation({
        mutationKey: ['menus-query'],
        mutationFn: () => http.get('/api/user/menu'),
        onSuccess: (data) => {
            let real_data = JSON.parse(JSON.stringify(data?.data))
            real_data.shift()
            let ids = getAllIds(real_data)
            setMenuIds(ids)
            setMenus(real_data)
            setExpandMenus(menuIds)
        }
    })

    const sites_query = useMutation({
        mutationKey: ['role-sites-query'],
        mutationFn: () => http.get('/api/settings/site'),
        onSuccess: (data) => {
            console.log('站点列表', data?.data)
        }
    })

    /** @type {import('antd').TableColumnProps} */
    const role_cols = [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
        },
        {
            key: 'slug',
            dataIndex: 'slug',
            title: '标识',
        },
        {
            key: 'description',
            dataIndex: 'description',
            title: '描述',
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
                return <Button.Group >
                    <Button type={'primary'} title="Edit" icon={<Icon component={EditSvg} />} onClick={() => handleEdit(data.id)} />
                    <Button type={'default'} title="Remove" icon={<Icon component={RemoveSvg} />} onClick={() => handleRemove(data.id)} />
                </Button.Group>
            }
        },
    ];

    const handleCreate = () => {
        setIsEdit(false);
        setOpen(!open)
    }
    const handleCancel = () => {
        setOpen(!open)
        form.resetFields()
    }
    const handleSubmit = async () => {
        await form.validateFields()
        // console.log('role表单提交', form.getFieldsValue());return;
        if (isEdit) {
            role_update_mutation.mutate(form.getFieldsValue())
            return;
        }
        role_create_mutation.mutate(form.getFieldsValue())
    }
    const handleEdit = (id) => {
        console.log(id);
        role_details_query.mutate({ id: id })
    }

    const handleRemove = (id) => {
        role_destroy_mutation.mutate({ id })
    }

    const handlePermissionSelect = (keys, info) => {
        sync_form_permission_ids(form, keys)
        setSelectedPermissions(keys)
    }
    const handlePermissionCheck = (keys, info) => {
        sync_form_permission_ids(form, keys.checked)
        setSelectedPermissions(keys.checked)
    }
    const handleMenuSelect = (keys, info) => {
        sync_form_menu_ids(form, keys)
        setSelectedMenus(keys)
    }
    const handleMenuCheck = (keys, info) => {
        sync_form_menu_ids(form, keys.checked)
        setSelectedMenus(keys.checked)
    }
    const handleMenuExpand = (keys, info) => {
        setExpandMenus(keys)
    }

    const handlePermissionExpand = (keys, info) => {
        setExpandPermissions(keys)
    }

    const handleTogglePermissionSelected = (e) => {
        if (e.target.checked) {
            console.log(permissionIds)
            setSelectedPermissions(permissionIds)
            sync_form_permission_ids(form, permissionIds)
            return;
        }
        setSelectedPermissions([])
        sync_form_permission_ids([])
    }
    const handleTogglePermissionExpand = (e) => {
        if (e.target.checked) {
            setExpandPermissions(permissionIds)
            return;
        }
        setExpandPermissions([])
    }
    const handleToggleMenuSelected = (e) => {
        if (e.target.checked) {
            setSelectedMenus(menuIds)
            sync_form_menu_ids(form, menuIds)
            return;
        }
        setSelectedMenus([])
        sync_form_menu_ids(form, [])
    }
    const handleToggleMenuExpand = (e) => {
        if (e.target.checked) {
            setExpandMenus(menuIds)
            return;
        }
        setExpandMenus([])
    }

    useEffect(() => {
        permissions_query.mutate()
        menus_query.mutate()
        sites_query.mutate()
    }, []);

    return <>
        <Row className="mb-[5px]" justify={'end'}>
            <Button onClick={handleCreate}>创建角色</Button>
        </Row>
        <Table columns={role_cols} rowKey={'id'} dataSource={role_list_query.data?.data} />
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
                initialValues={{
                    permission_ids: [],
                    menu_ids: [],
                    description: ''
                }}
            >
                {isEdit ? <Form.Item hidden name={'id'}><Input /></Form.Item> : ''}
                <Form.Item label="角色名称" name={'name'} rules={[{ required: true, max: 40 }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="标识" name={'slug'} rules={[{ required: true }, { pattern: /^[a-zA-Z0-9_-]+$/, message: '仅支持字母,数字,下划线,连接线组合.' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="描述" name={'description'} rules={[{}]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label={
                    <div>
                        <span className="inline-block mr-3">权限:</span>
                        <Checkbox
                            checked={selectedPermissions.length === permissionIds.length}
                            indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < permissionIds.length}
                            onChange={handleTogglePermissionSelected}>选择所有</Checkbox>
                        <Checkbox defaultChecked={true} onChange={handleTogglePermissionExpand}>展开</Checkbox>
                    </div>
                } name={'permission_ids'}>
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
                </Form.Item>
                <Form.Item label={
                    <div>
                        <span className="inline-block mr-3">菜单:</span>
                        <Checkbox
                            checked={selectedMenus.length === menuIds.length}
                            indeterminate={selectedMenus.length > 0 && selectedMenus.length < menuIds.length}
                            onChange={handleToggleMenuSelected}>选择所有</Checkbox>
                        <Checkbox defaultChecked={true} onChange={handleToggleMenuExpand}>展开</Checkbox>
                    </div>
                } name={'menu_ids'}>
                    <Tree
                        checkable
                        checkStrictly
                        showLine
                        expandedKeys={expandMenus}
                        selectedKeys={selectedMenus}
                        onSelect={handleMenuSelect}
                        treeData={menus}
                        checkedKeys={selectedMenus}
                        onCheck={handleMenuCheck}
                        onExpand={handleMenuExpand}
                        fieldNames={{ key: 'id' }}
                        defaultExpandAll
                        multiple
                    />
                </Form.Item>
                <Form.Item label={'站点'} initialValue={[]} name={'site_ids'}>
                    <Checkbox.Group options={sites_query.data?.data} className="shadow-inner shadow-black border border-violet-600 rounded-[5px] !px-2 !py-1" />
                </Form.Item>
                <Form.Item >
                    <Button loading={role_create_mutation.isPending} onClick={handleSubmit} >提交</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>
}
