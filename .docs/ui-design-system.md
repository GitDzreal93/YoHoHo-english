# 卡通英语闪卡APP - UI设计规范

## 1. 设计系统概述

### 1.1 设计理念
- **儿童友好**：色彩鲜艳、图标直观、交互简单
- **教育导向**：清晰的层次结构，突出学习内容
- **情感连接**：温暖的色调，友好的形象
- **安全可靠**：无广告干扰，内容纯净

### 1.2 技术栈选择
- **组件库**：Ant Design Mobile (React Native Web)
- **样式方案**：Styled-components + CSS-in-JS
- **图标库**：React Icons + 自定义SVG
- **动画库**：Framer Motion
- **适配方案**：Capacitor + Responsive Design

## 2. 色彩系统

### 2.1 主色调 (Primary Colors)
```css
/* 主色系 - 温暖友好的橙色系 */
--primary-50: #fff7ed
--primary-100: #ffedd5
--primary-200: #fed7aa
--primary-300: #fdba74
--primary-400: #fb923c
--primary-500: #f97316  /* 主色 */
--primary-600: #ea580c
--primary-700: #c2410c
--primary-800: #9a3412
--primary-900: #7c2d12
```

### 2.2 辅助色调 (Secondary Colors)
```css
/* 成功色 - 绿色系 */
--success-50: #f0fdf4
--success-500: #22c55e
--success-600: #16a34a

/* 警告色 - 黄色系 */
--warning-50: #fefce8
--warning-500: #eab308
--warning-600: #ca8a04

/* 错误色 - 红色系 */
--error-50: #fef2f2
--error-500: #ef4444
--error-600: #dc2626

/* 信息色 - 蓝色系 */
--info-50: #eff6ff
--info-500: #3b82f6
--info-600: #2563eb
```

### 2.3 中性色 (Neutral Colors)
```css
/* 文字色系 */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### 2.4 背景色系 (Background Colors)
```css
/* 背景色渐变 */
--bg-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--bg-gradient-warm: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--bg-gradient-cool: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--bg-gradient-nature: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

/* 卡片背景 */
--card-bg: rgba(255, 255, 255, 0.95);
--card-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
```

## 3. 字体系统

### 3.1 字体族
```css
/* 主字体 - 友好的圆体 */
--font-primary: 'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 数字字体 */
--font-numeric: 'Roboto Mono', 'SF Mono', monospace;

/* 强调字体 */
--font-display: 'Fredoka One', cursive;
```

### 3.2 字体大小
```css
/* 移动端字体大小系统 */
--text-xs: 0.75rem;    /* 12px - 辅助信息 */
--text-sm: 0.875rem;   /* 14px - 小标签 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 小标题 */
--text-xl: 1.25rem;    /* 20px - 标题 */
--text-2xl: 1.5rem;    /* 24px - 大标题 */
--text-3xl: 1.875rem;  /* 30px - 特大标题 */
--text-4xl: 2.25rem;   /* 36px - 数字显示 */
--text-5xl: 3rem;      /* 48px - 分数显示 */
```

### 3.3 字重
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

## 4. 间距系统

### 4.1 基础间距
```css
/* 基于4px的基础间距系统 */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### 4.2 组件间距
```css
/* 组件内部间距 */
--component-padding-sm: var(--space-3);
--component-padding-md: var(--space-4);
--component-padding-lg: var(--space-6);

/* 组件间间距 */
--component-gap-sm: var(--space-4);
--component-gap-md: var(--space-6);
--component-gap-lg: var(--space-8);
```

## 5. 圆角系统

```css
/* 圆角系统 */
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-base: 0.25rem;   /* 4px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-3xl: 1.5rem;     /* 24px */
--radius-full: 9999px;

/* 卡片圆角 */
--card-radius: var(--radius-2xl);
--button-radius: var(--radius-xl);
--input-radius: var(--radius-lg);
```

## 6. 阴影系统

```css
/* 阴影系统 */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* 特殊阴影效果 */
--shadow-glow: 0 0 20px rgba(251, 146, 60, 0.3);
--shadow-card: 0 8px 32px rgba(31, 38, 135, 0.15);
--shadow-button: 0 4px 14px 0 rgba(251, 146, 60, 0.3);
```

## 7. 动画系统

### 7.1 动画时长
```css
/* 动画时长 */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 1000ms;
```

