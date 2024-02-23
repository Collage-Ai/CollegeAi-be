# 使用 Node.js 的官方镜像作为基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 或 pnpm-lock.yaml
# 注意：如果您使用的是 npm，请替换为 package-lock.json
COPY package.json pnpm-lock.yaml ./

# 安装仅生产环境的依赖
RUN npm install -g pnpm
# 配置镜像源
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install --prod

# 复制构建好的 dist 目录
COPY dist ./dist

# 暴露端口
EXPOSE 3000

# 启动命令，运行编译后的应用
CMD ["node", "dist/main"]
