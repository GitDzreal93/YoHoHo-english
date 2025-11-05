#!/usr/bin/env python3
"""
转换 categories.json 文件结构的脚本
将简单的文件名数组转换为包含英文单词、中文翻译和语音文件名的对象数组
"""

import json
import re
import os
from pathlib import Path

def clean_filename_to_word(filename):
    """
    将文件名转换为英文单词
    例如: "chicken-raw.png" -> "chicken raw"
         "cat-edk7q2.png" -> "cat"
         "apple-juice.png" -> "apple juice"
    """
    # 移除 .png 扩展名
    base_name = filename.replace('.png', '')

    # 更精确地移除随机字母数字后缀（如 -edk7q2, -68rc1e）
    # 匹配模式：连字符后跟3-10个字符，包含至少2个数字或混合字母数字
    # 这样避免误删真正的词汇
    base_name = re.sub(r'-[a-zA-Z]*[0-9][a-zA-Z0-9]{2,9}$', '', base_name)

    # 处理简单的数字后缀（如 -1, -2）
    base_name = re.sub(r'-\d+$', '', base_name)

    # 将连字符替换为空格
    word = base_name.replace('-', ' ')

    # 转换为合适的大小写格式（首字母大写，其余小写）
    # 但保留一些特殊缩写的大写
    special_words = {
        'ai': 'AI',
        'tts': 'TTS',
        'cpu': 'CPU',
        'led': 'LED',
        'usb': 'USB',
        'wifi': 'Wi-Fi',
        'tv': 'TV',
        'pc': 'PC',
        'dna': 'DNA',
        'phd': 'PhD',
        'mri': 'MRI',
        'xray': 'X-ray'
    }

    words = word.split()
    result_words = []

    for w in words:
        lower_w = w.lower()
        if lower_w in special_words:
            result_words.append(special_words[lower_w])
        else:
            # 首字母大写，其余小写
            result_words.append(w.capitalize())

    return ' '.join(result_words)

