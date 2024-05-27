import json
import datetime
import pandas as pd
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from make_thumbnail import make_thumbnail

#プレイリスト
playlistId_all = 'PLnJ5NkymnT04jtlp8W5LnTjeElu7pHbWk'
playlistId_noguest = 'PLnJ5NkymnT06vs1WoljJBNRMhHQvuPAJQ'
playlistId_nishi = 'PLnJ5NkymnT07AScub7F8KMmGTmIpwSHYv'
playlistId_sono = 'PLnJ5NkymnT07k4HjHqqDmtGH9N0NENgln'
playlistId_ayure = 'PLnJ5NkymnT05x9I6gz3a0pTQi19tICKdd'

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

# 今日の動画
today_videos=[]
for v in videos:
    video_datetime = datetime.datetime.fromisoformat(v["snippet"]["publishedAt"].replace("Z", "+00:00"))
    time_diff = abs(current_datetime - video_datetime)
    date_diff = abs((current_datetime.date() - video_datetime.date()).days)
    if time_diff <= datetime.timedelta(23) and date_diff <1:
        today_videos.append(v)


# 動画ごとに処理
for v in today_videos:
    #id設定
    video_id = v["snippet"]["resourceId"]["videoId"]
    print("https://www.youtube.com/watch?v={}".format(video_id))

    #動画情報取得
    video_response = youtube.videos().list(
        part='snippet',  # 取得する部分（snippetは基本的な動画情報）
        id=video_id
    ).execute()

    # 動画の情報を表示
    video_info = video_response['items'][0]['snippet']
    title = video_info['title'] #元のタイトル
    video_datetime = datetime.datetime.fromisoformat(video_info['publishedAt'].replace("Z","+00:00")) #投稿時間
    video_timestamp = video_datetime.timestamp() #UNIXタイムスタンプ
    new_title = video_datetime.strftime("%Y/%m/%d") #新しいタイトル
    thumbnail_title = video_datetime.strftime("%Y/%m/%d (%a)")

    # 配信者ごとに処理
    ## ソノ
    if "手数料活動" in title or "ソノ" in title:
        # 動画情報更新
        new_title += " ソノ視点"
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

    ## にし
    elif "にし" in title:
        # 動画情報更新
        new_title += " にし視点"
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


    ## あゆれ
    elif "FC24" in title or "あゆれ" in title:
        # 動画情報更新
        new_title += " あゆれ視点"
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

