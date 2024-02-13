# User接口

## 1. 用户注册

### 1.1 请求地址

```
POST /api/user/register
```

### 1.2 请求参数

| 参数名   | 类型   | 说明   |
| -------- | ------ | ------ |
| username | string | 用户名 |
| password | string | 密码   |

### 1.3 返回结果

````
{
    code: 0,
    msg: '注册成功',
    }
    ```

    ```
    {
    code: 1,
    msg: '用户名已存在',
}
````

## 2. 用户登录

### 2.1 请求地址

```
POST /api/user/login
```

### 2.2 请求参数

| 参数名   | 类型   | 说明   |
| -------- | ------ | ------ |
| username | string | 用户名 |
| password | string | 密码   |

### 2.3 返回结果

成功

```
{
  code: 0,
  token: token,
}
```

失败

```
{
  code: 1,
  msg: '用户名或密码错误',
}
```

## 3. 获取用户信息

### 3.1 请求地址

```
GET /api/user/info
```

### 3.2 请求参数

| 参数名 | 类型   | 说明  |
| ------ | ------ | ----- |
| token  | string | token |

### 3.3 返回结果

```
{
  "id": "id",
  "username": "username",
  "password": "password"
}
```

# token过期

返回结果

```
{
    "message": "没有权限访问",
    "error": "Unauthorized",
    "statusCode": 401
}
```