def translate_to_chinese(english_word, category_id):
    """
    根据分类和英文单词生成中文翻译
    针对儿童学习优化翻译
    """

    # 常用词汇翻译字典
    common_translations = {
        # 动物类
        'dog': '狗', 'cat': '猫', 'bird': '鸟', 'fish': '鱼', 'bear': '熊',
        'elephant': '大象', 'tiger': '老虎', 'lion': '狮子', 'panda': '熊猫',
        'rabbit': '兔子', 'fox': '狐狸', 'deer': '鹿', 'horse': '马',
        'pig': '猪', 'sheep': '羊', 'cow': '牛', 'chicken': '鸡', 'duck': '鸭',
        'butterfly': '蝴蝶', 'bee': '蜜蜂', 'ant': '蚂蚁', 'spider': '蜘蛛',
        'snake': '蛇', 'turtle': '乌龟', 'frog': '青蛙', 'whale': '鲸鱼',
        'dolphin': '海豚', 'shark': '鲨鱼', 'octopus': '章鱼', 'crab': '螃蟹',

        # 食物类
        'apple': '苹果', 'banana': '香蕉', 'orange': '橙子', 'grape': '葡萄',
        'strawberry': '草莓', 'watermelon': '西瓜', 'pineapple': '菠萝',
        'bread': '面包', 'rice': '米饭', 'noodle': '面条', 'egg': '鸡蛋',
        'milk': '牛奶', 'water': '水', 'juice': '果汁', 'coffee': '咖啡',
        'tea': '茶', 'cake': '蛋糕', 'cookie': '饼干', 'chocolate': '巧克力',
        'hamburger': '汉堡包', 'pizza': '披萨', 'sandwich': '三明治',
        'ice cream': '冰淇淋', 'cheese': '奶酪', 'butter': '黄油',

        # 交通工具类
        'car': '汽车', 'bus': '公交车', 'train': '火车', 'airplane': '飞机',
        'bicycle': '自行车', 'motorcycle': '摩托车', 'boat': '船', 'ship': '轮船',
        'subway': '地铁', 'taxi': '出租车', 'truck': '卡车', 'helicopter': '直升机',

        # 颜色
        'red': '红色', 'blue': '蓝色', 'green': '绿色', 'yellow': '黄色',
        'black': '黑色', 'white': '白色', 'orange': '橙色', 'purple': '紫色',
        'pink': '粉色', 'brown': '棕色', 'gray': '灰色',

        # 数字
        'one': '一', 'two': '二', 'three': '三', 'four': '四', 'five': '五',
        'six': '六', 'seven': '七', 'eight': '八', 'nine': '九', 'ten': '十',

        # 常用物品
        'book': '书', 'pen': '笔', 'pencil': '铅笔', 'paper': '纸',
        'table': '桌子', 'chair': '椅子', 'bed': '床', 'door': '门',
        'window': '窗户', 'house': '房子', 'home': '家', 'school': '学校',
        'phone': '电话', 'computer': '电脑', 'television': '电视',
        'clock': '时钟', 'watch': '手表', 'glasses': '眼镜', 'shoes': '鞋子',

        # 地点
        'airport': '机场', 'hospital': '医院', 'park': '公园', 'library': '图书馆',
        'restaurant': '餐厅', 'store': '商店', 'bank': '银行', 'post office': '邮局',
        'police station': '警察局', 'fire station': '消防站', 'zoo': '动物园',
        'museum': '博物馆', 'cinema': '电影院', 'theater': '剧院',

        # 身体部位
        'head': '头', 'eye': '眼睛', 'nose': '鼻子', 'mouth': '嘴',
        'ear': '耳朵', 'hand': '手', 'foot': '脚', 'arm': '手臂',
        'leg': '腿', 'hair': '头发', 'face': '脸', 'body': '身体',
    }

    # 首先检查常用翻译字典
    lower_word = english_word.lower()
    if lower_word in common_translations:
        return common_translations[lower_word]

    # 根据分类进行专门翻译
    category_translations = {
        'animals': {
            'wolf': '狼', 'goat': '山羊', 'mouse': '老鼠', 'rat': '大老鼠',
            'squirrel': '松鼠', 'bat': '蝙蝠', 'owl': '猫头鹰', 'eagle': '老鹰',
            'penguin': '企鹅', 'seal': '海豹', 'walrus': '海象', 'otter': '水獭'
        },
        'food_and_drink': {
            'apple juice': '苹果汁', 'orange juice': '橙汁', 'grape juice': '葡萄汁',
            'tomato': '番茄', 'potato': '土豆', 'onion': '洋葱', 'carrot': '胡萝卜',
            'lettuce': '生菜', 'cucumber': '黄瓜', 'salad': '沙拉', 'soup': '汤'
        },
        'transportation': {
            'sports car': '跑车', 'race car': '赛车', 'fire truck': '消防车',
            'ambulance': '救护车', 'police car': '警车', 'taxi': '出租车'
        },
        'buildings_and_places': {
            'skyscraper': '摩天大楼', 'bridge': '桥', 'tower': '塔',
            'castle': '城堡', 'palace': '宫殿', 'temple': '寺庙',
            'church': '教堂', 'stadium': '体育场', 'museum': '博物馆'
        },
        'clothing_and_accessories': {
            't shirt': 'T恤', 'jeans': '牛仔裤', 'dress': '连衣裙',
            'shirt': '衬衫', 'coat': '外套', 'jacket': '夹克',
            'hat': '帽子', 'glasses': '眼镜', 'shoes': '鞋子', 'socks': '袜子'
        },
        'nature': {
            'tree': '树', 'flower': '花', 'mountain': '山', 'river': '河流',
            'lake': '湖', 'ocean': '海洋', 'beach': '海滩', 'forest': '森林',
            'sun': '太阳', 'moon': '月亮', 'star': '星星', 'cloud': '云'
        },
        'technology': {
            'computer': '电脑', 'laptop': '笔记本电脑', 'phone': '手机',
            'tablet': '平板电脑', 'camera': '相机', 'television': '电视',
            'radio': '收音机', 'speaker': '扬声器', 'headphone': '耳机'
        }
    }

    if category_id in category_translations:
        if lower_word in category_translations[category_id]:
            return category_translations[category_id][lower_word]

    # 如果没有找到翻译，尝试智能翻译
    return smart_translate(english_word, category_id)

