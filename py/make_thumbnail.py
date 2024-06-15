from PIL import Image, ImageDraw, ImageFont

test_players = {
    "ST":"りんりん",
    "LF":"たかおみ",
    "RF":"ぐり",
    "LCM":"だひょん",
    "CM":"たいが",
    "RCM":"しーあーる",
    "LB":"べや",
    "LCB":"あゆれ",
    "RCB":"くわがた",
    "RB":"にし",
    "GK":"ソノ",
}
test_opponents = [
    {"clubname":"ESTELA","goals":3,"opponentsgoals":0},
    {"clubname":"Bana11","goals":0,"opponentsgoals":2},
    {"clubname":"Bana11","goals":1,"opponentsgoals":2},
    {"clubname":"Bana11","goals":3,"opponentsgoals":2},
    {"clubname":"Bana11","goals":1,"opponentsgoals":3},
]
positions_4321 = {
    "ST":(957, 185),
    "LF":(818, 205),
    "RF":(1106, 205),
    "LCM":(842, 300),
    "CM":(957, 330),
    "RCM":(1072, 300),
    "LB":(724, 392),
    "LCB":(865, 417),
    "RCB":(1049, 417),
    "RB":(1190, 392),
    "GK":(957, 511)}

# 画像の読み込み
def make_thumbnail(
        title,
        players = {},
        opponents = [],
        image_path = "db/thumbnail_template.png",  # 画像のパスを指定してください
        output_image_path = "db/output_image.jpg"  # 出力画像のパスを指定してください
):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)

    # 日時のフォーマットを指定
    date_font_size = 62
    date_font = ImageFont.truetype("arial.ttf", date_font_size)
    date_position = (80, 70) 
    draw.text(date_position, title, font=date_font, fill=(255, 255, 255, 255))

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

    # 対戦チーム書き込み
    start_position = (68, 203)
    team_font_size = 45
    team_font= ImageFont.truetype("arial.ttf",team_font_size)

    for i in range(len(opponents)):
        num = i+1
        team_name = opponents[i]["clubname"]
        goals = opponents[i]["goals"]
        opponent_goals = opponents[i]["opponentsgoals"]
        text = """{}:{} {}-{}""".format(num,team_name,goals,opponent_goals)
        draw.text((start_position[0],start_position[1]+(team_font_size+20)*i), text, font=team_font, fill=(255, 255, 255, 255)) 

    # 画像を保存
    image.save(output_image_path)

make_thumbnail(title="2024/06/12 (Tue)",players=test_players,opponents=test_opponents)