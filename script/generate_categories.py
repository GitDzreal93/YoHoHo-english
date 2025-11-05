#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
卡通英语闪卡 - 图片分类脚本
根据图片文件名将其分类到不同的主题类别，并创建分类文件夹
"""

import json
import os
import re
import shutil

# 定义分类规则
CATEGORIES = {
    "animals": {
        "en": "Animals",
        "zh": "动物",
        "keywords": [
            "dog", "cat", "bird", "fish", "wolf", "bear", "elephant", "tiger", "lion",
            "monkey", "zebra", "giraffe", "panda", "penguin", "dolphin", "whale", "shark",
            "rabbit", "fox", "deer", "moose", "cow", "pig", "sheep", "goat", "horse",
            "chicken", "duck", "goose", "eagle", "hawk", "owl", "parrot", "swan",
            "crocodile", "alligator", "snake", "lizard", "turtle", "frog", "salamander",
            "butterfly", "bee", "ant", "spider", "ladybug", "dragonfly", "beetle",
            "octopus", "squid", "crab", "lobster", "shrimp", "seal", "walrus", "otter",
            "beaver", "squirrel", "chipmunk", "hedgehog", "porcupine", "bat", "mole",
            "dinosaur", "dragon", "unicorn", "mammoth", "saurus", "raptor",
            "terrier", "retriever", "poodle", "huskie", "corgi", "dachshund",
            "sparrow", "pigeon", "crow", "raven", "flamingo", "pelican",
            "camel", "llama", "alpaca", "yak", "buffalo", "bison",
            "kangaroo", "koala", "wombat", "platypus", "echidna",
            "leopard", "cheetah", "jaguar", "panther", "lynx",
            "gorilla", "orangutan", "chimpanzee", "gibbon",
            "narwhal", "beluga", "orca", "manatee", "dugong",
            "rhinoceros", "hippopotamus", "warthog", "boar",
            "raccoon", "badger", "skunk", "ferret", "mink", "weasel", "stoat",
            "antelope", "gazelle", "impala", "gnu", "eland",
            "sloth", "armadillo", "anteater", "tamarin", "marmoset",
            "chameleon", "iguana", "gecko", "komodo", "gharial",
            "axolotl", "newt", "tadpole", "toad",
            "wasp", "hornet", "mosquito", "fly", "moth", "cockroach",
            "mouse", "rat", "hamster", "guinea pig", "gerbil",
            "aardwolf", "aye-aye", "capybara", "dingo", "fennec",
            "ibex", "markhor", "meerkat", "mongoose", "numbat",
            "okapi", "opossum", "pangolin", "quokka", "saiga",
            "sifaka", "tarsier", "vicua", "gerenuk", "fossa",
            "shoebill", "kakapo", "kea", "lorikeet", "myna",
            "vulture", "condor", "albatross", "puffin", "tern",
            "salmon", "trout", "bass", "tuna", "sardine",
            "clownfish", "angelfish", "seahorse", "starfish",
            "jellyfish", "coral", "anemone", "urchin",
            "snail", "slug", "earthworm", "leech",
            "scorpion", "centipede", "millipede", "tick"
        ]
    },
    
    "food_and_drink": {
        "en": "Food & Drink",
        "zh": "食物与饮料",
        "keywords": [
            "burger", "pizza", "sandwich", "bread", "cake", "cookie", "donut",
            "apple", "banana", "orange", "grape", "strawberry", "watermelon",
            "coffee", "tea", "juice", "milk", "water", "soda", "beer", "wine",
            "rice", "pasta", "noodle", "soup", "salad", "steak", "chicken",
            "cheese", "butter", "egg", "bacon", "sausage", "ham",
            "chocolate", "candy", "ice cream", "yogurt", "cereal",
            "tomato", "potato", "carrot", "broccoli", "lettuce", "cucumber",
            "sushi", "taco", "burrito", "hot dog", "pretzel",
            "muffin", "croissant", "bagel", "waffle", "pancake",
            "lemon", "lime", "grapefruit", "mango", "pineapple",
            "avocado", "olive", "pickle", "pepper", "onion",
            "flour", "sugar", "salt", "spice", "sauce",
            "martini", "cocktail", "whisky", "vodka", "espresso",
            "breakfast", "lunch", "dinner", "snack", "dessert",
            "meat", "beef", "pork", "lamb", "fish", "seafood",
            "vegetable", "fruit", "grain", "nut", "seed",
            "tiramisu", "brownie", "cupcake", "cheesecake",
            "ramen", "paella", "lasagna", "falafel", "hummus",
            "crepe", "fondue", "quiche", "omelette", "shakshuka",
            "tagine", "gumbo", "chili", "stew", "curry"
        ]
    },
    
    "transportation": {
        "en": "Transportation",
        "zh": "交通工具",
        "keywords": [
            "car", "bus", "truck", "van", "taxi", "limousine",
            "bicycle", "motorcycle", "scooter", "skateboard", "segway",
            "train", "subway", "tram", "monorail", "trolley",
            "airplane", "helicopter", "jet", "rocket", "spacecraft",
            "boat", "ship", "ferry", "yacht", "submarine", "canoe",
            "ambulance", "fire truck", "police car", "bulldozer",
            "tractor", "forklift", "crane", "excavator",
            "wheelchair", "stroller", "cart", "wagon",
            "hot air balloon", "blimp", "zeppelin", "glider",
            "rickshaw", "tuk-tuk", "pedicab", "gondola",
            "hovercraft", "hoverboard", "unicycle", "tricycle",
            "tank", "fighter", "bomber", "drone",
            "carrier", "battleship", "destroyer", "cruiser",
            "rocket", "shuttle", "capsule", "rover",
            "buggy", "jeep", "suv", "coupe", "sedan",
            "tesla", "ferrari", "lamborghini", "porsche", "mercedes",
            "bmx", "mountainbike", "e-bike", "unicycle",
            "kayak", "sailboat", "surfboard", "jetski"
        ]
    },
    
    "technology": {
        "en": "Technology & Electronics",
        "zh": "科技与电子产品",
        "keywords": [
            "phone", "smartphone", "iphone", "tablet", "ipad",
            "computer", "laptop", "keyboard", "mouse", "monitor",
            "camera", "printer", "scanner", "projector",
            "television", "tv", "radio", "stereo", "speaker",
            "microphone", "headphone", "earphone", "earbud",
            "watch", "smartwatch", "fitness tracker",
            "router", "modem", "server", "hard drive", "ssd",
            "usb", "cable", "charger", "battery", "adapter",
            "drone", "robot", "3d printer", "laser",
            "calculator", "clock", "timer", "thermostat",
            "console", "gameboy", "joystick", "controller",
            "bluetooth", "wifi", "internet", "network",
            "cpu", "motherboard", "chip", "transistor",
            "sensor", "scanner", "detector", "meter",
            "macbook", "airpods", "pixel", "vision pro",
            "kindle", "e-reader", "e-ink", "digital"
        ]
    },
    
    "buildings_and_places": {
        "en": "Buildings & Places",
        "zh": "建筑与场所",
        "keywords": [
            "house", "home", "building", "apartment", "mansion",
            "school", "university", "college", "library", "museum",
            "hospital", "clinic", "pharmacy", "bank", "store",
            "restaurant", "cafe", "bar", "pub", "club",
            "hotel", "motel", "inn", "hostel", "resort",
            "church", "temple", "mosque", "synagogue", "cathedral",
            "castle", "palace", "fortress", "tower", "bridge",
            "stadium", "arena", "theater", "cinema", "opera",
            "park", "garden", "zoo", "aquarium", "playground",
            "factory", "warehouse", "office", "workshop", "lab",
            "airport", "station", "terminal", "depot", "harbor",
            "farm", "barn", "mill", "silo", "greenhouse",
            "pyramid", "colosseum", "parthenon", "taj mahal",
            "eiffel tower", "statue of liberty", "big ben",
            "wall of china", "machu picchu", "petra",
            "dome", "arch", "column", "spire", "minaret",
            "cottage", "cabin", "hut", "tent", "igloo",
            "skyscraper", "penthouse", "villa", "manor",
            "gymnasium", "dojo", "court", "field", "rink"
        ]
    },
    
    "clothing_and_accessories": {
        "en": "Clothing & Accessories",
        "zh": "服装与配饰",
        "keywords": [
            "shirt", "t-shirt", "blouse", "sweater", "jacket",
            "coat", "dress", "skirt", "pants", "jeans",
            "shorts", "underwear", "socks", "shoes", "boots",
            "hat", "cap", "beanie", "helmet", "crown",
            "glove", "scarf", "tie", "belt", "bag",
            "backpack", "purse", "wallet", "suitcase",
            "glasses", "sunglasses", "watch", "ring", "necklace",
            "bracelet", "earring", "jewelry", "accessory",
            "sneakers", "sandals", "slippers", "heels",
            "uniform", "suit", "tuxedo", "vest", "apron",
            "kimono", "toga", "robe", "gown", "cloak",
            "hoodie", "cardigan", "poncho", "parka",
            "leggings", "tights", "stockings", "pantyhose",
            "bikini", "swimsuit", "bathing suit",
            "fedora", "beret", "sombrero", "turban"
        ]
    },
    
    "sports_and_fitness": {
        "en": "Sports & Fitness",
        "zh": "运动与健身",
        "keywords": [
            "ball", "football", "soccer", "basketball", "baseball",
            "tennis", "golf", "hockey", "volleyball", "rugby",
            "bat", "racket", "club", "stick", "paddle",
            "goal", "net", "hoop", "basket", "court",
            "gym", "fitness", "workout", "exercise", "yoga",
            "dumbbell", "barbell", "weight", "kettlebell",
            "treadmill", "bike", "bicycle", "cycling",
            "swimming", "diving", "surfing", "skiing",
            "boxing", "glove", "punching bag", "ring",
            "martial arts", "karate", "judo", "taekwondo",
            "running", "jogging", "marathon", "track",
            "skateboard", "roller skate", "inline skate",
            "helmet", "pad", "guard", "uniform", "jersey",
            "trophy", "medal", "award", "championship",
            "bowling", "billiard", "pool", "dart",
            "badminton", "shuttlecock", "table tennis",
            "frisbee", "boomerang", "kite", "yo-yo"
        ]
    },
    
    "tools_and_equipment": {
        "en": "Tools & Equipment",
        "zh": "工具与设备",
        "keywords": [
            "hammer", "screwdriver", "wrench", "pliers", "saw",
            "drill", "chisel", "file", "rasp", "plane",
            "axe", "knife", "scissors", "cutter", "blade",
            "ladder", "toolbox", "workbench", "vise",
            "nail", "screw", "bolt", "nut", "washer",
            "tape measure", "ruler", "level", "compass",
            "shovel", "rake", "hoe", "spade", "trowel",
            "wheelbarrow", "cart", "bucket", "bin",
            "flashlight", "lantern", "torch", "lamp",
            "rope", "chain", "cable", "wire", "cord",
            "lock", "key", "padlock", "hinge", "latch",
            "gear", "pulley", "lever", "wheel", "crank",
            "pump", "compressor", "generator", "motor",
            "welding", "soldering", "grinding", "cutting",
            "measuring", "marking", "clamping", "holding"
        ]
    },
    
    "household_items": {
        "en": "Household Items",
        "zh": "家居用品",
        "keywords": [
            "chair", "table", "sofa", "couch", "bed",
            "desk", "shelf", "cabinet", "drawer", "closet",
            "lamp", "light", "bulb", "candle", "mirror",
            "clock", "calendar", "picture", "frame", "painting",
            "curtain", "blind", "rug", "carpet", "mat",
            "pillow", "cushion", "blanket", "sheet", "towel",
            "plate", "bowl", "cup", "mug", "glass",
            "fork", "spoon", "knife", "chopsticks", "spatula",
            "pot", "pan", "kettle", "toaster", "microwave",
            "refrigerator", "freezer", "oven", "stove", "dishwasher",
            "washing machine", "dryer", "iron", "vacuum",
            "broom", "mop", "bucket", "sponge", "soap",
            "brush", "comb", "razor", "toothbrush", "toothpaste",
            "shampoo", "conditioner", "lotion", "perfume",
            "basket", "box", "container", "jar", "bottle",
            "vase", "pot", "planter", "plant", "flower"
        ]
    },
    
    "office_and_school": {
        "en": "Office & School Supplies",
        "zh": "办公与学习用品",
        "keywords": [
            "pen", "pencil", "marker", "crayon", "highlighter",
            "eraser", "sharpener", "ruler", "compass", "protractor",
            "paper", "notebook", "journal", "diary", "pad",
            "book", "textbook", "dictionary", "encyclopedia",
            "folder", "binder", "file", "envelope", "stamp",
            "stapler", "clip", "pin", "tape", "glue",
            "scissors", "cutter", "punch", "calculator",
            "desk", "chair", "lamp", "organizer", "tray",
            "calendar", "planner", "schedule", "agenda",
            "whiteboard", "chalkboard", "blackboard", "marker",
            "briefcase", "bag", "backpack", "portfolio",
            "laptop", "computer", "keyboard", "mouse",
            "printer", "scanner", "copier", "fax",
            "phone", "telephone", "headset", "intercom"
        ]
    },
    
    "nature": {
        "en": "Nature & Environment",
        "zh": "自然与环境",
        "keywords": [
            "tree", "plant", "flower", "leaf", "grass",
            "forest", "jungle", "wood", "grove", "orchard",
            "mountain", "hill", "valley", "canyon", "cliff",
            "river", "stream", "lake", "pond", "waterfall",
            "ocean", "sea", "beach", "coast", "shore",
            "island", "peninsula", "bay", "gulf", "strait",
            "desert", "dune", "oasis", "savanna", "prairie",
            "volcano", "lava", "magma", "crater", "geyser",
            "glacier", "iceberg", "snow", "ice", "frost",
            "rock", "stone", "boulder", "pebble", "sand",
            "soil", "dirt", "mud", "clay", "moss",
            "sun", "moon", "star", "planet", "comet",
            "cloud", "rain", "storm", "lightning", "thunder",
            "wind", "tornado", "hurricane", "cyclone",
            "rainbow", "aurora", "eclipse", "meteor"
        ]
    },
    
    "music_and_instruments": {
        "en": "Music & Instruments",
        "zh": "音乐与乐器",
        "keywords": [
            "guitar", "piano", "violin", "cello", "bass",
            "drum", "cymbal", "tambourine", "xylophone",
            "trumpet", "trombone", "saxophone", "clarinet",
            "flute", "oboe", "bassoon", "recorder",
            "accordion", "harmonica", "bagpipe", "organ",
            "harp", "lyre", "ukulele", "banjo", "mandolin",
            "microphone", "speaker", "amplifier", "mixer",
            "headphone", "earbud", "turntable", "record",
            "cd", "vinyl", "cassette", "tape", "disc",
            "note", "chord", "scale", "melody", "rhythm",
            "concert", "performance", "recital", "festival",
            "band", "orchestra", "choir", "ensemble",
            "metronome", "tuner", "tuning fork", "pick"
        ]
    },
    
    "professions": {
        "en": "Professions & Occupations",
        "zh": "职业",
        "keywords": [
            "doctor", "nurse", "dentist", "surgeon", "pharmacist",
            "teacher", "professor", "instructor", "tutor",
            "engineer", "architect", "designer", "artist",
            "lawyer", "judge", "attorney", "paralegal",
            "police", "officer", "detective", "firefighter",
            "chef", "cook", "baker", "barista", "waiter",
            "pilot", "captain", "driver", "mechanic",
            "farmer", "gardener", "florist", "veterinarian",
            "scientist", "researcher", "biologist", "chemist",
            "programmer", "developer", "designer", "analyst",
            "accountant", "banker", "cashier", "clerk",
            "plumber", "electrician", "carpenter", "painter",
            "musician", "singer", "dancer", "actor",
            "writer", "author", "journalist", "reporter",
            "photographer", "videographer", "cinematographer"
        ]
    },
    
    "events_and_celebrations": {
        "en": "Events & Celebrations",
        "zh": "活动与庆典",
        "keywords": [
            "birthday", "party", "celebration", "festival",
            "wedding", "marriage", "engagement", "anniversary",
            "christmas", "halloween", "easter", "thanksgiving",
            "new year", "graduation", "ceremony", "award",
            "concert", "show", "performance", "exhibition",
            "parade", "carnival", "fair", "bazaar",
            "conference", "meeting", "seminar", "workshop",
            "competition", "tournament", "championship",
            "reunion", "gathering", "banquet", "gala",
            "baptism", "christening", "bar mitzvah",
            "diwali", "hanukkah", "ramadan", "eid",
            "lunar", "mid-autumn", "dragon boat",
            "valentines", "mothers day", "fathers day"
        ]
    },
    
    "science_and_education": {
        "en": "Science & Education",
        "zh": "科学与教育",
        "keywords": [
            "laboratory", "lab", "experiment", "test", "research",
            "microscope", "telescope", "magnifying glass",
            "beaker", "flask", "test tube", "petri dish",
            "atom", "molecule", "cell", "dna", "gene",
            "robot", "ai", "artificial intelligence",
            "chemistry", "biology", "physics", "astronomy",
            "mathematics", "geometry", "algebra", "calculus",
            "planet", "solar", "galaxy", "universe", "cosmos",
            "rocket", "satellite", "spacecraft", "astronaut",
            "brain", "heart", "organ", "skeleton", "skull",
            "fossil", "dinosaur", "evolution", "extinct",
            "energy", "electricity", "magnetism", "gravity",
            "quantum", "nuclear", "atomic", "particle"
        ]
    },
    
    "games_and_toys": {
        "en": "Games & Toys",
        "zh": "游戏与玩具",
        "keywords": [
            "toy", "doll", "teddy", "bear", "puppet",
            "puzzle", "jigsaw", "cube", "rubiks",
            "chess", "checkers", "backgammon", "monopoly",
            "card", "dice", "domino", "bingo",
            "video game", "console", "controller", "joystick",
            "board game", "game", "play", "playground",
            "swing", "slide", "seesaw", "sandbox",
            "kite", "balloon", "bubble", "ball",
            "lego", "blocks", "building", "construction",
            "action figure", "robot", "car", "train",
            "hula hoop", "jump rope", "yo-yo", "frisbee",
            "spinning top", "marbles", "jacks"
        ]
    },
    
    "art_and_craft": {
        "en": "Art & Craft",
        "zh": "艺术与手工",
        "keywords": [
            "paint", "brush", "canvas", "easel", "palette",
            "pencil", "crayon", "marker", "chalk", "charcoal",
            "drawing", "sketch", "illustration", "design",
            "sculpture", "statue", "carving", "pottery",
            "clay", "ceramic", "porcelain", "glaze",
            "origami", "paper", "fold", "craft",
            "knitting", "sewing", "embroidery", "weaving",
            "needle", "thread", "yarn", "fabric", "textile",
            "photography", "camera", "lens", "film",
            "calligraphy", "ink", "pen", "writing",
            "scrapbook", "album", "collage", "mosaic",
            "woodwork", "carve", "chisel", "lathe"
        ]
    },
    
    "fantasy_and_mythology": {
        "en": "Fantasy & Mythology",
        "zh": "幻想与神话",
        "keywords": [
            "dragon", "unicorn", "fairy", "elf", "dwarf",
            "wizard", "witch", "magic", "wand", "spell",
            "castle", "tower", "dungeon", "fortress",
            "sword", "shield", "armor", "helmet", "knight",
            "crown", "throne", "scepter", "orb", "jewel",
            "potion", "elixir", "amulet", "talisman",
            "ghost", "vampire", "zombie", "monster",
            "alien", "ufo", "spaceship", "portal",
            "crystal", "gem", "treasure", "gold",
            "godzilla", "mothra", "king ghidorah",
            "phoenix", "griffin", "pegasus", "hydra"
        ]
    },
    
    "weather_and_climate": {
        "en": "Weather & Climate",
        "zh": "天气与气候",
        "keywords": [
            "sun", "sunny", "sunshine", "solar",
            "rain", "rainy", "rainfall", "shower",
            "snow", "snowy", "snowflake", "blizzard",
            "cloud", "cloudy", "overcast", "fog",
            "wind", "windy", "breeze", "gust", "storm",
            "thunder", "lightning", "bolt", "flash",
            "tornado", "hurricane", "cyclone", "typhoon",
            "rainbow", "frost", "ice", "hail",
            "temperature", "thermometer", "hot", "cold",
            "climate", "season", "weather", "forecast"
        ]
    }
}

def get_category(filename):
    """根据文件名判断所属类别"""
    filename_lower = filename.lower().replace("-", " ").replace("_", " ")
    
    # 移除文件扩展名
    filename_lower = filename_lower.replace(".png", "")
    
    # 为每个类别计算匹配得分
    category_scores = {}
    
    for category, info in CATEGORIES.items():
        score = 0
        for keyword in info["keywords"]:
            # 完整词匹配
            if keyword in filename_lower:
                # 优先匹配较长的关键词
                score += len(keyword)
        
        if score > 0:
            category_scores[category] = score
    
    # 返回得分最高的类别
    if category_scores:
        best_category = max(category_scores.items(), key=lambda x: x[1])
        return best_category[0]
    
    # 如果没有匹配，返回其他类别
    return "others"

def main():
    # 读取所有文件
    image_dir = "/Volumes/dz/code/cartoon-english-flash-card/resource/all"
    output_dir = "/Volumes/dz/code/cartoon-english-flash-card/resource/categorized"
    files = [f for f in os.listdir(image_dir) if f.endswith('.png')]
    
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 创建输出目录: {output_dir}")
    
    # 初始化分类结果
    categorized = {}
    for category in CATEGORIES.keys():
        categorized[category] = []
    categorized["others"] = []
    
    # 分类文件
    print(f"\n🔍 开始分类 {len(files)} 张图片...")
    for filename in files:
        category = get_category(filename)
        categorized[category].append(filename)
    
    # 创建分类文件夹并复制图片
    print(f"\n📂 创建分类文件夹并复制图片...")
    copy_count = 0
    
    for category_id in list(CATEGORIES.keys()) + ["others"]:
        if categorized[category_id]:
            # 创建分类文件夹
            category_folder = os.path.join(output_dir, category_id)
            if not os.path.exists(category_folder):
                os.makedirs(category_folder)
                print(f"  ✓ 创建文件夹: {category_id}/")
            
            # 复制图片到分类文件夹
            for filename in categorized[category_id]:
                src_path = os.path.join(image_dir, filename)
                dst_path = os.path.join(category_folder, filename)
                
                # 复制文件
                shutil.copy2(src_path, dst_path)
                copy_count += 1
            
            print(f"    → 复制了 {len(categorized[category_id])} 张图片")
    
    print(f"\n✅ 共复制 {copy_count} 张图片到分类文件夹")
    
    # 构建输出结构
    output = {
        "version": "1.0",
        "description": {
            "en": "Cartoon English Flash Card Categories",
            "zh": "卡通英语闪卡分类"
        },
        "categories": []
    }
    
    # 添加各个类别
    for category_id, info in CATEGORIES.items():
        if categorized[category_id]:
            category_data = {
                "id": category_id,
                "name": {
                    "en": info["en"],
                    "zh": info["zh"]
                },
                "count": len(categorized[category_id]),
                "images": sorted(categorized[category_id])
            }
            output["categories"].append(category_data)
    
    # 添加其他类别
    if categorized["others"]:
        output["categories"].append({
            "id": "others",
            "name": {
                "en": "Others",
                "zh": "其他"
            },
            "count": len(categorized["others"]),
            "images": sorted(categorized["others"])
        })
    
    # 添加统计信息
    output["statistics"] = {
        "total_images": len(files),
        "total_categories": len(output["categories"]),
        "categorized_images": len(files) - len(categorized["others"]),
        "uncategorized_images": len(categorized["others"])
    }
    
    # 保存到JSON文件
    output_file = "/Volumes/dz/code/cartoon-english-flash-card/categories.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n" + "="*60)
    print(f"🎉 分类完成!")
    print(f"="*60)
    print(f"📊 总计: {output['statistics']['total_images']} 张图片")
    print(f"📁 分类: {output['statistics']['total_categories']} 个类别")
    print(f"✅ 已分类: {output['statistics']['categorized_images']} 张")
    print(f"❓ 未分类: {output['statistics']['uncategorized_images']} 张")
    print(f"\n各类别统计:")
    for cat in output["categories"]:
        print(f"  - {cat['name']['zh']} ({cat['name']['en']}): {cat['count']} 张")
    print(f"\n💾 JSON文件: {output_file}")
    print(f"📂 分类目录: {output_dir}")
    print(f"="*60)

if __name__ == "__main__":
    main()

