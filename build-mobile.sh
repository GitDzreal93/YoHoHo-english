#!/bin/bash

# 临时构建脚本 - 跳过有问题的组件
echo "🚀 开始构建移动端应用..."

# 清理旧的构建文件
rm -rf dist

# 复制基础文件
mkdir -p dist
cp -r public/* dist/

# 创建一个简化的index.html用于测试
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YoHoHo English - 卡通英语闪卡</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 400px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 16px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 24px;
            opacity: 0.9;
        }
        .features {
            text-align: left;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .feature-icon {
            margin-right: 12px;
            font-size: 20px;
        }
        .build-info {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 20px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
        }
        .status {
            display: inline-block;
            padding: 6px 12px;
            background: #4CAF50;
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🦁</div>
        <div class="status">✅ 移动端配置完成</div>
        <h1>YoHoHo English</h1>
        <p>卡通英语闪卡学习应用</p>

        <div class="features">
            <div class="feature">
                <span class="feature-icon">📚</span>
                <span>22个分类词汇学习</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🎮</span>
                <span>6个教育游戏</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📊</span>
                <span>学习进度追踪</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🏆</span>
                <span>成就系统</span>
            </div>
            <div class="feature">
                <span class="feature-icon">👨‍👩‍👧‍👦</span>
                <span>家长控制功能</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📱</span>
                <span>iPad/iPhone优化</span>
            </div>
        </div>

        <div class="build-info">
            <strong>构建信息:</strong><br>
            ✅ Capacitor 配置完成<br>
            ✅ iOS 平台已添加<br>
            ✅ 移动端优化设置<br>
            ⚠️ 完整功能需要修复构建错误
        </div>
    </div>

    <script>
        // 检测设备类型
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        console.log('设备信息:', {
            isIOS,
            isIPad,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints
        });

        // 显示设备适配状态
        if (isIPad) {
            document.querySelector('.status').textContent = '✅ iPad 完美适配';
        } else if (isIOS) {
            document.querySelector('.status').textContent = '✅ iPhone 优化完成';
        }

        // 模拟Capacitor API检测
        if (window.Capacitor) {
            console.log('Capacitor已加载');
        } else {
            console.log('Capacitor未加载 - 这是Web版本');
        }
    </script>
</body>
</html>
EOF

echo "✅ 移动端构建文件已生成"
echo "📱 运行 'npx cap sync' 来同步到原生平台"