### 7.2 缓动函数
```css
/* 缓动函数 */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## 8. 断点系统

```css
/* 响应式断点 */
--breakpoint-xs: 320px;  /* 小手机 */
--breakpoint-sm: 375px;  /* 普通手机 */
--breakpoint-md: 414px;  /* 大手机 */
--breakpoint-lg: 768px;  /* 平板 */
--breakpoint-xl: 1024px; /* 大平板 */
--breakpoint-2xl: 1280px; /* 桌面 */
```

## 9. Z-index 层级

```css
/* Z-index 层级管理 */
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

## 10. 组件设计规范

### 10.1 按钮组件 (Button)
#### 主要按钮 (Primary Button)
- **尺寸**：高度 48px (小屏), 52px (大屏)
- **圆角**：16px
- **字体**：16px, 字重 600
- **内边距**：16px 24px
- **背景**：主色渐变
- **文字**：白色
- **阴影**：柔和阴影
- **状态**：hover、active、disabled

#### 次要按钮 (Secondary Button)
- **背景**：白色
- **边框**：2px 主色
- **文字**：主色
- **其他规格同主按钮**

#### 幽灵按钮 (Ghost Button)
- **背景**：透明
- **文字**：主色
- **无边框**
- **下划线动画**

### 10.2 卡片组件 (Card)
#### 基础卡片
- **背景**：白色 95% 透明度
- **圆角**：16px
- **内边距**：20px
- **阴影**：玻璃态阴影
- **边框**：1px 半透明白色

#### 闪卡组件
- **尺寸**：16:9 比例
- **翻转动画**：3D 效果
- **正面**：图片 + 英文单词
- **背面**：中文释义 + 音频按钮

### 10.3 输入组件 (Input)
#### 文本输入
- **高度**：48px
- **圆角**：12px
- **内边距**：12px 16px
- **边框**：2px 浅灰色
- **聚焦状态**：主色边框 + 阴影

### 10.4 导航组件 (Navigation)
#### 底部导航
- **高度**：64px + 安全区域
- **背景**：白色 + 模糊效果
- **图标尺寸**：24px
- **激活状态**：主色
- **文字**：12px

### 10.5 游戏组件
#### 游戏卡片
- **尺寸**：120px x 120px
- **圆角**：20px
- **点击效果**：缩放 + 阴影
- **选中状态**：主色边框

#### 得分显示
- **字体**：32px, 粗体
- **颜色**：主色
- **动画**：数字变化动画

#### 进度条
- **高度**：8px
- **圆角**：4px
- **背景**：浅灰色
- **进度**：主色渐变
- **动画**：平滑过渡

## 11. 图标系统

### 11.1 图标尺寸
```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 40px;
--icon-2xl: 48px;
```

### 11.2 图标风格
- **线条粗细**：2px
- **圆角**：2px
- **风格**：友好、圆润
- **颜色**：支持主题色

## 12. 插画风格

### 12.1 卡通角色设计
- **风格**：扁平化 2.5D
- **颜色**：明亮、饱和
- **表情**：友好、可爱
- **动作**：生动、活泼

### 12.2 场景插画
- **风格**：简洁几何
- **透视**：等轴测视角
- **色彩**：柔和渐变
- **细节**：适度的装饰元素

## 13. 暗色模式适配

### 13.1 暗色主题色彩
```css
/* 暗色模式背景 */
--dark-bg-primary: #1a1a1a;
--dark-bg-secondary: #2d2d2d;
--dark-bg-tertiary: #404040;

/* 暗色模式文字 */
--dark-text-primary: #ffffff;
--dark-text-secondary: #b3b3b3;
--dark-text-tertiary: #808080;
```

### 13.2 切换动画
- **过渡时间**：300ms
- **动画曲线**：ease-in-out
- **过渡属性**：background-color, color, border-color

## 14. 无障碍设计

### 14.1 颜色对比度
- **正常文本**：至少 4.5:1
- **大文本**：至少 3:1
- **非文本元素**：至少 3:1

### 14.2 焦点状态
- **焦点环**：2px 主色实线
- **偏移**：2px
- **圆角**：匹配元素

### 14.3 触摸目标
- **最小尺寸**：44px x 44px
- **间距**：至少 8px
- **易用性**：充分考虑儿童操作

## 15. 性能优化

### 15.1 图片优化
- **格式**：WebP > PNG > JPG
- **尺寸**：多分辨率适配
- **懒加载**：视口内加载
- **压缩**：平衡质量和大小

### 15.2 动画优化
- **GPU 加速**：transform, opacity
- **避免重排**：减少 layout 属性变化
- **帧率**：保持 60fps
- **简化动画**：儿童友好不过度

---

这份设计规范为卡通英语闪卡APP提供了完整的视觉设计指导，确保产品在各个平台和设备上都能提供一致、友好的用户体验。