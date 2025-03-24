<?php
return [
    [
        'label' => '首页',
        'key' => '/'
    ],
    [

        'label' => '设置',
        'key' => '/settings',
        'default' => '/settings/general',
        'children' => [
            [
                'label' => '通用',
                'key' => '/settings/general',
            ],
            [
                'label' => '用户管理',
                'key' => '/user',
                'default' => '/users/',
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
            ],

        ]

    ]
];
