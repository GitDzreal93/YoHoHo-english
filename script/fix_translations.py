#!/usr/bin/env python3
"""
直接修复categories.json中的中文翻译
"""

import json
import re

def load_categories():
    """加载categories.json文件"""
    with open('categories.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_categories(data):
    """保存categories.json文件"""
    with open('categories.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def create_translation_fixes():
    """创建翻译修复映射"""
    return {
        # 动物类翻译修复
        "Aardwolf": "土狼",
        "African大象": "非洲大象",
        "African狮子": "非洲狮",
        "AiredaleTerrier": "万能梗",
        "Arctic狐狸": "北极狐",
        "Bald老鹰": "白头鹰",
        "Beluga鲸鱼": "白鲸",
        "BlackWidow蜘蛛": "黑寡妇蜘蛛",
        "BlueMorpho蝴蝶": "蓝色闪蝶",
        "蓝色鲸鱼": "蓝鲸",
        "Common蚂蚁": "普通羚羊",
        "Common青蛙": "普通青蛙",
        "Common房子老鼠": "家鼠",
        "Common猪": "鸽子",
        "Common大老鼠": "褐家鼠",
        "Domestic鸡肉": "家鸡",
        "Emperor企鹅": "帝企鹅",
        "Emperor企鹅鸡肉": "帝企鹅宝宝",
        "Fennec狐狸": "耳廓狐",
        "Giant蚂蚁": "大食蚁兽",
        "Giant熊猫": "大熊猫",
        "绿色海豹乌龟": "绿海龟",
        "Guinea猪": "豚鼠",
        "Honey蜜蜂": "蜜蜂",
        "Irrawaddy海豚": "伊洛瓦底江海豚",
        "Jack章鱼Lantern": "杰克灯笼",
        "Jade笔": "玉坠",
        "Kerry蓝色Terrier": "凯利蓝梗",
        "KomodoDragon": "科莫多巨蜥",
        "Location菠萝": "位置图钉",
        "Mandarin鸭": "鸳鸯",
        "Maned狼": "鬃狼",
        "MarineIguana": "海鬣蜥",
        "Mole大老鼠": "鼹鼠",
        "MuskLorikeet": "彩虹鹦鹉",
        "Ominous鸭": "不祥之鸭",

        # 常见动物名称修复
        "Bull": "公牛",
        "Bullfrog": "牛蛙",
        "Bunny": "小兔子",
        "Canine": "犬科动物",
        "Colt": "小马驹",
        "Colt": "小马驹",
        "Fawn": "小鹿",
        "Filly": "小母马",
        "Foal": "小马驹",
        "Gander": "雄鹅",
        "Gosling": "小鹅",
        "Hatchling": "刚孵化的鸟",
        "Kid": "小山羊",
        "Kitten": "小猫",
        "Lamb": "小羊羔",
        "Larva": "幼虫",
        "Mare": "母马",
        "Nymph": "若虫",
        "Puppy": "小狗",
        "Stallion": "公马",
        "Tadpole": "蝌蚪",

        # 食物类翻译修复
        "苹果Magic老鼠": "苹果魔术鼠标",
        "鸡肉油炸的": "炸鸡",
        "鸡肉烤的": "烤鸡",
        "鸡肉生的": "生鸡肉",
        "鱼Rod": "钓鱼竿",
        "鱼RodAndTackleSet": "钓鱼竿和钓具套装",
        "鱼熟的": "熟鱼",
        "鱼生的": "生鱼",

        # 鸟类翻译修复
        "BirdFeeder": "喂鸟器",
        "蓝色Morpho蝴蝶": "蓝色大闪蝶",

        # 交通工具翻译修复
        "马Drawn汽车": "马车",
        "马Saddle": "马鞍",

        # 其他修复
        "Antikythera蚂蚁": "安提基特拉机械",
        "BoardingPass": "登机牌",
        "CampfireGrillGrate": "篝火烤架",
        "CannedTuna": "金枪鱼罐头",
        "Cricket蝙蝠": "板球拍",
        "Domestic鸡肉": "家鸡",
        "Emperor企鹅鸡肉": "帝企鹅宝宝",
        "Fennec狐狸": "耳廓狐",
        "Gaming老鼠": "游戏鼠标",
        "Giant蚂蚁": "大食蚁兽",
        "GoldenRetriever狗": "金毛寻回犬",
        "绿色海豹乌龟": "绿海龟",
        "Guinea猪": "豚鼠",
        "Honey蜜蜂": "蜜蜂",
        "HorseDrawn汽车": "马车",
        "HorseSaddle": "马鞍",
        "Irrawaddy海豚": "伊洛瓦底江海豚",
        "Jack章鱼Lantern": "杰克灯笼",
        "Jade笔": "玉坠",
        "Location菠萝": "位置图钉",
        "MagicLantern": "魔法灯笼",
        "MahjongBoard": "麻将牌",
        "Mandarin鸭": "鸳鸯",
        "Maned狼": "鬃狼",
        "MarineIguana": "海鬣蜥",
        "Mole大老鼠": "鼹鼠",
        "NikeVaporfly": "耐克飞马",
        "Ominous鸭": "不祥之鸭",
    }

def fix_common_patterns(chinese_text):
    """修复常见的翻译模式"""
    # 修复直接拼接的英文词
    patterns = [
        (r'([A-Z][a-z]+)([一-龯]+)', lambda m: f"{m.group(2)}{m.group(1)}"),
        (r'([一-龯]+)([A-Z][a-z]+)', lambda m: f"{m.group(1)}{m.group(2)}"),
    ]

    result = chinese_text
    for pattern, replacement in patterns:
        result = re.sub(pattern, replacement, result)

    # 修复一些常见错误
    fixes = {
        '大象': '大象',
        '狮子': '狮子',
        '狐狸': '狐狸',
        '老鼠': '老鼠',
        '海豚': '海豚',
        '鲸鱼': '鲸鱼',
        '蜘蛛': '蜘蛛',
        '蝴蝶': '蝴蝶',
        '乌龟': '乌龟',
        '青蛙': '青蛙',
        '蜜蜂': '蜜蜂',
        '蚂蚁': '蚂蚁',
        '螃蟹': '螃蟹',
        '蛇': '蛇',
        '鱼': '鱼',
        '鸟': '鸟',
        '马': '马',
        '狗': '狗',
        '猫': '猫',
        '猪': '猪',
        '牛': '牛',
        '羊': '羊',
        '鸡': '鸡',
        '鸭': '鸭',
        '鹅': '鹅',
    }

    # 简单的规则：如果中文字符后面有英文，尝试合理组合
    for eng, chi in fixes.items():
        if eng.lower() in chinese_text.lower():
            # 保留中文部分
            pass

    return result

def improve_animal_translations(chinese_text, english_text):
    """改进动物翻译"""
    # 动物名称映射
    animal_names = {
        'aardwolf': '土狼',
        'african': '非洲',
        'elephant': '大象',
        'lion': '狮子',
        'eagle': '鹰',
        'bald': '白头',
        'fox': '狐狸',
        'arctic': '北极',
        'whale': '鲸鱼',
        'beluga': '白鲸',
        'penguin': '企鹅',
        'emperor': '帝',
        'panda': '熊猫',
        'giant': '大',
        'anteater': '食蚁兽',
        'turtle': '海龟',
        'sea turtle': '海龟',
        'green': '绿色',
        'bee': '蜜蜂',
        'honey': '蜜蜂',
        'dolphin': '海豚',
        'irrawaddy': '伊洛瓦底江',
        'duck': '鸭',
        'dragon': '龙',
        'komodo': '科莫多',
        'iguana': '鬣蜥',
        'marine': '海',
        'rat': '鼠',
        'house mouse': '家鼠',
        'mouse': '老鼠',
        'mole': '鼹鼠',
        'antelope': '羚羊',
        'common': '普通',
        'frog': '青蛙',
        'pigeon': '鸽子',
        'sparrow': '麻雀',
        'butterfly': '蝴蝶',
        'morpho': '闪蝶',
        'blue': '蓝色',
        'spider': '蜘蛛',
        'widow': '寡妇',
        'black': '黑色',
        'retriever': '寻回犬',
        'golden': '金色',
        'dog': '狗',
        'terrier': '梗',
        'airedale': '万能',
        'kerry': '凯利',
        'blue': '蓝色',
        'fennec': '耳廓',
        'cricket': '蟋蟀',
        'bat': '蝙蝠',
        'lizard': '蜥蜴',
        'monitor': '巨蜥',
    }

    english_lower = english_text.lower()
    chinese_parts = []

    # 按英文单词拆分并翻译
    words = english_lower.replace('-', ' ').split()
    for word in words:
        if word in animal_names:
            chinese_parts.append(animal_names[word])

    if chinese_parts:
        return ''.join(chinese_parts)

    return chinese_text

def fix_translations():
    """修复翻译"""
    print("正在加载categories.json...")
    data = load_categories()

    print("正在修复翻译...")
    fixes = create_translation_fixes()

    total_fixes = 0
    for category in data['categories']:
        for image in category['images']:
            original_cn = image['word']['cn']
            original_en = image['word']['en']

            # 应用直接修复
            if original_cn in fixes:
                image['word']['cn'] = fixes[original_cn]
                total_fixes += 1
                continue

            # 应用动物翻译改进
            if category['id'] == 'animals':
                improved = improve_animal_translations(original_cn, original_en)
                if improved != original_cn:
                    image['word']['cn'] = improved
                    total_fixes += 1
                    continue

            # 通用模式修复
            fixed = fix_common_patterns(original_cn)
            if fixed != original_cn:
                image['word']['cn'] = fixed
                total_fixes += 1

    print(f"修复了 {total_fixes} 个翻译")

    print("正在保存修复后的文件...")
    save_categories(data)

    print("翻译修复完成！")

def main():
    """主函数"""
    fix_translations()

if __name__ == "__main__":
    main()