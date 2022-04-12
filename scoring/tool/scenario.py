import logging
import json
import threading
from locust import HttpUser, between, task, constant
import random

f = open('postFile.json', 'r')
fileJson = json.load(f)

def genHeaders(userId):
    return {'content-type': 'application/json',
            'x-app-key': 'user' + str(userId)}

def genDetail():
    return "お世話になっております。\n 負荷試験のため、データを登録させていただきます。\n\nよろしくお願いいたします。"

def getAccessUserId():
    return random.randint(1, 10000)

def getRecordId():
    return random.randint(1, 100000)

newFileId = []
newRecordId = []
newItemInfo = []
newItemForThumbInfo = []

nowUserNum = 0

def getNewFileInfo():
    tlock = threading.Lock()
    with tlock:
        try:
            logging.debug("select newFIleId")
            logging.debug(newFileId)
            if len(newFileId) != 0:
                return newFileId.pop()
        except Exception as e:
            logging.debug("DAERROR: getNewFileInfoでエラーが起きました。")
            logging.debug(e)
    fid = random.randint(1, 1000)
    return {"fileId": "file_" + str(fid), "thumbFileId": "thumb_" + str(fid)}

class WebAppTestTasks(HttpUser):
    wait_time = constant(0.9)
    def __init__(self, parent):
        global nowUserNum
        logging.debug("nowUserNum: " + str(nowUserNum))
        self.myId= -1
        self.targetId = random.randint(0, 12)
        tlock = threading.Lock()
        with tlock:
            try:
                self.myId = nowUserNum
                self.targetId = nowUserNum % 13
                nowUserNum = nowUserNum + 1
            except Exception as e:
                logging.debug("DAERROR: initでエラーが起きました。")
                logging.debug(e)

        logging.debug("targetId: " + str(self.targetId))
        super().__init__(parent)

    @task
    def index(self):
        target = self.targetId
        if target == 0:
            self.getRecords()
        elif target == 1:
            self.getComments()
        elif target == 2:
            self.postComment()
        elif target == 3:
            self.updateRecord()
        elif target == 4:
            self.postRecord()
        elif target == 5:
            self.postFile()
        elif target == 6:
            self.getCategories()
        elif target == 7:
            self.tomeActive()
        elif target == 8:
            self.allActive()
        elif target == 9:
            self.allClosed()
        elif target == 10:
            self.mineActive()
        elif target == 11:
            self.getFileItem()
        elif target == 12:
            self.getFileItemThumb()
        else:
            print('none')


    def getRecords(self):
        new = False
        recordId = getRecordId()
        userId = getAccessUserId()

        tlock = threading.Lock()
        with tlock:
            try:
                logging.debug("select newRecordId")
                logging.debug(newRecordId)
                if len(newRecordId) != 0:
                    recordId = newRecordId.pop()
                    new = True
            except Exception as e:
                logging.debug("DAERROR: getRecordsのnewRecordId選択処理でエラーが起きました。id: ")
                logging.debug(e)
        r = self.client.get(url= "/api/client/records/" + str(recordId),
                        headers= genHeaders(userId), name="/records/[recordId]", timeout=50)
        try:
            dict = r.json()
            logging.debug("parse ItemId")
            logging.debug(dict)
            itemId = dict["files"][0]["itemId"]
            if new:
                newItemInfo.append({"recordId": recordId, "itemId": itemId})
                newItemForThumbInfo.append({"recordId": recordId, "itemId": itemId})
        except Exception as e:
            logging.debug("DAERROR: getRecordsのparseItemId処理でエラーが起きました。id: ")
            logging.debug(e)


    def getComments(self):
        recordId = getRecordId()
        userId = getAccessUserId()
        self.client.get(url= "/api/client/records/" + str(recordId) + "/comments",
                        headers= genHeaders(userId), name="/records/[recordId]/comments", timeout=50)

    def postComment(self):
        userId = getAccessUserId()
        recordId = getRecordId()
        payload={"value":"確認しました。よろしくお願いいたします。"}
        self.client.post(url="/api/client/records/" + str(recordId) + "/comments",
                        headers= genHeaders(userId),
                        json=payload, name="/records/[recordId]/comments", timeout=50)

    def updateRecord(self):
        userId = getAccessUserId()
        recordId = getRecordId()
        status = "closed"
        payload={"status":status}
        self.client.put(url="/api/client/records/" + str(recordId),
                        headers= genHeaders(userId),
                        json=payload, name="/records/[recordId]", timeout=50)

    def postRecord(self):
        userId = getAccessUserId()
        categoryId = random.randint(1, 10)
        file = getNewFileInfo()
        payload={"title":"シナリオによる申請です。","detail": genDetail(), "categoryId": str(categoryId), \
        "fileIdList":[file]}
        r = self.client.post(url="/api/client/records",
                        headers= genHeaders(userId),
                        json=payload, name="/records", timeout=50)
        try:
            dict = r.json()
            logging.debug("postRecordのparse処理開始")
            logging.debug(dict)
            newRecordId.append(dict["recordId"])
        except Exception as e:
            logging.debug("DAERROR: postRecordのparse処理でエラーが起きました。")
            logging.debug(e)


    def postFile(self):
        userId = getAccessUserId()
        payload=fileJson
        r = self.client.post(url="/api/client/files",
                        headers= genHeaders(userId),
                        json=payload, name="/files", timeout=50)
        try:
            dict = r.json()
            logging.debug("postFileのparse処理開始")
            logging.debug(dict)
            newFileId.append(dict)
        except Exception as e:
            logging.debug("DAERROR: postFileのparse処理でエラーが起きました。")
            logging.debug(e)

    def getCategories(self):
        recordId = getRecordId()
        userId = getAccessUserId()
        self.client.get(url= "/api/client/categories/",
                        headers= genHeaders(userId), name="/categories", timeout=50)

    def tomeActive(self):
        userId = getAccessUserId()
        self.client.get(url="/api/client/record-views/tomeActive",
                        headers= genHeaders(userId), name="/record-views/tomeActive", timeout=50)

    def allActive(self):
        userId = getAccessUserId()
        self.client.get(url="/api/client/record-views/allActive",
                        headers= genHeaders(userId), name="/record-views/allActive", timeout=50)

    def allClosed(self):
        userId = getAccessUserId()
        self.client.get(url="/api/client/record-views/allClosed",
                        headers= genHeaders(userId), name="/record-views/allClosed", timeout=50)

    def mineActive(self):
        userId = getAccessUserId()
        self.client.get(url="/api/client/record-views/mineActive",
                        headers= genHeaders(userId), name="/record-views/mineActive", timeout=50)


    def getFileItem(self):
        userId = getAccessUserId()
        recordId = getRecordId()
        itemId = recordId * 2
        tlock = threading.Lock()
        with tlock:
            try:
                logging.debug("select Item")
                logging.debug(newItemInfo)
                if len(newItemInfo) != 0:
                    info = newItemInfo.pop()
                    recordId = info["recordId"]
                    itemId = info["itemId"]
            except Exception as e:
                logging.debug("DAERROR: getFileItemのitem選択処理でエラーが起きました。")
                logging.debug(e)
        self.client.get(url="/api/client/records/" + str(recordId) + "/files/" + str(itemId),
                        headers= genHeaders(userId), name="/records/[recordId]/files/[itemId]", timeout=50)


    def getFileItemThumb(self):
        userId = getAccessUserId()
        recordId = getRecordId()
        itemId = recordId * 2
        tlock = threading.Lock()
        with tlock:
            try:
                logging.debug("select ItemForThumb")
                logging.debug(newItemForThumbInfo)
                if len(newItemForThumbInfo) != 0:
                    info = newItemForThumbInfo.pop()
                    recordId = info["recordId"]
                    itemId = info["itemId"]
            except Exception as e:
                logging.debug("DAERROR: getFileItemThumbのitem選択処理でエラーが起きました。")
                logging.debug(e)
        self.client.get(url="/api/client/records/" + str(recordId) + "/files/" + str(itemId) + "/thumbnail",
                        headers= genHeaders(userId), name="/records/[recordId]/files/[itemId]/thumbnail", timeout=50)
