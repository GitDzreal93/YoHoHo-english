#!/usr/bin/env python3
"""
VITS p273 English TTS Generator
使用VITS模型的p273说话人为categories.json中的英文单词生成音频文件
"""

import subprocess
import os
import sys
import json
from pathlib import Path

def check_tts_available():
    """检查tts命令是否可用"""
    try:
        result = subprocess.run(['tts', '--help'], capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def create_output_directory():
    """创建输出目录"""
    output_dir = Path("resource/voice/en")
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir

def parse_categories_json():
    """解析categories.json文件，提取英文单词和对应的文件名"""
    try:
        with open('categories.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        items = []
        categories = data.get('categories', [])

        for category in categories:
            category_name = category.get('name', {}).get('en', 'Unknown')
            images = category.get('images', [])

            for image in images:
                word_en = image.get('word', {}).get('en', '')
                voice_filename_en = image.get('voice_filename', {}).get('en', '')
                filename = image.get('filename', '')

                if word_en and voice_filename_en:
                    items.append({
                        'word_en': word_en,
                        'voice_filename_en': voice_filename_en,
                        'filename': filename,
                        'category': category_name
                    })

        return items

    except FileNotFoundError:
        print("错误: 找不到categories.json文件")
        return []
    except json.JSONDecodeError as e:
        print(f"错误: categories.json格式错误: {e}")
        return []
    except Exception as e:
        print(f"错误: 解析categories.json时出错: {e}")
        return []

def generate_vits_audio(text, output_path, speaker_id="p273"):
    """使用VITS模型生成音频"""
    cmd = [
        'tts',
        '--text', text,
        '--model_name', 'tts_models/en/vctk/vits',
        '--speaker_idx', speaker_id,
        '--out_path', output_path
    ]

    try:
        print(f"正在生成音频: '{text}' -> {output_path}")
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        if result.returncode == 0:
            print(f"✓ 成功生成: {output_path}")
            return True
        else:
            print(f"✗ 生成失败: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print(f"✗ 生成超时: {text}")
        return False
    except Exception as e:
        print(f"✗ 生成出错: {text} - {str(e)}")
        return False

def batch_generate_english_audio():
    """批量生成英文音频文件"""
    # 检查tts命令是否可用
    if not check_tts_available():
        print("错误: 找不到tts命令。请确保已安装Coqui TTS库并且tts命令在PATH中。")
        print("安装方法: pip install TTS")
        sys.exit(1)

    # 创建输出目录
    output_dir = create_output_directory()
    print(f"输出目录: {output_dir.absolute()}")

    # 解析categories.json
    items = parse_categories_json()
    if not items:
        print("错误: 没有找到有效的音频生成项目")
        sys.exit(1)

    print(f"找到 {len(items)} 个音频生成项目")

    success_count = 0
    failed_count = 0
    skipped_count = 0

    print("=" * 80)
    print("开始使用VITS p273生成英文音频...")
    print("=" * 80)

    # 批量生成音频
    for i, item in enumerate(items, 1):
        word_en = item['word_en']
        voice_filename_en = item['voice_filename_en']
        category = item['category']

        print(f"\n[{i}/{len(items)}] 处理: {word_en} (分类: {category})")

        # 输出文件路径
        output_path = output_dir / voice_filename_en

        # 检查文件是否已存在
        if output_path.exists():
            print(f"跳过已存在的文件: {voice_filename_en}")
            skipped_count += 1
            continue

        # 生成音频
        if generate_vits_audio(word_en, str(output_path), "p273"):
            success_count += 1
        else:
            failed_count += 1

    # 输出总结
    print("\n" + "=" * 80)
    print("VITS p273 英文音频生成完成!")
    print("=" * 80)
    print(f"总项目数: {len(items)}")
    print(f"成功生成: {success_count}")
    print(f"生成失败: {failed_count}")
    print(f"跳过已存在: {skipped_count}")

    if success_count > 0:
        print(f"\n生成的音频文件保存在: {output_dir.absolute()}")
        print("\n部分生成的文件:")
        for i, item in enumerate(items[:10], 1):  # 显示前10个
            voice_filename_en = item['voice_filename_en']
            word_en = item['word_en']
            full_path = output_dir / voice_filename_en
            if full_path.exists():
                file_size = full_path.stat().st_size
                print(f"  {i}. {voice_filename_en} ({file_size:,} bytes) - '{word_en}'")

        if len(items) > 10:
            print(f"  ... 还有 {len(items) - 10} 个文件")

    print(f"\nVITS p273 特点:")
    print("✓ 高质量英文发音")
    print("✓ p273说话人声音清晰自然")
    print("✓ 适合英语学习和教育应用")
    print("✓ 文件大小适中，生成速度快")

    print(f"\n使用建议:")
    print("1. 播放生成的音频文件，听一下p273的声音效果")
    print("2. VITS p273的英文质量很好，适合你的闪卡项目")
    print("3. 可以配合中文音频一起使用")

def main():
    """主函数"""
    print("VITS p273 英文TTS生成器")
    print("=" * 50)
    print("模型: VITS (tts_models/en/vctk/vits)")
    print("说话人: p273")
    print("目标语言: 英文")
    print("数据源: categories.json")

    batch_generate_english_audio()

if __name__ == "__main__":
    main()