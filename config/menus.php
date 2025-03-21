<?php
return [
    [
        'label' => '首页',
        'key' => '/'
    ],
    [

        'label' => '设置',
        'key' => '/settings',
        'children' => [
            [
                'label' => '站点配置',
                'key' => '/sites'
            ],
            [
                'label' => '用户管理',
                'key' => '/user',
                'is_dev' => 1,
                'children' => [
                    [
                        'label' => '用户',
                        'key' => '/users/'
                    ],
                    [
                        'label' => '角色',
                        'key' => '/users/roles'
                    ],
                    [
                        'label' => '权限',
                        'key' => '/users/permissions'
                    ],
                    [
                        'label' => '菜单',
                        'key' => '/users/menus'
                    ]
                ]
            ]
        ]

    ]
];
