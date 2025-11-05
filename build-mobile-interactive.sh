#!/bin/bash

# 构建交互式移动端应用
echo "🚀 构建交互式移动端应用..."

# 清理旧的构建文件
rm -rf dist

# 复制基础文件
mkdir -p dist
cp -r public/* dist/ 2>/dev/null || true

# 创建移动端优化的交互式应用
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>YoHoHo English - 卡通英语闪卡</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* 状态栏占位 */
        .status-bar {
            height: env(safe-area-inset-top);
            background: rgba(0,0,0,0.1);
        }

        /* 主容器 */
        .app-container {
            min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
            display: flex;
            flex-direction: column;
        }

        /* 头部 */
        .header {
            padding: 20px;
            text-align: center;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .logo {
            font-size: 60px;
            margin-bottom: 8px;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        .app-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .app-subtitle {
            font-size: 16px;
            opacity: 0.8;
            font-weight: 400;
        }

        /* 主内容区 */
        .main-content {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* 用户信息卡片 */
        .user-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.3s ease;
        }

        .user-card:active {
            transform: scale(0.98);
            background: rgba(255,255,255,0.2);
        }

        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            border: 3px solid rgba(255,255,255,0.3);
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .user-level {
            font-size: 14px;
            opacity: 0.8;
        }

        .user-stats {
            display: flex;
            gap: 16px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #FFD700;
        }

        .stat-label {
            font-size: 12px;
            opacity: 0.7;
        }

        /* 功能网格 */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .feature-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 24px;
            border: 1px solid rgba(255,255,255,0.2);
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card:active {
            transform: scale(0.95);
            background: rgba(255,255,255,0.25);
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
        }

        .feature-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .feature-desc {
            font-size: 12px;
            opacity: 0.8;
            line-height: 1.3;
        }

        /* 底部导航 */
        .bottom-nav {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255,255,255,0.2);
            padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
            display: flex;
            justify-content: space-around;
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 8px 16px;
            border-radius: 12px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .nav-item:active {
            background: rgba(255,255,255,0.2);
            transform: scale(0.95);
        }

        .nav-item.active {
            background: rgba(255,255,255,0.2);
        }

        .nav-icon {
            font-size: 20px;
        }

        .nav-label {
            font-size: 11px;
            font-weight: 500;
        }

        /* 悬浮按钮 */
        .fab {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            z-index: 100;
        }

        .fab:active {
            transform: scale(0.9);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        /* 模态框 */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        }

        .modal.show {
            display: flex;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: white;
            color: #333;
            border-radius: 24px;
            padding: 32px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-icon {
            font-size: 60px;
            margin-bottom: 16px;
        }

        .modal-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #667eea;
        }

        .modal-text {
            font-size: 16px;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .modal-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-button:active {
            transform: scale(0.95);
        }

        /* iPad适配 */
        @media (min-width: 768px) {
            .features-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .app-container {
                max-width: 800px;
                margin: 0 auto;
            }
        }

        /* iPhone适配 */
        @media (max-width: 428px) {
            .features-grid {
                grid-template-columns: 1fr;
            }

            .header {
                padding: 16px;
            }

            .logo {
                font-size: 48px;
            }

            .app-title {
                font-size: 24px;
            }
        }

        /* 加载动画 */
        .loading {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            transition: opacity 0.5s ease;
        }

        .loading.hide {
            opacity: 0;
            pointer-events: none;
        }

        .loading-content {
            text-align: center;
        }

        .loading-logo {
            font-size: 80px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .loading-text {
            font-size: 18px;
            font-weight: 600;
        }

        .progress-bar {
            width: 200px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            margin: 20px auto;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: white;
            border-radius: 2px;
            animation: progress 2s ease;
        }

        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }
    </style>
</head>
<body>
    <!-- 加载屏幕 -->
    <div class="loading" id="loading">
        <div class="loading-content">
            <div class="loading-logo">🦁</div>
            <div class="loading-text">YoHoHo English</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>

    <!-- 主应用 -->
    <div class="app-container">
        <div class="status-bar"></div>

        <header class="header">
            <div class="logo">🦁</div>
            <h1 class="app-title">YoHoHo English</h1>
            <p class="app-subtitle">让英语学习充满乐趣</p>
        </header>

        <main class="main-content">
            <!-- 用户信息卡片 -->
            <div class="user-card" onclick="handleUserCardClick()">
                <div class="avatar">👦</div>
                <div class="user-info">
                    <div class="user-name">小朋友</div>
                    <div class="user-level">英语小达人</div>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <div class="stat-value">15</div>
                        <div class="stat-label">天数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">89</div>
                        <div class="stat-label">单词</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">3</div>
                        <div class="stat-label">星星</div>
                    </div>
                </div>
            </div>

            <!-- 功能网格 -->
            <div class="features-grid">
                <div class="feature-card" onclick="handleFeatureClick('flashcard')">
                    <span class="feature-icon">📚</span>
                    <div class="feature-title">闪卡学习</div>
                    <div class="feature-desc">22个分类词汇学习</div>
                </div>

                <div class="feature-card" onclick="handleFeatureClick('games')">
                    <span class="feature-icon">🎮</span>
                    <div class="feature-title">趣味游戏</div>
                    <div class="feature-desc">6个教育小游戏</div>
                </div>

                <div class="feature-card" onclick="handleFeatureClick('progress')">
                    <span class="feature-icon">📊</span>
                    <div class="feature-title">学习进度</div>
                    <div class="feature-desc">查看学习成就</div>
                </div>

                <div class="feature-card" onclick="handleFeatureClick('achievements')">
                    <span class="feature-icon">🏆</span>
                    <div class="feature-title">我的成就</div>
                    <div class="feature-desc">收集荣誉徽章</div>
                </div>
            </div>
        </main>

        <!-- 底部导航 -->
        <nav class="bottom-nav">
            <div class="nav-item active" onclick="handleNavClick('home')">
                <span class="nav-icon">🏠</span>
                <span class="nav-label">首页</span>
            </div>
            <div class="nav-item" onclick="handleNavClick('learn')">
                <span class="nav-icon">📖</span>
                <span class="nav-label">学习</span>
            </div>
            <div class="nav-item" onclick="handleNavClick('games')">
                <span class="nav-icon">🎮</span>
                <span class="nav-label">游戏</span>
            </div>
            <div class="nav-item" onclick="handleNavClick('profile')">
                <span class="nav-icon">👤</span>
                <span class="nav-label">我的</span>
            </div>
        </nav>
    </div>

    <!-- 悬浮按钮 -->
    <div class="fab" onclick="handleFabClick()">
        <span>🎯</span>
    </div>

    <!-- 模态框 -->
    <div class="modal" id="modal">
        <div class="modal-content">
            <div class="modal-icon" id="modalIcon">🎉</div>
            <h2 class="modal-title" id="modalTitle">功能介绍</h2>
            <p class="modal-text" id="modalText">这是一个功能演示，完整的React应用正在构建中...</p>
            <button class="modal-button" onclick="closeModal()">知道了</button>
        </div>
    </div>

    <script>
        // 设备检测
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isIPhone = /iPhone|iPod/.test(navigator.userAgent);

        // 添加触觉反馈效果
        function addHapticFeedback() {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }

        // 显示模态框
        function showModal(icon, title, text) {
            const modal = document.getElementById('modal');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalText = document.getElementById('modalText');

            modalIcon.textContent = icon;
            modalTitle.textContent = title;
            modalText.textContent = text;

            modal.classList.add('show');
            addHapticFeedback();
        }

        // 关闭模态框
        function closeModal() {
            const modal = document.getElementById('modal');
            modal.classList.remove('show');
            addHapticFeedback();
        }

        // 处理用户卡片点击
        function handleUserCardClick() {
            showModal('👤', '个人信息', '这里可以查看和编辑你的个人信息，包括学习记录和成就！');
        }

        // 处理功能卡片点击
        function handleFeatureClick(feature) {
            const features = {
                'flashcard': {
                    icon: '📚',
                    title: '闪卡学习',
                    text: '包含22个分类的英语单词闪卡，配有图片和发音，让学习更轻松有趣！'
                },
                'games': {
                    icon: '🎮',
                    title: '趣味游戏',
                    text: '6个精心设计的教育游戏，包括声音寻宝、记忆翻牌、彩虹泡泡等！'
                },
                'progress': {
                    icon: '📊',
                    title: '学习进度',
                    text: '查看你的学习统计、每日进度和成就记录，见证你的成长！'
                },
                'achievements': {
                    icon: '🏆',
                    title: '我的成就',
                    text: '收集各种成就徽章，解锁新的学习内容，成为英语小达人！'
                }
            };

            const selectedFeature = features[feature];
            if (selectedFeature) {
                showModal(selectedFeature.icon, selectedFeature.title, selectedFeature.text);
            }
        }

        // 处理导航点击
        function handleNavClick(nav) {
            // 移除所有active类
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // 添加active类到当前项
            event.currentTarget.classList.add('active');
            addHapticFeedback();

            const navInfo = {
                'home': { icon: '🏠', title: '首页', text: '欢迎回到YoHoHo English！开始今天的英语学习之旅吧！' },
                'learn': { icon: '📖', title: '学习中心', text: '选择你喜欢的学习方式：闪卡学习、单词测试或听力练习！' },
                'games': { icon: '🎮', title: '游戏世界', text: '在游戏中学习英语！6个有趣的游戏等着你挑战！' },
                'profile': { icon: '👤', title: '个人中心', text: '查看你的学习记录、成就和个人设置！' }
            };

            const selectedNav = navInfo[nav];
            if (selectedNav) {
                showModal(selectedNav.icon, selectedNav.title, selectedNav.text);
            }
        }

        // 处理悬浮按钮点击
        function handleFabClick() {
            showModal('🎯', '今日目标', '今日学习目标：学习10个新单词，完成2个游戏，获得3颗星星！加油！💪');
        }

        // 初始化应用
        function initApp() {
            // 检测设备并更新状态
            console.log('设备信息:', {
                isIOS,
                isIPad,
                isIPhone,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            });

            // 添加设备特定的样式
            if (isIPad) {
                document.body.classList.add('ipad');
            } else if (isIPhone) {
                document.body.classList.add('iphone');
            }

            // 监听屏幕方向变化
            window.addEventListener('orientationchange', function() {
                console.log('屏幕方向改变:', window.orientation);
            });

            // 监听网络状态
            window.addEventListener('online', function() {
                console.log('网络连接恢复');
            });

            window.addEventListener('offline', function() {
                console.log('网络连接断开');
            });

            // 隐藏加载屏幕
            setTimeout(function() {
                const loading = document.getElementById('loading');
                loading.classList.add('hide');

                // 显示欢迎消息
                setTimeout(function() {
                    showModal('🎉', '欢迎回来！', '今天是个学习英语的好日子，准备好了吗？让我们开始吧！');
                }, 600);
            }, 2000);

            // 模拟一些交互效果
            document.querySelectorAll('.feature-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.style.animation = 'slideUp 0.5s ease forwards';
            });
        }

        // 页面加载完成后初始化
        window.addEventListener('load', initApp);

        // 添加键盘导航支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // 点击模态框背景关闭
        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // 添加滑动返回支持（仅iOS）
        if (isIOS) {
            let startX = 0;
            let startY = 0;

            document.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            document.addEventListener('touchend', function(e) {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // 从左边缘向右滑动超过100px
                if (startX < 20 && deltaX > 100 && Math.abs(deltaY) < 50) {
                    console.log('触发滑动返回');
                    // 这里可以添加返回逻辑
                }
            });
        }

        // 模拟Capacitor API检测
        if (window.Capacitor) {
            console.log('✅ Capacitor已加载');

            // 模拟Capacitor插件初始化
            console.log('📱 移动端环境检测完成');
        } else {
            console.log('🌐 Web环境 - 部分功能受限');
        }

        // 性能监控
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('页面加载性能:', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
                    });
                }, 0);
            });
        }
    </script>
</body>
</html>
EOF

echo "✅ 交互式移动端应用构建完成"
echo "📱 运行 'npx cap sync' 来同步到iOS设备"