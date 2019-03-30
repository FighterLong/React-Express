import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem =
    ({ path, name, icon, ...props }) =>
        <Menu.Item
            key={name}
            title={name}
            {...props}
        >
            <Link to={`/${path}`} replace>
                {icon && <Icon type={icon} />}
                <span className="nav-text">{name}</span>
            </Link>
        </Menu.Item>;

const renderSubMenu =
    ({name, submenu, icon, ...props }) =>
        <Menu.SubMenu
            key={name}
            title={
                <span>
                    {icon && <Icon type={icon} />}
                    <span className="nav-text">{name}</span>
                </span>
            }
            {...props}
        >
            {submenu && submenu.map(
              item => (item.submenu && item.submenu.length)
              ?
              renderSubMenu(item)
              :
              renderMenuItem(item))}
        </Menu.SubMenu>;

export default ({ menus, ...props }) => <Menu {...props}>
    {menus && menus.map(
        item => (item.submenu && item.submenu.length) ?
            renderSubMenu(item) : renderMenuItem(item)
    )}
</Menu>;