#import requests
import json
import pandas as pd
import numpy as np
import io

# CSVファイルのパス
file_path = 'db/matchdata.csv'
df = pd.read_csv(file_path)

json_path = 'db/match.json'
with open(json_path, 'r',encoding='utf-8') as f:
    matches = json.load(f)

myclubid = "136886"
csv_data_array = []
template = """{},{},{},{}"""

for data in matches:
    playerData = data["players"]["136886"]
    realtimegameList = []
    for playerId in playerData.keys():
        if playerId != "1004015757382":
            realtimegame = int(playerData[playerId]["realtimegame"])
            if 0 < realtimegame & realtimegame <2500:
                realtimegameList.append(realtimegame)
    gametime = 0
    
    if len(realtimegameList) >0:            
        gametime = np.median(realtimegameList)

    if gametime > 120:
        timestampMatchEnd = data["timestamp"]
        timestampMatchStart = timestampMatchEnd - gametime

        clubname = ""
        goals = 0
        goals_opponent = 0

        clubIds = data["clubs"].keys()
        for id in clubIds:
            if id != myclubid:
                clubname = data["clubs"][id]["details"]["name"]
                goals_opponent=data["clubs"][id]["goals"]
            if id == myclubid:
                goals = data["clubs"][id]["goals"]
        csv_data_array.append(template.format(clubname,goals,goals_opponent,timestampMatchStart))

csv_data_array = csv_data_array[::-1]

csv_data = "\n".join(csv_data_array)
new_df = pd.read_csv(io.StringIO(csv_data),header=None,names=["clubname","goals","opponentgoals","timestamp"])
df = pd.concat([df,new_df],ignore_index=True)

#重複データの削除
df.drop_duplicates(inplace=True,ignore_index=True)
# Unixタイム形式のデータをdatetime形式に変換
df['timestamp'] = pd.to_numeric(df['timestamp'])
df = df.sort_values(by="timestamp", ascending=True)

df.to_csv(file_path, index=False)