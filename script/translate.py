import json
import asyncio
from googletrans import Translator

async def translate_text(translator, text, dest_language='zh-cn'):
    """
    Translates the given text to the specified destination language.
    """
    try:
        translation = await translator.translate(text, dest=dest_language)
        return translation.text
    except Exception as e:
        print(f"Error translating '{text}': {type(e).__name__} - {e}")
        return text

async def fix_translations():
    """
    Reads the categories.json file, translates the word.cn fields, and saves the updated file.
    """
    with open('categories.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    translator = Translator()
    for category in data['categories']:
        for image in category['images']:
            english_word = image['word']['en']
            chinese_word = image['word']['cn']

            # If the Chinese word is the same as the English word, or if it contains non-Chinese characters,
            # then it needs to be translated.
            if chinese_word == english_word or any(char.isalpha() for char in chinese_word):
                print(f"Translating '{english_word}' to Chinese...")
                image['word']['cn'] = await translate_text(translator, english_word)

    with open('categories.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    asyncio.run(fix_translations())