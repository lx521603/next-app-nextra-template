#!/bin/bash

echo "=== 快速解决冲突 ==="

# package.json: 用上游的（依赖更新重要）
echo "使用上游的 package.json..."
git checkout --theirs package.json

# tsconfig.json: 用你的（配置通常要保留）
echo "保留你的 tsconfig.json..."
git checkout --ours tsconfig.json

# Welcome.tsx: 查看差异后决定
echo "查看 Welcome.tsx 差异..."
git diff HEAD:components/Welcome/Welcome.tsx upstream/main:components/Welcome/Welcome.tsx | head -50

echo -n "用你的版本(y)还是上游版本(u)? [y/u]: "
read choice
if [[ "$choice" == "u" ]]; then
    git checkout --theirs components/Welcome/Welcome.tsx
else
    git checkout --ours components/Welcome/Welcome.tsx
fi

# 处理特殊文件
echo "处理 yarn.lock（上游版本）..."
git checkout --theirs yarn.lock
echo "处理 next-env.d.ts（你的版本）..."
git checkout --ours next-env.d.ts

# 标记为已解决
git add package.json tsconfig.json components/Welcome/Welcome.tsx yarn.lock next-env.d.ts

echo "✅ 冲突已解决"
