<?php

return [
    'configs' => [
        [
            /*
             *该包支持多个 webhook 接收端点。如果你只有
             *一个端点接收webhooks，可以使用“default”。
             */
            'name' => 'default',

            /*
             *我们希望每个 Webhook 调用都将使用密钥进行签名。这个秘密
             *用于验证有效负载未被篡改。
             */
            'signing_secret' => env('WEBHOOK_CLIENT_SECRET'),

            /*
             *包含签名的标头名称。
             */
            'signature_header_name' => 'Signature',

            /*
             *该类将验证签名头的内容是否有效。
             *
             *它应该实现 \Spatie\WebhookClient\SignatureValidator\SignatureValidator
             */
            'signature_validator' => \Spatie\WebhookClient\SignatureValidator\DefaultSignatureValidator::class,

            /*
             *此类确定是否应存储和处理 webhook 调用。
             */
            'webhook_profile' => \Spatie\WebhookClient\WebhookProfile\ProcessEverythingWebhookProfile::class,

            /*
             *此类确定有效 Webhook 调用的响应。
             */
            'webhook_response' => \Spatie\WebhookClient\WebhookResponse\DefaultRespondsTo::class,

            /*
             *用于存储 webhook 调用的模型的类名。class应该
             *等于或扩展 Spatie\WebhookClient\Models\WebhookCall。
             */
            'webhook_model' => \Spatie\WebhookClient\Models\WebhookCall::class,

            /*
             *在此数组中，您可以传递应存储的标头
             *webhook 进来时的 webhook 调用模型。
             *
             *要存储所有标头，请将此值设置为“*”。
             */
            'store_headers' => [],

            /*
             *将处理 webhook 请求的作业的类名称。
             *
             *应将其设置为扩展 \Spatie\WebhookClient\Jobs\ProcessWebhookJob 的类。
             */
            'process_webhook_job' => '',
        ],
        [
            /*
             *该包支持多个 webhook 接收端点。如果你只有
             *一个端点接收webhooks，可以使用“default”。
             */
            'name' => 'shopify',

            /*
             *我们希望每个 Webhook 调用都将使用密钥进行签名。这个秘密
             *用于验证有效负载未被篡改。
             */
            'signing_secret' => env('WEBHOOK_CLIENT_SECRET'),

            /*
             *包含签名的标头名称。
             */
            'signature_header_name' => 'Signature',

            /*
             *该类将验证签名头的内容是否有效。
             *
             *它应该实现 \Spatie\WebhookClient\SignatureValidator\SignatureValidator
             */
            'signature_validator' => \Spatie\WebhookClient\SignatureValidator\DefaultSignatureValidator::class,

            /*
             *此类确定是否应存储和处理 webhook 调用。
             */
            'webhook_profile' => \Spatie\WebhookClient\WebhookProfile\ProcessEverythingWebhookProfile::class,

            /*
             *此类确定有效 Webhook 调用的响应。
             */
            'webhook_response' => \Spatie\WebhookClient\WebhookResponse\DefaultRespondsTo::class,

            /*
             *用于存储 webhook 调用的模型的类名。class应该
             *等于或扩展 Spatie\WebhookClient\Models\WebhookCall。
             */
            'webhook_model' => \Spatie\WebhookClient\Models\WebhookCall::class,

            /*
             *在此数组中，您可以传递应存储的标头
             *webhook 进来时的 webhook 调用模型。
             *
             *要存储所有标头，请将此值设置为“*”。
             */
            'store_headers' => [],

            /*
             *将处理 webhook 请求的作业的类名称。
             *
             *应将其设置为扩展 \Spatie\WebhookClient\Jobs\ProcessWebhookJob 的类。
             */
            'process_webhook_job' => '',
        ],
    ],

    /*
     *应删除模型的整数天数。
     *
     *30 天后删除所有记录。如果不应删除任何模型，则设置为 null。
     */
    'delete_after_days' => 30,

    /*
     *是否应将唯一标记添加到路线名称中
     */
    'add_unique_token_to_route_name' => false,
];
