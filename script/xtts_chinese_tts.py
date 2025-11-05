#!/usr/bin/env python3
"""
XTTS中文TTS专用脚本
使用XTTS v2模型生成高质量中文语音
"""

import subprocess
import os
import sys
import json
import time
from pathlib import Path

def check_xtts_available():
    """检查XTTS模型是否可用"""
    print("检查XTTS模型可用性...")

    cmd = [
        'tts',
        '--model_name', 'tts_models/multilingual/multi-dataset/xtts_v2',
        '--list_speaker_idxs'
    ]

    # 设置环境变量
    env = os.environ.copy()
    env['COQUI_TTS_AGREED'] = 'true'

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30, env=env)

        if "terms of service" in result.stderr.lower():
            print("需要同意服务条款...")
            return False

        if result.returncode == 0:
            print("✓ XTTS模型可用")
            return True
        else:
            print(f"✗ XTTS模型不可用: {result.stderr}")
            return False

    except Exception as e:
        print(f"✗ 检查失败: {e}")
        return False

def wait_for_xtts_download():
    """等待XTTS模型下载完成"""
    print("等待XTTS模型下载完成...")

    download_status_file = os.path.expanduser('~/.local/share/tts/.xtts_download_status')

    # 检查模型文件是否存在
    model_path = os.path.expanduser('~/Library/Application Support/tts/tts_models--multilingual--multi-dataset--xtts_v2')

    max_wait_time = 1800  # 30分钟超时
    check_interval = 30   # 30秒检查一次
    waited_time = 0

    while waited_time < max_wait_time:
        if os.path.exists(model_path) and os.path.isdir(model_path):
            # 检查是否包含必要文件
            if os.path.exists(os.path.join(model_path, "model.pth")):
                print("✓ XTTS模型下载完成!")
                return True

        print(f"等待下载完成... ({waited_time//60}分钟{waited_time%60}秒)")
        time.sleep(check_interval)
        waited_time += check_interval

    print("✗ 下载超时")
    return False

def get_xtts_speakers():
    """获取XTTS支持的说话人列表"""
    print("获取XTTS说话人列表...")

    cmd = [
        'tts',
        '--model_name', 'tts_models/multilingual/multi-dataset/xtts_v2',
        '--list_speaker_idxs'
    ]

    env = os.environ.copy()
    env['COQUI_TTS_AGREED'] = 'true'

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60, env=env)

        if result.returncode == 0:
            output = result.stdout + result.stderr
            print("说话人查询结果:")

            # 尝试解析说话人ID
            import re

            # XTTS通常使用简单的数字ID
            speaker_matches = re.findall(r'\b\d+\b', output)
            if speaker_matches:
                speakers = list(set(speaker_matches))
                speakers.sort(key=lambda x: int(x))
                return speakers[:10]  # 返回前10个
            else:
                # 默认说话人列表
                return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        else:
            print(f"获取说话人失败: {result.stderr}")
            return []

    except Exception as e:
        print(f"获取说话人出错: {e}")
        return []

