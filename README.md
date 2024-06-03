## Description

后端代码仓库，使用Nest.js框架开发。

## Installation

```bash
pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

# 后端部署

## 方式一： self-hosted runner

配置好github action的self-hosted runner，然后在服务器上运行runner，即可自动部署。

## 方式二：dockerhub

在本地打包docker镜像，然后上传到dockerhub，然后拉取镜像，即可部署。

### 本地打包docker镜像

Dockerfile参考本仓库根目录下的Dockerfile。

后运行以下命令：

```bash
docker build -t collegeAi-backend .
```

### 上传到dockerhub

```bash
docker tag t1-backend:latest xxx/collegeAi-backend:latest
docker push xxx/collegeAi-backend:latest
```

## 数据库及环境变量部分
需要配置数据库，本项目使用的后端数据库为MySQL,数据库初始化语句参见db目录下。
运行docker-compose.yaml文件启动镜像，
```
docker-compose up
```
本项目使用服务器自带的数据库环境，如未配置，可安装或自行拉取数据库镜像。
环境变量参见docker-compose.yaml文件，由于发送短信等功能使用阿里云sdk,该部分功能需配置阿里云密钥等。
<!-- ### 在Rancher上拉取镜像

Rancher使用参考：
[Docker/Podman]
(<https://ncuhomer.feishu.cn/wiki/V8rMwSdaMiAQLVkMPeScinqlnse>)
[容器、服务器与集群](https://ncuhomer.feishu.cn/wiki/XHUgwk4NniIAB6kciIUcUA3inqc)

同时记得手动配置一下数据库。

> 记录一下，以备后用。 -->
