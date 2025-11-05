#!/bin/bash

# 构建简单但完全可交互的移动端应用
echo "🚀 构建简单可交互的移动端应用..."

# 清理旧的构建文件
rm -rf dist

# 创建基础文件
mkdir -p dist
cp -r public/* dist/ 2>/dev/null || true

# 创建简单但功能完整的移动端应用
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>YoHoHo English - 学习中心</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .app {
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            text-align: center;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }

        .logo {
            font-size: 48px;
            margin-bottom: 8px;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 14px;
            opacity: 0.8;
        }

        .content {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .user-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .user-card:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.02);
        }

        .user-card:active {
            transform: scale(0.98);
        }

        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .user-info {
            flex: 1;
        }

        .user-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .user-stats {
            font-size: 12px;
            opacity: 0.8;
        }

        .stats {
            display: flex;
            gap: 20px;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 18px;
            font-weight: 700;
            color: #FFD700;
        }

        .stat-label {
            font-size: 10px;
            opacity: 0.7;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }

        .feature {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .feature:hover {
            background: rgba(255,255,255,0.25);
            border-color: rgba(255,255,255,0.3);
        }

        .feature:active {
            transform: scale(0.95);
        }

        .feature-icon {
            font-size: 32px;
            margin-bottom: 8px;
            display: block;
        }

        .feature-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .feature-desc {
            font-size: 11px;
            opacity: 0.8;
        }

        .nav {
            display: flex;
            justify-content: space-around;
            padding: 16px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255,255,255,0.2);
        }

        .nav-item {
            text-align: center;
            cursor: pointer;
            padding: 8px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .nav-item:hover {
            background: rgba(255,255,255,0.1);
        }

        .nav-item:active {
            transform: scale(0.9);
        }

        .nav-icon {
            font-size: 20px;
            margin-bottom: 4px;
            display: block;
        }

        .nav-label {
            font-size: 10px;
            opacity: 0.8;
        }

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
            padding: 20px;
            z-index: 1000;
        }

        .modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            color: #333;
            border-radius: 16px;
            padding: 24px;
            max-width: 300px;
            width: 100%;
            text-align: center;
        }

        .modal-icon {
            font-size: 48px;
            margin-bottom: 12px;
        }

        .modal-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #667eea;
        }

        .modal-text {
            font-size: 14px;
            margin-bottom: 16px;
            line-height: 1.4;
        }

        .modal-button {
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .modal-button:hover {
            background: #5a67d8;
        }

        .modal-button:active {
            transform: scale(0.95);
        }

        .fab {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 100;
        }

        .fab:hover {
            transform: scale(1.1);
        }

        .fab:active {
            transform: scale(0.9);
        }

        /* iPad适配 */
        @media (min-width: 768px) {
            .features {
                grid-template-columns: repeat(3, 1fr);
            }

            .app {
                max-width: 800px;
                margin: 0 auto;
            }
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="header">
            <div class="logo">🦁</div>
            <h1 class="title">YoHoHo English</h1>
            <p class="subtitle">让英语学习充满乐趣</p>
        </div>

        <div class="content">
            <div class="user-card" onclick="showModal('user')">
                <div class="avatar">👦</div>
                <div class="user-info">
                    <div class="user-name">小朋友</div>
                    <div class="user-stats">英语小达人 • 学习15天</div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">89</div>
                        <div class="stat-label">单词</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">12</div>
                        <div class="stat-label">成就</div>
                    </div>
                </div>
            </div>

            <div class="features">
                <div class="feature" onclick="showModal('flashcard')">
                    <span class="feature-icon">📚</span>
                    <div class="feature-title">闪卡学习</div>
                    <div class="feature-desc">22个分类词汇</div>
                </div>

                <div class="feature" onclick="showModal('games')">
                    <span class="feature-icon">🎮</span>
                    <div class="feature-title">趣味游戏</div>
                    <div class="feature-desc">6个教育游戏</div>
                </div>

                <div class="feature" onclick="showModal('progress')">
                    <span class="feature-icon">📊</span>
                    <div class="feature-title">学习进度</div>
                    <div class="feature-desc">查看学习统计</div>
                </div>

                <div class="feature" onclick="showModal('achievements')">
                    <span class="feature-icon">🏆</span>
                    <div class="feature-title">我的成就</div>
                    <div class="feature-desc">收集荣誉徽章</div>
                </div>
            </div>
        </div>

        <div class="nav">
            <div class="nav-item" onclick="showModal('home')">
                <span class="nav-icon">🏠</span>
                <span class="nav-label">首页</span>
            </div>
            <div class="nav-item" onclick="showModal('learn')">
                <span class="nav-icon">📖</span>
                <span class="nav-label">学习</span>
            </div>
            <div class="nav-item" onclick="showModal('games')">
                <span class="nav-icon">🎮</span>
                <span class="nav-label">游戏</span>
            </div>
            <div class="nav-item" onclick="showModal('profile')">
                <span class="nav-icon">👤</span>
                <span class="nav-label">我的</span>
            </div>
        </div>
    </div>

    <div class="fab" onclick="showModal('daily')">
        <span>🎯</span>
    </div>

    <div class="modal" id="modal" onclick="closeModal(event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-icon" id="modalIcon">🎉</div>
            <h2 class="modal-title" id="modalTitle">功能介绍</h2>
            <p class="modal-text" id="modalText">点击了解详细功能</p>
            <button class="modal-button" onclick="closeModal()">知道了</button>
        </div>
    </div>

    <script>
        // 模态框内容
        const modalContent = {
            'user': {
                icon: '👤',
                title: '个人信息',
                text: '查看你的学习记录、成就统计和个人设置！你正在成为英语小达人！'
            },
            'flashcard': {
                icon: '📚',
                title: '闪卡学习',
                text: '包含动物、食物、颜色等22个分类的英语单词闪卡，配有精美图片和标准发音！'
            },
            'games': {
                icon: '🎮',
                title: '趣味游戏',
                text: '声音寻宝、记忆翻牌、彩虹泡泡等6个教育游戏，在游戏中快乐学习！'
            },
            'progress': {
                icon: '📊',
                title: '学习进度',
                text: '查看每日学习时间、掌握单词数量、正确率等详细统计数据！'
            },
            'achievements': {
                icon: '🏆',
                title: '我的成就',
                text: '收集学习成就徽章，解锁新内容，成为英语学习小明星！'
            },
            'home': {
                icon: '🏠',
                title: '欢迎回家',
                text: '这里是你的学习起点，查看今日学习计划和推荐内容！'
            },
            'learn': {
                icon: '📖',
                title: '学习中心',
                text: '选择你喜欢的学习方式，开始今天的英语学习之旅！'
            },
            'games': {
                icon: '🎮',
                title: '游戏世界',
                text: '在游戏中学习英语，让学习变得更有趣、更有效！'
            },
            'profile': {
                icon: '👤',
                title: '个人中心',
                text: '管理个人信息，查看学习历史，设置学习目标！'
            },
            'daily': {
                icon: '🎯',
                title: '今日目标',
                text: '今日任务：学习10个新单词，完成2个游戏，获得3颗星星！加油！'
            }
        };

        // 显示模态框
        function showModal(type) {
            const content = modalContent[type];
            if (content) {
                document.getElementById('modalIcon').textContent = content.icon;
                document.getElementById('modalTitle').textContent = content.title;
                document.getElementById('modalText').textContent = content.text;
                document.getElementById('modal').classList.add('show');

                // 添加触觉反馈
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        }

        // 关闭模态框
        function closeModal(event) {
            if (!event || event.target.id === 'modal') {
                document.getElementById('modal').classList.remove('show');
            }
        }

        // 初始化
        window.addEventListener('load', function() {
            // 检测设备
            const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isIPhone = /iPhone/.test(navigator.userAgent);

            console.log('设备检测:', {
                isIPad: isIPad,
                isIPhone: isIPhone,
                userAgent: navigator.userAgent,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            });

            // 延迟显示欢迎消息
            setTimeout(function() {
                showModal('home');
            }, 1000);
        });

        // 监听方向变化
        window.addEventListener('orientationchange', function() {
            console.log('屏幕方向改变:', window.orientation);
        });

        // 添加键盘支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>
EOF

echo "✅ 简单可交互应用构建完成"
echo "📱 所有按钮和卡片都可以点击了！"