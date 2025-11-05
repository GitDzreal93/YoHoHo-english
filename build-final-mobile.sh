#!/bin/bash

# 构建最终的完全可交互移动端应用
echo "🚀 构建最终修复版移动端应用..."

# 清理旧的构建文件
rm -rf dist
mkdir -p dist

# 创建完全可交互的移动端应用
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>YoHoHo English - 学习中心</title>
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

        /* 加载屏幕 */
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
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
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        .loading-text {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .progress-bar {
            width: 200px;
            height: 6px;
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
            margin: 0 auto;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: white;
            border-radius: 3px;
            width: 0%;
            animation: loadProgress 2s ease forwards;
        }

        @keyframes loadProgress {
            from { width: 0%; }
            to { width: 100%; }
        }

        /* 主应用容器 */
        .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            opacity: 0;
            transition: opacity 0.5s ease;
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .app.show {
            opacity: 1;
        }

        /* 头部 */
        .header {
            text-align: center;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .logo {
            font-size: 56px;
            margin-bottom: 12px;
            animation: bounce 3s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px); }
            60% { transform: translateY(-7px); }
        }

        .title {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 4px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 400;
        }

        /* 主内容区 */
        .main-content {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
        }

        /* 用户信息卡片 */
        .user-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }

        .user-card::before {
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

        .user-card:hover::before {
            opacity: 1;
        }

        .user-card:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            border-color: rgba(255,255,255,0.3);
        }

        .user-card:active {
            transform: scale(0.98);
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
            flex-shrink: 0;
        }

        .user-info {
            flex: 1;
            min-width: 0;
        }

        .user-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .user-level {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
        }

        .stats {
            display: flex;
            gap: 16px;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 20px;
            font-weight: 800;
            color: #FFD700;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .stat-label {
            font-size: 11px;
            opacity: 0.8;
            margin-top: 2px;
        }

        /* 功能网格 */
        .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .feature-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 24px 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
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

        .feature-card:hover {
            background: rgba(255,255,255,0.25);
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.3);
        }

        .feature-card:active {
            transform: scale(0.95);
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 12px;
            display: block;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .feature-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .feature-desc {
            font-size: 12px;
            opacity: 0.9;
            line-height: 1.3;
        }

        /* 底部导航 */
        .bottom-nav {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
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
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .nav-item:hover::before {
            opacity: 1;
        }

        .nav-item:hover {
            transform: translateY(-2px);
        }

        .nav-item:active {
            transform: scale(0.9);
        }

        .nav-item.active::before {
            opacity: 1;
            background: rgba(255,255,255,0.2);
        }

        .nav-icon {
            font-size: 22px;
        }

        .nav-label {
            font-size: 11px;
            font-weight: 500;
        }

        /* 悬浮按钮 */
        .fab {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 100;
        }

        .fab:hover {
            transform: scale(1.1) rotate(15deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .fab:active {
            transform: scale(0.9);
        }

        /* 模态框 */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .modal.show {
            display: flex;
            opacity: 1;
        }

        .modal-content {
            background: white;
            color: #333;
            border-radius: 24px;
            padding: 32px 24px;
            max-width: 350px;
            width: 100%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .modal.show .modal-content {
            transform: scale(1);
        }

        .modal-icon {
            font-size: 60px;
            margin-bottom: 16px;
        }

        .modal-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #667eea;
        }

        .modal-text {
            font-size: 15px;
            margin-bottom: 24px;
            line-height: 1.5;
            color: #555;
        }

        .modal-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .modal-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .modal-button:active {
            transform: scale(0.95);
        }

        /* 动画入场 */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .feature-card {
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }

        /* iPad适配 */
        @media (min-width: 768px) {
            .features {
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }

            .app {
                max-width: 800px;
                margin: 0 auto;
            }

            .main-content {
                padding: 30px;
            }

            .user-card {
                padding: 24px;
            }

            .feature-card {
                padding: 30px 20px;
            }
        }

        /* iPhone适配 */
        @media (max-width: 428px) {
            .features {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .header {
                padding: 16px;
            }

            .logo {
                font-size: 48px;
            }

            .title {
                font-size: 22px;
            }

            .subtitle {
                font-size: 14px;
            }

            .user-card {
                padding: 16px;
            }

            .avatar {
                width: 50px;
                height: 50px;
                font-size: 20px;
            }

            .feature-card {
                padding: 20px 16px;
            }

            .feature-icon {
                font-size: 36px;
            }

            .feature-title {
                font-size: 15px;
            }

            .feature-desc {
                font-size: 11px;
            }
        }

        /* 错误提示 */
        .error-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            z-index: 9998;
            display: none;
        }

        .success-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-weight: 600;
            z-index: 9998;
            display: none;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from { transform: translate(-50%, -100%); }
            to { transform: translate(-50%, 0); }
        }
    </style>
</head>
<body>
    <!-- 加载屏幕 -->
    <div class="loading-screen" id="loadingScreen">
        <div class="loading-content">
            <div class="loading-logo">🦁</div>
            <div class="loading-text">YoHoHo English</div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>

    <!-- 主应用 -->
    <div class="app" id="app">
        <header class="header">
            <div class="logo">🦁</div>
            <h1 class="title">YoHoHo English</h1>
            <p class="subtitle">让英语学习充满乐趣</p>
        </header>

        <main class="main-content">
            <!-- 用户信息卡片 -->
            <div class="user-card" onclick="handleUserCard()">
                <div class="avatar">👦</div>
                <div class="user-info">
                    <div class="user-name">小朋友</div>
                    <div class="user-level">英语小达人 • 连续学习15天</div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-number">89</div>
                            <div class="stat-label">掌握单词</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">12</div>
                            <div class="stat-label">获得成就</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">3</div>
                            <div class="stat-label">今日星星</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 功能网格 -->
            <div class="features">
                <div class="feature-card" onclick="handleFeature('flashcard')">
                    <span class="feature-icon">📚</span>
                    <div class="feature-title">闪卡学习</div>
                    <div class="feature-desc">22个分类词汇学习</div>
                </div>

                <div class="feature-card" onclick="handleFeature('games')">
                    <span class="feature-icon">🎮</span>
                    <div class="feature-title">趣味游戏</div>
                    <div class="feature-desc">6个教育小游戏</div>
                </div>

                <div class="feature-card" onclick="handleFeature('progress')">
                    <span class="feature-icon">📊</span>
                    <div class="feature-title">学习进度</div>
                    <div class="feature-desc">查看学习统计</div>
                </div>

                <div class="feature-card" onclick="handleFeature('achievements')">
                    <span class="feature-icon">🏆</span>
                    <div class="feature-title">我的成就</div>
                    <div class="feature-desc">收集荣誉徽章</div>
                </div>
            </div>
        </main>

        <!-- 底部导航 -->
        <nav class="bottom-nav">
            <div class="nav-item active" onclick="handleNav('home')">
                <span class="nav-icon">🏠</span>
                <span class="nav-label">首页</span>
            </div>
            <div class="nav-item" onclick="handleNav('learn')">
                <span class="nav-icon">📖</span>
                <span class="nav-label">学习</span>
            </div>
            <div class="nav-item" onclick="handleNav('games')">
                <span class="nav-icon">🎮</span>
                <span class="nav-label">游戏</span>
            </div>
            <div class="nav-item" onclick="handleNav('profile')">
                <span class="nav-icon">👤</span>
                <span class="nav-label">我的</span>
            </div>
        </nav>
    </div>

    <!-- 悬浮按钮 -->
    <div class="fab" onclick="handleFab()">
        <span>🎯</span>
    </div>

    <!-- 模态框 -->
    <div class="modal" id="modal" onclick="closeModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-icon" id="modalIcon">🎉</div>
            <h2 class="modal-title" id="modalTitle">欢迎！</h2>
            <p class="modal-text" id="modalText">准备开始今天的英语学习吧！</p>
            <button class="modal-button" onclick="closeModal()">知道了</button>
        </div>
    </div>

    <!-- 消息提示 -->
    <div class="error-message" id="errorMessage"></div>
    <div class="success-message" id="successMessage"></div>

    <script>
        // 全局变量
        let isAppLoaded = false;
        let currentFeature = null;

        // 内容数据
        const contentData = {
            'user': {
                icon: '👤',
                title: '个人信息',
                text: '你已经连续学习15天了！掌握了89个单词，获得了12个成就徽章。继续保持这个学习势头，你一定能成为英语小达人！💪'
            },
            'flashcard': {
                icon: '📚',
                title: '闪卡学习',
                text: '包含动物、食物、颜色、数字等22个分类的英语单词闪卡。每个单词都配有精美图片和标准发音，让学习更加生动有趣！'
            },
            'games': {
                icon: '🎮',
                title: '趣味游戏',
                text: '6个精心设计的教育游戏：声音寻宝、魔法拼图、彩虹泡泡、动物音乐盒、记忆翻牌、单词画家。在游戏中快乐学习英语！'
            },
            'progress': {
                icon: '📊',
                title: '学习进度',
                text: '详细的学习统计数据：每日学习时间、掌握单词数量、游戏得分、正确率等。让家长随时了解孩子的学习情况。'
            },
            'achievements': {
                icon: '🏆',
                title: '我的成就',
                text: '收集各种学习成就徽章，解锁新的学习内容和奖励。从初学者到英语达人，见证你的每一步成长！'
            },
            'home': {
                icon: '🏠',
                title: '欢迎回家',
                text: '这里是你的学习起点。查看今日推荐内容、学习计划，快速进入你喜欢的学习模块！'
            },
            'learn': {
                icon: '📖',
                title: '学习中心',
                text: '多种学习方式任你选择：闪卡学习、单词测试、听力练习、口语训练。找到最适合你的学习方法！'
            },
            'games': {
                icon: '🎮',
                title: '游戏世界',
                text: '在游戏中学习，在快乐中进步！每个游戏都针对不同的学习技能设计，全面提升英语能力。'
            },
            'profile': {
                icon: '👤',
                title: '个人中心',
                text: '管理个人信息、查看学习历史、设置学习目标、调整学习难度。打造专属你的英语学习体验！'
            },
            'daily': {
                icon: '🎯',
                title: '今日目标',
                text: '今日任务：学习10个新单词，完成2个游戏，获得3颗星星！完成后将解锁新的学习内容和奖励哦！'
            }
        };

        // 显示消息
        function showMessage(type, message) {
            const messageEl = type === 'success' ?
                document.getElementById('successMessage') :
                document.getElementById('errorMessage');

            messageEl.textContent = message;
            messageEl.style.display = 'block';

            if (type === 'success') {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 3000);
            } else {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);
            }
        }

        // 显示模态框
        function showModal(type, autoHide = false) {
            const content = contentData[type];
            if (!content) return;

            const modal = document.getElementById('modal');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalText = document.getElementById('modalText');

            modalIcon.textContent = content.icon;
            modalTitle.textContent = content.title;
            modalText.textContent = content.text;

            modal.classList.add('show');

            // 添加触觉反馈
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // 自动隐藏
            if (autoHide) {
                setTimeout(() => {
                    closeModal();
                }, 3000);
            }

            currentFeature = type;
        }

        // 关闭模态框
        function closeModal(event) {
            if (!event || event.target.id === 'modal') {
                const modal = document.getElementById('modal');
                modal.classList.remove('show');
                currentFeature = null;
            }
        }

        // 处理用户卡片点击
        function handleUserCard() {
            showModal('user');
            console.log('用户卡片被点击');
        }

        // 处理功能卡片点击
        function handleFeature(feature) {
            showModal(feature);
            console.log('功能卡片被点击:', feature);
        }

        // 处理导航点击
        function handleNav(nav) {
            // 移除所有active类
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // 添加active类到当前项
            event.currentTarget.classList.add('active');

            showModal(nav);
            console.log('导航被点击:', nav);
        }

        // 处理悬浮按钮点击
        function handleFab() {
            showModal('daily');
            console.log('悬浮按钮被点击');
        }

        // 初始化应用
        function initApp() {
            console.log('🚀 应用初始化开始');

            // 设备检测
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isIPad = /iPad/.test(navigator.userAgent) ||
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isIPhone = /iPhone|iPod/.test(navigator.userAgent);

            console.log('📱 设备信息:', {
                isIOS,
                isIPad,
                isIPhone,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                orientation: window.orientation || 'unknown'
            });

            // 添加设备特定的body类
            document.body.className = '';
            if (isIPad) document.body.classList.add('ipad');
            if (isIPhone) document.body.classList.add('iphone');
            if (isIOS) document.body.classList.add('ios');

            // 监听屏幕方向变化
            window.addEventListener('orientationchange', function() {
                console.log('📱 屏幕方向改变:', window.orientation);
                setTimeout(() => {
                    console.log('📏 新的屏幕尺寸:', {
                        width: window.innerWidth,
                        height: window.innerHeight
                    });
                }, 100);
            });

            // 监听窗口大小变化
            window.addEventListener('resize', function() {
                console.log('📏 窗口大小改变:', {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            });

            // 网络状态监听
            window.addEventListener('online', function() {
                console.log('🌐 网络连接恢复');
                showMessage('success', '网络连接已恢复');
            });

            window.addEventListener('offline', function() {
                console.log('📶 网络连接断开');
                showMessage('error', '网络连接已断开');
            });

            // 触摸事件监听
            let touchStartTime = 0;
            document.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
            });

            document.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                console.log('👆 触摸结束，持续时间:', touchDuration + 'ms');
            });

            // 键盘事件监听
            document.addEventListener('keydown', function(e) {
                console.log('⌨️ 按键:', e.key);
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            // 检查Capacitor API
            if (window.Capacitor) {
                console.log('✅ Capacitor已加载');
                console.log('📱 Capacitor平台:', window.Capacitor.getPlatform());
            } else {
                console.log('🌐 Web环境 - 部分功能受限');
            }

            // 模拟一些动态数据更新
            setInterval(() => {
                // 随机更新学习天数
                const daysElement = document.querySelector('.user-level');
                if (daysElement) {
                    const currentDays = parseInt(daysElement.textContent.match(/\d+/)[0]);
                    const newDays = currentDays + Math.floor(Math.random() * 3);
                    daysElement.textContent = daysElement.textContent.replace(/\d+/, newDays);
                }
            }, 30000); // 每30秒更新一次

            console.log('✅ 应用初始化完成');
        }

        // 应用启动流程
        function startApp() {
            console.log('🎬 应用启动流程开始');

            // 显示应用主体
            const app = document.getElementById('app');
            const loadingScreen = document.getElementById('loadingScreen');

            setTimeout(() => {
                app.classList.add('show');
                console.log('📱 应用界面已显示');

                // 隐藏加载屏幕
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        isAppLoaded = true;
                        console.log('✅ 应用启动完成');

                        // 显示欢迎消息
                        setTimeout(() => {
                            showModal('home', true);
                        }, 500);
                    }, 500);
                }, 1000);
            }, 2000);
        }

        // 错误处理
        window.addEventListener('error', function(e) {
            console.error('❌ 应用错误:', e.error);
            showMessage('error', '应用出现错误，请刷新页面');
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('❌ 未处理的Promise拒绝:', e.reason);
            showMessage('error', '应用出现问题，请稍后重试');
        });

        // 页面加载完成后启动应用
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                console.log('📄 DOM内容加载完成');
                initApp();
                startApp();
            });
        } else {
            console.log('📄 DOM已加载完成');
            initApp();
            startApp();
        }

        // 性能监控
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('⚡ 页面性能:', {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            firstPaint: perfData.firstPaint || 'N/A',
                            firstContentfulPaint: perfData.firstContentfulPaint || 'N/A'
                        });
                    }
                }, 0);
            });
        }

        // 导出一些函数供调试使用
        window.appAPI = {
            showModal,
            closeModal,
            showMessage,
            currentFeature: () => currentFeature,
            isLoaded: () => isAppLoaded
        };

        console.log('🎯 YoHoHo English 应用脚本加载完成');
    </script>
</body>
</html>
EOF

echo "✅ 最终修复版移动端应用构建完成"
echo "🎮 所有交互功能已修复，包含完整的错误处理和调试信息"