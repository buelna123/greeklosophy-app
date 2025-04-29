<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
        'allowed_origins' => [
            'https://greeklosophy-app-good.vercel.app',
            'https://greeklosophy.vercel.app',
            'https://www.greeklosophy.com',
            'https://greeklosophy.com',
        ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
