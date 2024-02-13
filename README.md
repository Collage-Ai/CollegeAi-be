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

配置好github action的self-hosted runner，然后在服务器上运行runner，即可自动部署。但由于未给NCUHOME-Y开通self-hosted runner，所以暂时无法使用该方式部署。

## 方式二：dockerhub

在本地打包docker镜像，然后上传到dockerhub，然后在Rancher上拉取镜像，即可部署。

### 本地打包docker镜像

Dockerfile参考本仓库根目录下的Dockerfile。

后运行以下命令：

```bash
docker build -t t1-backend .
```

### 上传到dockerhub

```bash
docker tag t1-backend:latest ncuhome/t1-backend:latest
docker push ncuhome/t1-backend:latest
```

### 在Rancher上拉取镜像

Rancher使用参考：
[Docker/Podman]
(<https://ncuhomer.feishu.cn/wiki/V8rMwSdaMiAQLVkMPeScinqlnse>)
[容器、服务器与集群](https://ncuhomer.feishu.cn/wiki/XHUgwk4NniIAB6kciIUcUA3inqc)

同时记得手动配置一下数据库。

> 记录一下，以备后用。
