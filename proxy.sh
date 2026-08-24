#!/bin/bash

# ============================================================
# 脚本功能：
# 1. 设置终端代理别名（proxy / unproxy），端口 7897
# 2. 配置 Git 全局 user.name / user.email / safe.directory
# ============================================================

# ---------- 1. 检测 Shell 并写入代理别名 ----------
if [ -n "$ZSH_VERSION" ]; then
    RC_FILE="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    RC_FILE="$HOME/.bashrc"
else
    echo "⚠️  未识别到 zsh 或 bash，请手动将以下内容添加到你的 shell 配置文件中："
    cat << 'MANUAL'
# 代理设置
alias proxy='export http_proxy=http://127.0.0.1:7897; export https_proxy=http://127.0.0.1:7897; echo "✅ 代理已开启 (7897)"; echo "🌍 当前IP信息:"; curl -s https://myip.ipip.net'
alias unproxy='unset http_proxy; unset https_proxy; echo "❌ 代理已关闭"'
MANUAL
    exit 1
fi

# 检查是否已存在 proxy 别名（避免重复追加）
if grep -q "^alias proxy=" "$RC_FILE" 2>/dev/null; then
    echo "✅ 代理别名已在 $RC_FILE 中存在，跳过。"
else
    echo "📝 正在添加代理别名到 $RC_FILE ..."
    cat >> "$RC_FILE" << 'EOF'

# 代理设置（端口 7897）
alias proxy='export http_proxy=http://127.0.0.1:7897; export https_proxy=http://127.0.0.1:7897; echo "✅ 代理已开启 (7897)"; echo "🌍 当前IP信息:"; curl -s https://myip.ipip.net'
alias unproxy='unset http_proxy; unset https_proxy; echo "❌ 代理已关闭"'
EOF
    echo "✅ 代理别名添加成功。"
fi

# ---------- 2. 配置 Git 全局设置 ----------
echo ""
echo "🔧 正在检查 Git 是否已安装..."

if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先运行以下命令安装 Git："
    echo "    brew install git"
    echo "（或访问 https://git-scm.com/download/mac 下载安装）"
    echo "安装完成后，再重新运行此脚本设置 Git 配置。"
else
    echo "✅ Git 已安装，开始设置全局配置..."

    # 设置安全目录（允许所有目录，避免 “dubious ownership” 警告）
    git config --global safe.directory '*'
    # 设置用户名和邮箱（按你提供的信息）
    git config --global user.name "哇唧唧哇"
    git config --global user.email "wajijiwa@users.noreply.github.com"

    # 设置 Git 全局代理（端口 7897），推送/拉取 GitHub 自动走代理
    git config --global http.proxy http://127.0.0.1:7897
    git config --global https.proxy http://127.0.0.1:7897

    # 启用 macOS 钥匙串凭据助手（推送 GitHub 自动读取已保存的 Token）
    git config --global credential.helper osxkeychain

    echo "✅ Git 全局配置设置完成："
    echo "   user.name  = $(git config --global user.name)"
    echo "   user.email = $(git config --global user.email)"
    echo "   safe.directory = $(git config --global safe.directory)"
    echo "   http.proxy  = $(git config --global http.proxy)"
    echo "   credential.helper = $(git config --global credential.helper)"
fi

# ---------- 3. 设置 GitHub 凭据（Token）----------
# 说明：macOS 重装系统后钥匙串会被清空，导致 git push 需要重新认证。
# 本脚本在钥匙串缺失时会提示用户手动粘贴 Token，并存入钥匙串，
# 之后所有项目的 git push 都无需再输凭据。
echo ""
echo "🔑 正在检查 GitHub 凭据是否已存在..."
GITHUB_USER="Giaosm"
if printf 'protocol=https\nhost=github.com\n\n' | git credential-osxkeychain get 2>/dev/null | grep -q "^username="; then
    echo "✅ GitHub 凭据已存在，无需重复设置。"
else
    echo "⚠️  检测到 GitHub 凭据缺失，需要您手动提供 Token。"
    echo ""
    echo "    生成 Token 的步骤（可直接点击下方链接在浏览器打开）："
    echo "    https://github.com/settings/tokens/new"
    echo ""
    echo "    在该页面："
    echo "      1. Note 随便填（如 proxy-setup）"
    echo "      2. Expiration 选 No expiration（永久）"
    echo "      3. 勾选 repo 权限"
    echo "      4. 点 Generate token，复制生成的 ghp_ 开头的字符串"
    echo ""
    read -r -p "请粘贴 GitHub Token（ghp_ 开头）: " GH_TOKEN
    if [ -n "$GH_TOKEN" ]; then
        printf 'protocol=https\nhost=github.com\nusername=%s\npassword=%s\n\n' "$GITHUB_USER" "$GH_TOKEN" | git credential-osxkeychain store
        echo "✅ GitHub Token 已存入钥匙串，之后 git push 无需再认证。"
    else
        echo "⚠️  未输入 Token，跳过。之后推送时需手动认证一次。"
    fi
fi

# ---------- 4. 提示生效 ----------
echo ""
echo "🎉 所有配置已完成！"
echo "请执行以下命令使代理别名立即生效（或重新打开终端）："
echo "    source $RC_FILE"
echo ""
echo "之后即可使用："
echo "    proxy    —— 开启代理并显示当前 IP 归属地"
echo "    unproxy  —— 关闭代理"
echo ""
echo "Git 全局配置（含代理、钥匙串凭据）已配置完成，无需额外操作。"