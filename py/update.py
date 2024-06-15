import json
import datetime
import pandas as pd
import isodate
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from make_thumbnail import make_thumbnail

# UTC現在時刻の取得
current_datetime = datetime.datetime.now(datetime.timezone.utc)

# Credentials オブジェクトを作成
## 保存したトークンのファイルパス
token_file_path = 'db/token.json'
## 保存したトークンを読み込む
with open(token_file_path, 'r') as token_file:
    token = json.load(token_file)
credentials = Credentials.from_authorized_user_info(token)
youtube = build('youtube', 'v3', credentials=credentials)

# 投稿動画の取得
request = youtube.channels().list(part="contentDetails",mine=True)
response = request.execute()
uploads_playlist_id = response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

# 投稿動画リスト
videos = []
request = youtube.playlistItems().list(
        part="snippet",
        playlistId=uploads_playlist_id,
        maxResults=10
)
while request:
    response = request.execute()
    videos.extend(response["items"])
    request = youtube.playlistItems().list_next(request, response)

video_dict ={
    "sono":[],
    "nishi":[],
    "ayure":[]
}

for v in videos:
    #動画時刻
    video_datetime = datetime.datetime.fromisoformat(v["snippet"]["publishedAt"].replace("Z", "+00:00"))
    #動画時刻と現在時刻の差
    time_diff = abs(current_datetime - video_datetime)

    # 今日の動画
    # 13時~16時以内(日本時間22時~25時以内)で現在時刻と23時間未満差ならば今日の動画
    if 13<= video_datetime.hour <= 16 and time_diff < datetime.timedelta(hours=20):
        video_id = v["snippet"]["resourceId"]["videoId"]

        video_response = youtube.videos().list(
            part='snippet',  # 取得する部分（snippetは基本的な動画情報）
            id=video_id
        ).execute()

        #情報
        video_info = video_response['items'][0]['snippet']
        title = video_info['title'] #元のタイトル
        video_datetime = datetime.datetime.fromisoformat(video_info['publishedAt'].replace("Z","+00:00")) #投稿時間

        #ソノ
        if ("手数料活動" in title or "ソノ" in title) and ("e" not in title):
            streamer = "sono"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break

        #にし
        elif ("にし" in title) and ("e" not in title):
            streamer = "nishi"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break
        
        #あゆれ
        elif ("FC24" in title or "あゆれ" in title) and ("e" not in title):
            streamer = "ayure"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break

with open("db/4321.json", 'r',encoding="utf-8") as f:
        players = json.load(f)

for streamer in video_dict.keys():
    if len(video_dict[streamer])>0:
        print(streamer)
    for i in range(len(video_dict[streamer])):
        index = i+1
        d = video_dict[streamer][i]

        video_id = d["videoId"]
        title = d["title"]
        video_datetime = d["datetime"]
        video_timestamp = video_datetime.timestamp() #UNIXタイムスタンプ
        thumbnail_title = video_datetime.strftime("%Y/%m/%d (%a)")
        new_title = "{} {}視点".format(video_datetime.strftime("%Y/%m/%d"),streamer)

        # 動画の長さを取得 
        # ISO 8601期間形式の解析
        request = youtube.videos().list(
            part='contentDetails',
            id=video_id
        )
        response = request.execute()
        duration = response['items'][0]['contentDetails']['duration']
        duration_seconds = isodate.parse_duration(duration).total_seconds()

        video_length = video_timestamp + duration_seconds
        
        if(index>1): 
            new_title += " Part {}".format(index)
        
        print("{}:https://www.youtube.com/watch?v={}".format(index,video_id))

        #サムネイルの結果と概要欄
        matchdata = pd.read_csv("db/matchdata.csv")
        matchdata = matchdata[(matchdata["timestamp"]>video_timestamp) & (matchdata["timestamp"]<=video_length)]
        result_thumbnail = []
        description = ""
        for i in range(len(matchdata)):
            clubname = matchdata.iloc[i,0]
            goals = matchdata.iloc[i,1]
            opgoals = matchdata.iloc[i,2]
            
            result_thumbnail.append({"clubname":clubname,"goals":goals,"opponentsgoals":opgoals})
            if i ==0:
                description += "00:00 " + clubname + "\n"
            if i>0:
                timestamp = matchdata.iloc[i-1,3]
                difference = timestamp - video_timestamp + 60
                # 差を時分秒に変換
                delta = datetime.timedelta(seconds=difference)
                hours, remainder = divmod(delta.seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                description += "{:02}:{:02}:{:02} {} {}-{}\n".format(hours, minutes, seconds,clubname,goals,opgoals)
        
        thumbnail_path = "db/thumbnails/output_image.jpg"
        make_thumbnail(title = thumbnail_title,
                    players=players,
                    opponents=result_thumbnail,
                    image_path="db/thumbnails/thumbnail_template.png",
                    output_image_path=thumbnail_path)
        
        # サムネイル画像をアップロード
        request = youtube.thumbnails().set(
            videoId=video_id,
            media_body=MediaFileUpload(thumbnail_path)
        )
        response = request.execute()

        # 更新
        request = youtube.videos().update(
        part="snippet",
        body={
            "id": video_id,
            "snippet": {
                "title": new_title,
                "description": description,
                "categoryId":"20"
            }
        })
        response = request.execute()