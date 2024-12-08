#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# 检查必要的工具
check_requirements() {
    print_info "检查开发环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        exit 1
    fi
    print_info "Node.js 版本: $(node -v)"

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi
    print_info "npm 版本: $(npm -v)"

    # 检查 git
    if ! command -v git &> /dev/null; then
        print_error "git 未安装"
        exit 1
    fi
    print_info "git 版本: $(git --version)"
}

# 创建必要的目录
create_directories() {
    print_info "创建项目目录..."
    
    directories=(
        "docs"
        "components"
        "services"
        "assets"
        "config"
        "scripts"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_info "创建目录: $dir"
        else
            print_warning "目录已存在: $dir"
        fi
    done
}

# 安装依赖
install_dependencies() {
    print_info "安装项目依赖..."
    
    # 检查 package.json 是否存在
    if [ ! -f "package.json" ]; then
        print_error "package.json 不存在"
        exit 1
    }

    npm install

    if [ $? -eq 0 ]; then
        print_info "依赖安装成功"
    else
        print_error "依赖安装失败"
        exit 1
    fi
}

# 初始化 git
init_git() {
    print_info "初始化 Git..."
    
    # 如果 .git 目录不存在，初始化 git
    if [ ! -d ".git" ]; then
        git init
        print_info "Git 初始化完成"
    else
        print_warning "Git 仓库已存在"
    fi

    # 检查 .gitignore 是否存在
    if [ ! -f ".gitignore" ]; then
        print_warning ".gitignore 不存在，创建默认配置"
        cp scripts/templates/.gitignore .gitignore
    fi
}

# 配置开发环境
setup_dev_environment() {
    print_info "配置开发环境..."
    
    # 复制配置文件模板
    if [ ! -f ".env" ]; then
        cp scripts/templates/.env.example .env
        print_info "创建 .env 文件"
    fi

    # 设置 git hooks
    if [ -d ".git/hooks" ]; then
        cp scripts/git-hooks/* .git/hooks/
        chmod +x .git/hooks/*
        print_info "Git hooks 配置完成"
    fi
}

# 主函数
main() {
    print_info "开始项目初始化..."
    
    check_requirements
    create_directories
    install_dependencies
    init_git
    setup_dev_environment
    
    print_info "项目初始化完成！"
}

# 执行主函数
main