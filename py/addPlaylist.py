import json
import datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

#プレイリスト
playlistId_all = 'PLnJ5NkymnT04jtlp8W5LnTjeElu7pHbWk'
playlistId_noguest = 'PLnJ5NkymnT06vs1WoljJBNRMhHQvuPAJQ'
playlistId_nishi = 'PLnJ5NkymnT07AScub7F8KMmGTmIpwSHYv'
playlistId_sono = 'PLnJ5NkymnT07k4HjHqqDmtGH9N0NENgln'
playlistId_ayure = 'PLnJ5NkymnT05x9I6gz3a0pTQi19tICKdd'

playlist_dict = {
    "ソノ":playlistId_sono,
    "にし":playlistId_nishi,
    "あゆれ":playlistId_ayure
}

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
    "ソノ":[],
    "にし":[],
    "あゆれ":[]
}

for v in videos:
    #動画時刻
    video_datetime = datetime.datetime.fromisoformat(v["snippet"]["publishedAt"].replace("Z", "+00:00"))
    #動画時刻と現在時刻の差
    time_diff = abs(current_datetime - video_datetime)

    # 今日の動画
    # 13時~16時以内(日本時間22時~25時以内)で現在時刻と23時間未満差ならば今日の動画
    if 13<= video_datetime.hour <= 16 and (video_datetime.year==current_datetime.year) and (video_datetime.month==current_datetime.month) and (video_datetime.day==current_datetime.day):
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
            streamer = "ソノ"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break

        #にし
        elif ("にし" in title) and ("e" not in title):
            streamer = "にし"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break
        
        #あゆれ
        elif ("FC24" in title or "あゆれ" in title) and ("e" not in title):
            streamer = "あゆれ"
            if len(video_dict[streamer]) == 0:
                video_dict[streamer].append({"videoId":video_id,"title":title,"datetime":video_datetime})
            else:
                for i in range(len(video_dict[streamer])):
                    if video_datetime < video_dict[streamer][i]["datetime"]:
                        video_dict[streamer].insert(i,{"videoId":video_id,"title":title,"datetime":video_datetime})
                        break

for streamer in video_dict.keys():
    if len(video_dict[streamer])>0:
        print(streamer)
    for i in range(len(video_dict[streamer])):
        index = i+1
        d = video_dict[streamer][i]

        video_id = d["videoId"]
        title = d["title"]
        video_datetime = d["datetime"]

        new_title = "{} {}視点".format(video_datetime.strftime("%Y/%m/%d"),streamer)
        if(index>1): 
            new_title += " Part {}".format(index)
        
        print("{}:https://www.youtube.com/watch?v={}".format(index,video_id))
        if title != new_title:
            request = youtube.videos().update(
            part="snippet",
            body={
                "id": video_id,
                "snippet": {
                    "title": new_title,
                    "categoryId":"20"
                }
            })
            response = request.execute()

            #全体再生リスト追加
            request = youtube.playlistItems().insert(
                part="snippet",
                body={
                    "snippet": {
                        "playlistId": playlistId_all,
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": video_id
                        }
                    }
                }
            )
            request.execute()

            #個人再生リスト追加
            request = youtube.playlistItems().insert(
                part="snippet",
                body={
                    "snippet": {
                        "playlistId": playlist_dict[streamer],
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": video_id
                        }
                    }
                }
            )
            response = request.execute()