def smart_translate(english_word, category_id):
    """
    智能翻译系统，用于处理不在字典中的词汇
    """
    # 扩展的常用词汇翻译字典（局部定义）
    common_translations_local = {
        # 动物类
        'dog': '狗', 'cat': '猫', 'bird': '鸟', 'fish': '鱼', 'bear': '熊',
        'elephant': '大象', 'tiger': '老虎', 'lion': '狮子', 'panda': '熊猫',
        'rabbit': '兔子', 'fox': '狐狸', 'deer': '鹿', 'horse': '马',
        'pig': '猪', 'sheep': '羊', 'cow': '牛', 'chicken': '鸡', 'duck': '鸭',
        'butterfly': '蝴蝶', 'bee': '蜜蜂', 'ant': '蚂蚁', 'spider': '蜘蛛',
        'snake': '蛇', 'turtle': '乌龟', 'frog': '青蛙', 'whale': '鲸鱼',
        'dolphin': '海豚', 'shark': '鲨鱼', 'octopus': '章鱼', 'crab': '螃蟹',
        'wolf': '狼', 'goat': '山羊', 'mouse': '老鼠', 'rat': '大老鼠',
        'squirrel': '松鼠', 'bat': '蝙蝠', 'owl': '猫头鹰', 'eagle': '老鹰',
        'penguin': '企鹅', 'seal': '海豹', 'walrus': '海象', 'otter': '水獭',

        # 食物类
        'apple': '苹果', 'banana': '香蕉', 'orange': '橙子', 'grape': '葡萄',
        'strawberry': '草莓', 'watermelon': '西瓜', 'pineapple': '菠萝',
        'bread': '面包', 'rice': '米饭', 'noodle': '面条', 'egg': '鸡蛋',
        'milk': '牛奶', 'water': '水', 'juice': '果汁', 'coffee': '咖啡',
        'tea': '茶', 'cake': '蛋糕', 'cookie': '饼干', 'chocolate': '巧克力',
        'hamburger': '汉堡包', 'pizza': '披萨', 'sandwich': '三明治',
        'ice cream': '冰淇淋', 'cheese': '奶酪', 'butter': '黄油',
        'tomato': '番茄', 'potato': '土豆', 'onion': '洋葱', 'carrot': '胡萝卜',
        'lettuce': '生菜', 'cucumber': '黄瓜', 'salad': '沙拉', 'soup': '汤',
        'meat': '肉', 'beef': '牛肉', 'pork': '猪肉', 'chicken': '鸡肉',
        'fish': '鱼', 'raw': '生的', 'cooked': '熟的', 'roasted': '烤的',
        'fried': '油炸的', 'boiled': '煮的',

        # 交通工具类
        'car': '汽车', 'bus': '公交车', 'train': '火车', 'airplane': '飞机',
        'bicycle': '自行车', 'motorcycle': '摩托车', 'boat': '船', 'ship': '轮船',
        'subway': '地铁', 'taxi': '出租车', 'truck': '卡车', 'helicopter': '直升机',
        'sports car': '跑车', 'race car': '赛车', 'fire truck': '消防车',
        'ambulance': '救护车', 'police car': '警车',

        # 颜色和形容词
        'red': '红色', 'blue': '蓝色', 'green': '绿色', 'yellow': '黄色',
        'black': '黑色', 'white': '白色', 'orange': '橙色', 'purple': '紫色',
        'pink': '粉色', 'brown': '棕色', 'gray': '灰色',
        'big': '大', 'small': '小', 'large': '大', 'tiny': '微小',
        'long': '长', 'short': '短', 'round': '圆', 'square': '方',

        # 数字
        'one': '一', 'two': '二', 'three': '三', 'four': '四', 'five': '五',
        'six': '六', 'seven': '七', 'eight': '八', 'nine': '九', 'ten': '十',

        # 常用物品
        'book': '书', 'pen': '笔', 'pencil': '铅笔', 'paper': '纸',
        'table': '桌子', 'chair': '椅子', 'bed': '床', 'door': '门',
        'window': '窗户', 'house': '房子', 'home': '家', 'school': '学校',
        'phone': '电话', 'computer': '电脑', 'television': '电视',
        'clock': '时钟', 'watch': '手表', 'glasses': '眼镜', 'shoes': '鞋子',

        # 地点
        'airport': '机场', 'hospital': '医院', 'park': '公园', 'library': '图书馆',
        'restaurant': '餐厅', 'store': '商店', 'bank': '银行', 'post office': '邮局',
        'police station': '警察局', 'fire station': '消防站', 'zoo': '动物园',
        'museum': '博物馆', 'cinema': '电影院', 'theater': '剧院',

        # 身体部位
        'head': '头', 'eye': '眼睛', 'nose': '鼻子', 'mouth': '嘴',
        'ear': '耳朵', 'hand': '手', 'foot': '脚', 'arm': '手臂',
        'leg': '腿', 'hair': '头发', 'face': '脸', 'body': '身体',
    }

    # 处理复合词
    words = english_word.split()

    # 如果是单个词，尝试直接翻译
    if len(words) == 1:
        word_lower = words[0].lower()
        if word_lower in common_translations_local:
            return common_translations_local[word_lower]
        else:
            # 检查是否是专业术语
            if category_id == 'animals':
                return english_word  # 保持原样，可能需要手动翻译
            elif category_id == 'food_and_drink':
                return f"{english_word}"  # 不添加类别说明，保持简洁
            else:
                return english_word  # 保持原样，需要后续手动翻译

    # 如果是复合词，尝试翻译每个部分
    translated_parts = []
    for word in words:
        word_lower = word.lower()
        if word_lower in common_translations_local:
            translated_parts.append(common_translations_local[word_lower])
        else:
            # 尝试部分匹配（比如 'cooked' 匹配 'cook'）
            for trans_word, trans_value in common_translations_local.items():
                if word_lower.startswith(trans_word) or trans_word.startswith(word_lower):
                    translated_parts.append(trans_value)
                    break
            else:
                translated_parts.append(word)  # 保持原样

    # 组合翻译结果
    if translated_parts:
        return ''.join(translated_parts) if len(translated_parts) <= 2 else ''.join(translated_parts)

    # 最后的备选方案
    return english_word