def generate_chinese_audio(text, speaker_id, output_path, language='zh-cn'):
    """使用XTTS生成中文音频"""
    cmd = [
        'tts',
        '--text', text,
        '--model_name', 'tts_models/multilingual/multi-dataset/xtts_v2',
        '--speaker_idx', speaker_id,
        '--language_idx', language,
        '--out_path', output_path
    ]

    env = os.environ.copy()
    env['COQUI_TTS_AGREED'] = 'true'

    try:
        print(f"正在生成中文音频: '{text}' (说话人: {speaker_id})")

        start_time = time.time()
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300, env=env)
        end_time = time.time()

        generation_time = end_time - start_time

        if result.returncode == 0:
            print(f"✓ 成功生成: {output_path}")
            print(f"  生成时间: {generation_time:.1f}秒")

            # 获取文件信息
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                print(f"  文件大小: {file_size:,} bytes ({file_size/1024/1024:.1f} MB)")

                # 尝试获取音频时长
                try:
                    duration_cmd = ['ffprobe', '-v', 'error', '-show_entries',
                                   'format=duration', output_path]
                    duration_result = subprocess.run(duration_cmd, capture_output=True, text=True, timeout=10)
                    if duration_result.returncode == 0:
                        for line in duration_result.stdout.split('\n'):
                            if 'Duration:' in line:
                                print(f"  音频时长: {line.strip()}")
                                break
                except:
                    pass

            return True
        else:
            print(f"✗ 生成失败: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print(f"✗ 生成超时 (说话人: {speaker_id})")
        return False
    except Exception as e:
        print(f"✗ 生成出错 (说话人: {speaker_id}): {str(e)}")
        return False

def batch_generate_chinese_audio():
    """批量生成中文音频样本"""
    # 中文测试文本
    chinese_texts = [
        "你好，这是XTTS中文语音测试。",
        "我喜欢学习中文。",
        "今天天气很好。",
        "苹果是一种水果。",
        "小猫很可爱。",
        "北京是中国的首都。",
        "我喜欢读书和听音乐。",
        "谢谢你帮助我。",
        "祝你生日快乐！",
        "我们一起学习吧。",
        "中国是一个伟大的国家。",
        "春天来了，花儿都开了。",
        "晚上可以看到星星。",
        "早上好！",
        "晚安，做个好梦。",
        "明天见！",
        "再见！",
        "欢迎来到中国！"
    ]

    # 等待XTTS下载完成
    if not check_xtts_available():
        print("XTTS模型正在下载中，请稍后再试...")
        if not wait_for_xtts_download():
            print("XTTS模型下载失败，无法继续。")
            return

    # 获取说话人列表
    speakers = get_xtts_speakers()
    if not speakers:
        print("无法获取说话人列表，使用默认说话人ID")
        speakers = ['1']

    print(f"可用说话人: {', '.join(speakers)}")

    # 选择说话人（如果用户指定的话）
    speaker_to_use = speakers[0] if speakers else '1'
    print(f"使用说话人: {speaker_to_use}")

    # 创建输出目录
    output_dir = Path("xtts_chinese_audio")
    output_dir.mkdir(exist_ok=True)

    print("=" * 60)
    print("开始批量生成XTTS中文音频...")
    print(f"将生成 {len(chinese_texts)} 个音频样本")
    print(f"输出目录: {output_dir}")
    print("=" * 60)

    success_count = 0
    failed_files = []

    # 批量生成
    for i, text in enumerate(chinese_texts, 1):
        print(f"[{i}/{len(chinese_texts)}] 处理文本: '{text}'")

        # 创建安全的文件名
        safe_text = text.replace(" ", "_").replace("。", "").replace("，", "").replace("！", "")
        safe_text = safe_text.replace("？", "").replace("：", "").replace("；", "")[:20]
        output_filename = f"xtts_chinese_{i}_{safe_text}.wav"
        output_path = output_dir / output_filename

        if generate_chinese_audio(text, speaker_to_use, str(output_path)):
            success_count += 1
        else:
            failed_files.append(output_filename)

        print("")  # 空行分隔

        # 避免过热，稍作等待
        time.sleep(2)

    # 输出总结
    print("=" * 60)
    print("XTTS中文音频批量生成完成!")
    print(f"成功: {success_count}/{len(chinese_texts)} 个样本")
    print(f"失败: {len(failed_files)} 个样本")

    if success_count > 0:
        print(f"\n生成的音频文件 (位于 {output_dir}):")

        # 列出成功生成的文件
        for i, text in enumerate(chinese_texts, 1):
            safe_text = text.replace(" ", "_").replace("。", "").replace("，", "").replace("！", "")
            safe_text = safe_text.replace("？", "").replace("：", "").replace("；", "")[:20]
            filename = f"xtts_chinese_{i}_{safe_text}.wav"
            full_path = output_dir / filename

            if os.path.exists(full_path):
                file_size = os.path.getsize(full_path)
                print(f"  - {filename} ({file_size:,} bytes) - '{text}'")

    if failed_files:
        print(f"\n失败的文件:")
        for filename in failed_files:
            print(f"  - {filename}")

    print(f"\nXTTS优势:")
    print("✓ 原生中文发音，准确自然")
    print("✓ 支持多种中文口音和说话人")
    print("✓ 专业音质，适合教育应用")
    print("✅ 支持批量生成")

    print(f"\n使用建议:")
    print("1. 播放生成的音频文件，听一下XTTS的中文发音效果")
    print("2. XTTS的中文质量非常高，非常适合你的闪卡项目")
    "3. 可以调整说话人ID获得不同的声音效果")
    print("4. 适合用于教学和语言学习应用")

def single_generate_chinese(text, speaker_id='1', language='zh-cn'):
    """生成单个中文音频"""
    # 等待XTTS下载完成
    if not check_xtts_available():
        print("XTTS模型正在下载中，请稍后再试...")
        if not wait_for_xtts_download():
            print("XTTS模型下载失败，无法继续。")
            return None

    # 创建输出目录
    output_dir = Path("xtts_chinese_audio")
    output_dir.mkdir(exist_ok=True)

    # 创建安全的文件名
    safe_text = text.replace(" ", "_").replace("。", "").replace("，", "").replace("！", "")
    safe_text = safe_text.replace("？", "").replace("：", "").replace("；", "")[:20]
    timestamp = int(time.time())
    output_filename = f"xtts_chinese_{timestamp}_{safe_text}.wav"
    output_path = output_dir / output_filename

    print(f"正在生成中文音频: '{text}' (说话人: {speaker_id})")

    if generate_chinese_audio(text, speaker_id, str(output_path), language):
        print(f"✓ 成功生成: {output_path}")
        return str(output_path)
    else:
        print("✗ 生成失败")
        return None

def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description='XTTS中文TTS工具')
    parser.add_argument('--text', type=str, help='要生成音频的中文文本')
    parser.add_argument('--speaker', type=str, default='1', help='说话人ID (默认: 1)')
    parser.add_argument('--language', type=str, default='zh-cn', help='语言代码 (默认: zh-cn)')
    parser.add_argument('--batch', action='store_true', help='批量生成测试音频')
    parser.add_argument('--output', type=str, help='输出文件路径')

    args = parser.parse_args()

    print("XTTS中文TTS工具")
    print("=" * 40)
    print("模型: XTTS v2")
    print("支持语言: 中文 (zh-cn)")

    if args.batch:
        # 批量生成模式
        batch_generate_chinese_audio()
    elif args.text:
        # 单个生成模式
        output_path = args.output or None
        result = single_generate_chinese(args.text, args.speaker, args.language)
        if result:
            print(f"音频已生成: {result}")
    else:
        # 显示使用说明
        print("\n使用方法:")
        print("1. 生成单个音频:")
        print("   python3 xtts_chinese_tts.py --text '你好，这是XTTS测试' --speaker 1")
        print("")
        print("2. 批量生成测试音频:")
        print("   python3 xtts_chinese_tts.py --batch")
        print("")
        print("3. 指定输出文件:")
        print("   python3 xtts_chinese_tts.py --text '你好' --output custom_name.wav")
        print("")
        print("4. 指定说话人和语言:")
        print("   python3 xtts_chinese_tts.py --text '你好' --speaker 2 --language zh-tw")

if __name__ == "__main__":
    main()