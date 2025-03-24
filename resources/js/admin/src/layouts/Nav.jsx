import { Menu } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Nav() {
    const navigate = useNavigate()
    const location = useLocation()
    const [menus, setMenus] = useState([])
    const [selectedKeys, setSelectedKeys] = useState([])
    const [openKeys, setOpenKeys] = useState([], (prev, next) => prev.menus === next.menus)
    const user = useSelector(state => state.user.user)
    const handleNav = (e) => {
        console.log('菜单点击', e);
        navigate(e.key)
    }

    /** Find Menus */
    const findParentKeys = (path, items) => {

        for (let i in items) {
            // 一级匹配
            if (items[i].key == path) {
                return [items[i].key];
            }
            if (items[i].children) {
                const child_path = findParentKeys(path, items[i].children);
                if (child_path.length > 0) {
                    return [items[i].key, ...child_path];
                }
            }
        }
        return [];
    }

    /** Find item by key */
    const findCurrentKeyItem = (key, items) => {
        for (let i in items) {
            // 一级匹配
            if (items[i].key == key) {
                return items[i];
            }
            if (items[i].children) {
                return findCurrentKeyItem(key, items[i].children);
            }
        }
    }

    /** Expand with default select route */
    const handleOpenkeys = (keys) => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        // console.log(latestOpenKey);
        if (latestOpenKey) {
            let current_item = findCurrentKeyItem(latestOpenKey, menus)
            // console.log('cl',current_item);
            current_item ? navigate(current_item.default) : ''

        }

        setOpenKeys(keys)
    }

    useEffect(() => {
        const path = location.pathname

        // console.log(
        //     '当前pathname', path,
        //     '选中的key', path.substring(1)
        // );
        setSelectedKeys([path])
        const parentKeys = findParentKeys(path, menus);
        // console.log('父级菜单key', parentKeys);
        setOpenKeys([...parentKeys, ...openKeys])
    }, [location.pathname, menus])

    useEffect(() => {
        if (user?.menus) {
            // const final_menu_items = [...menu_items];
            // final_menu_items.splice(1, 0, ...user.menus)
            // console.log(final_menu_items)
            // setMenus(final_menu_items)
            setMenus(user.menus)
        }
    }, [user])

    return <Menu
        className="border-b-0"
        onClick={handleNav}
        mode={'inline'}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        items={menus}
        multiple
        onOpenChange={handleOpenkeys}
    />
}