def create_voice_filename(filename):
    """
    创建语音文件名
    例如: "apple-juice.png" -> {"cn": "apple-juice_cn.wav", "en": "apple-juice_en.wav"}
    """
    base_name = filename.replace('.png', '')

    # 使用与clean_filename_to_word相同的逻辑移除随机后缀
    base_name = re.sub(r'-[a-zA-Z]*[0-9][a-zA-Z0-9]{2,9}$', '', base_name)
    base_name = re.sub(r'-\d+$', '', base_name)

    return {
        "cn": f"{base_name}_cn.wav",
        "en": f"{base_name}_en.wav"
    }

def transform_categories(input_file, output_file=None):
    """
    转换 categories.json 文件
    """
    if output_file is None:
        output_file = input_file

    # 读取原始文件
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"开始转换 {len(data['categories'])} 个分类...")

    total_processed = 0
    total_failed = 0

    # 转换每个分类
    for category in data['categories']:
        category_id = category['id']
        original_images = category['images']
        transformed_images = []

        print(f"\n处理分类: {category_id} ({category['name']['en']})")
        print(f"原始图片数量: {len(original_images)}")

        failed_in_category = 0

        for filename in original_images:
            try:
                # 生成英文单词
                english_word = clean_filename_to_word(filename)

                # 生成中文翻译
                chinese_word = translate_to_chinese(english_word, category_id)

                # 生成语音文件名
                voice_filenames = create_voice_filename(filename)

                # 创建新的图片对象
                image_object = {
                    "filename": filename,
                    "word": {
                        "cn": chinese_word,
                        "en": english_word
                    },
                    "voice_filename": voice_filenames
                }

                transformed_images.append(image_object)

            except Exception as e:
                print(f"处理文件 {filename} 时出错: {e}")
                # 创建一个基本的对象，即使翻译失败
                english_word = clean_filename_to_word(filename)
                image_object = {
                    "filename": filename,
                    "word": {
                        "cn": english_word,  # 使用英文作为备用
                        "en": english_word
                    },
                    "voice_filename": create_voice_filename(filename)
                }
                transformed_images.append(image_object)
                failed_in_category += 1

        # 更新分类的图片数组
        category['images'] = transformed_images
        category['count'] = len(transformed_images)

        total_processed += len(transformed_images)
        total_failed += failed_in_category

        print(f"转换完成: {len(transformed_images)} 个图片对象")
        if failed_in_category > 0:
            print(f"警告: {failed_in_category} 个文件处理时遇到问题")

    # 更新统计信息
    data['statistics']['total_images'] = total_processed
    data['statistics']['categorized_images'] = total_processed

    print(f"\n=== 转换总结 ===")
    print(f"总处理图片数: {total_processed}")
    print(f"处理失败数: {total_failed}")
    print(f"成功率: {((total_processed - total_failed) / total_processed * 100):.1f}%")

    # 备份原始文件
    backup_file = input_file.replace('.json', '_backup.json')
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"原始文件已备份到: {backup_file}")

    # 写入转换后的文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"转换完成！结果已保存到: {output_file}")

    return data

def main():
    """主函数"""
    input_file = 'categories_original.json'
    output_file = 'categories.json'

    if not os.path.exists(input_file):
        print(f"错误: 找不到文件 {input_file}")
        return

    print("categories.json 结构转换脚本")
    print("=" * 50)

    try:
        # 执行转换
        transform_categories(input_file, output_file)

        print("\n转换成功完成！")
        print("建议检查转换结果，特别是中文翻译的准确性。")

    except Exception as e:
        print(f"转换过程中出现错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()