/** 获取所有数组中对象的id */
export const getAllIds = (arr = []) => {
    let keys = [];
    const loop = (nodes) => {
        nodes.forEach(node => {
            keys.push(node.id)
            if (node.children) {
                loop(node.children)
            }
        })
    }
    loop(arr)
    return keys;
}

export const sync_form_permission_ids = (form, values) => {
    form.setFieldValue('permission_ids', values)
}
export const sync_form_menu_ids = (form, values) => {
    form.setFieldValue('menu_ids', values)
}