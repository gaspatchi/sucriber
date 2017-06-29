**Sucriber** - сервис для работы с подписками пользователя

**Примеры запросов и ответов**

----------
- `GET` /dispatch - Получение списка каналов рассылки
>Для выполнения этого запроса требуется **токен**

- `Response`
```
{
	"email": true,
	"sms": true
}
```

- `POST` /dispatch - Обновление списка каналов рассылки
>Для выполнения этого запроса требуется **токен**

- `Request`

| Параметр | Тип     | Требуется | Описание                          |
| -------- | ------- | --------- | --------------------------------- |
| email    | boolean | true      | Рассылать ли уведомления по Email |
| sms      | boolean | true      | Рассылать ли уведомления по SMS   |


- `POST` /schedule - Добавление группы или преподавателя в подписки
>Для выполнения этого запроса требуется **токен**

- `Request`

| Параметр    | Тип      | Описание                                                 |
| ----------- | -------- | -------------------------------------------------------- |
| section     | string   | При send отправляет подписку на email или sms. send/view |
| destination | string   | email/sms                                                |
| type        | string   | teacher/group                                            |
| id          | unsigned | Id группы или преподавателя                              |

- `DELETE` /schedule - Удаление группы или преподавателя из подписок
>Для выполнения этого запроса требуется **токен**

- `Request`
| Параметр    | Тип      | Описание                                                 |
| ----------- | -------- | -------------------------------------------------------- |
| section     | string   | При send отправляет подписку на email или sms. send/view |
| destination | string   | email/sms                                                |
| type        | string   | teacher/group                                            |
| id          | unsigned | Id группы или преподавателя                              |


- `GET` /schedule - Получение списка подписок пользователя
>Для выполнения этого запроса требуется **токен**

- `Response`
```
{
    "send": {
        "sms": {
            "groups": [
                {
                    "group_id": 1,
                    "group": "311",
                    "course": null
                }
            ],
            "teachers": [
                {
                    "teacher_id": 5,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            ]
        },
        "email": {
            "groups": [
                {
                    "group_id": 5,
                    "group": "511",
                    "course": null
                }
            ],
            "teachers": [
                {
                    "teacher_id": 2,
                    "firstname": "...",
                    "lastname": "...",
                    "patronymic": "..."
                }
            ]
        }
    },
    "view": {
        "groups": [
            {
                "group_id": 3,
                "group": "011",
                "course": null
            }
        ],
        "teachers": [
            {
                "teacher_id": 3,
                "firstname": "...",
                "lastname": "...",
                "patronymic": "..."
            }
        ]
    }
}
```

**HTTP коды ответа**

----------
| HTTP Код | Описание                         |
| -------- | -------------------------------- |
| 200      | Успешное выполнение запроса      |
| 400      | Сервер не смог обработать запрос |
| 403      | Токен оказался невалидным        |
| 500      | Ошибка сервера                   |