from PIL import Image, ImageDraw, ImageFont

test_players = {
    "ST":"ぐり",
    "LF":"たかおみ",
    "RF":"りんりん",
    "LCM":"だひょん",
    "CM":"たいが",
    "RCM":"しーあーる",
    "LB":"べや",
    "LCB":"あゆれ",
    "RCB":"くわがた",
    "RB":"にし",
    "GK":"ソノ",
}

positions_4321 = {
    "ST" : (312, 244),
"LF" : (173, 264),
"RF" : (461, 264),
"LCM" : (197, 359),
"CM" : (312, 389),
"RCM" : (427, 359),
"LB" : (79, 451),
"LCB" : (220, 476),
"RCB" : (404, 476),
"RB" : (545, 451),
"GK" : (312, 570),}

# 画像の読み込み
def make_thumbnail_es(
        players = {},
        emblem_path = "db/emblem/Le Fort FC.png",
        image_path = "db/es_template.png",  # 画像のパスを指定してください
        output_image_path = "db/output_image_es.jpg"  # 出力画像のパスを指定してください
):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
   
    #メンバー書き込み
    player_font_size = 30
    player_font = ImageFont.truetype("Fonts/YuGothB.ttc",player_font_size)
    positions = players.keys()

    for pos in positions:
        specified_position = positions_4321[pos]
        text = players[pos]
        text_width, text_height = draw.textsize(text, font=player_font)
        text_position = (specified_position[0] - text_width / 2, specified_position[1] - text_height / 2)
        draw.text(text_position, text, font=player_font, fill=(255, 255, 255, 255)) 

    image.convert("RGBA")
    emblem=Image.open(emblem_path).convert("RGBA")
    image.paste(emblem,(778,129),emblem)
    # 画像を保存
    image.save(output_image_path)

make_thumbnail_es(players=test_players)