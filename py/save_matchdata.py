#import requests
import json
import pandas as pd
import io

# CSVファイルのパス
file_path = 'db/matchdata.csv'
# CSVファイルを読み込む
df = pd.read_csv(file_path)

"""
url_league = "https://proclubs.ea.com/api/fc/clubs/matches?platform=common-gen5&clubIds=136886&matchType=leagueMatch"
url_playoff = "https://proclubs.ea.com/api/fc/clubs/matches?platform=common-gen5&clubIds=136886&matchType=playoffMatch"

header = {
    'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
}
response_league = requests.get(url_league,headers=header)
response_playoff = requests.get(url_playoff,headers=header)
leaguematch = json.loads(response_league.text)
playoffmatch = json.loads(response_playoff.text)

matches = leaguematch + playoffmatch
"""
# JSONファイルのパス
json_path = 'db/match.json'

# JSONファイルを読み込んでPythonのデータ構造に変換する
with open(json_path, 'r',encoding='utf-8') as f:
    matches = json.load(f)

myclubid = "136886"
csv_data_array = []
template = """{},{},{},{}"""

for data in matches:
    clubname = ""
    goals = 0
    goals_opponent = 0
    timestamp = data["timestamp"]

    clubIds = data["clubs"].keys()
    for id in clubIds:
        if id != myclubid:
            clubname = data["clubs"][id]["details"]["name"]
            goals_opponent=data["clubs"][id]["goals"]
        if id == myclubid:
            goals = data["clubs"][id]["goals"]
    csv_data_array.append(template.format(clubname,goals,goals_opponent,timestamp))
csv_data_array = csv_data_array[::-1]

csv_data = "\n".join(csv_data_array)
new_df = pd.read_csv(io.StringIO(csv_data),header=None,names=["clubname","goals","opponentgoals","timestamp"])
df = pd.concat([df,new_df],ignore_index=True)

#重複データの削除
df.drop_duplicates(inplace=True,ignore_index=True)
# Unixタイム形式のデータをdatetime形式に変換
df['timestamp'] = pd.to_numeric(df['timestamp'])
# 差分の計算と削除する行の特定
to_drop = []
for i in range(1,len(df)):
    current_time = df.loc[i, 'timestamp']
    prev_time = df.loc[i-1, 'timestamp']
    if abs(current_time - prev_time) <= 360:
        to_drop.append(i-1)

# 重複行の削除
df = df.drop(to_drop)
df.to_csv(file_path, index=False)