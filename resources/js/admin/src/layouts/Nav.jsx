import { Menu } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import menu_items from "../config/menu_items"
import { useSelector } from "react-redux"

export default function Nav() {
    const navigate = useNavigate()
    const location = useLocation()
    const [menus, setMenus] = useState([])
    const [selectedKeys, setSelectedKeys] = useState([])
    const [openKeys, setOpenKeys] = useState([], (prev, next) => prev.menus === next.menus)
    const user = useSelector(state => state.user.user)
    const handleNav = (e) => {
        navigate(e.key)
    }

    /** 递归寻路 */
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
        onOpenChange={keys => setOpenKeys(keys)}
    />
}
