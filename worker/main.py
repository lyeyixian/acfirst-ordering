# The Firebase Admin SDK to access Cloud Firestore.
import os
from firebase_admin import initialize_app, firestore, credentials
from datetime import datetime, timedelta, timezone
import Common
import deliveryOrder
import deliveryOrderToSalesInvoice
import salesInvoice
import stock
import stockQtyBalance
import threading
from google.cloud.firestore_v1.base_query import FieldFilter, Or
# from dotenv import load_dotenv

# load_dotenv()

cred = credentials.Certificate('../firebase-creds.json')
app = initialize_app(cred)
db = firestore.client()

global ComServer
ComServer = Common.ComServer

def listenEvent():
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Start listening to events")
        for change in changes:
            if change.type.name == "ADDED":
                data = change.document._data
                db.collection("events").document(change.document.id).update({"updatedAt": datetime.now(), "status": "processing"})
                print(data)
                eventType = data["type"]
                Common.CheckLogin()
                try:
                    match eventType:
                        case "refreshStocks":
                            print(f"New refreshstocks: {change.document.id}")
                            result = stockQtyBalance.getAllStocksBalanceByItemCodeAndLocationAndBatch()
                            print(result)
                            for stock in result:
                                itemCode = stock["itemCode"].replace("/", "_")
                                location = stock["location"]
                                batch = stock["batch"]
                                documentId = itemCode + "." + location + "." + batch
                                db.collection("stocks").document(documentId).set(stock)
                            db.collection("events").document(change.document.id).update({"updatedAt": datetime.now(), "status": "success"})
                        case "createInvoice":
                            print(f"New sales invoice: {change.document.id}")
                            salesInvoice.createSalesInvoice(data["payload"])
                            db.collection("events").document(change.document.id).update({"updatedAt": datetime.now(), "status": "success"})
                        case "createDeliveryOrder":
                            print(f"New listenDeliveryOrderPost: {change.document.id}")
                            deliveryOrder.createDeliverOrder(data["payload"])
                            latestDeliveryOrder = deliveryOrder.getLatestDeliveryOrder()
                            deliveryOrderDocNo = latestDeliveryOrder["DOCNO"]
                            customerAccount = latestDeliveryOrder["CODE"]
                            companyName = latestDeliveryOrder["COMPANYNAME"]
                            deliveryOrderToSalesInvoice.convertDOtoSI(deliveryOrderDocNo, customerAccount, companyName)
                            db.collection("events").document(change.document.id).update({"updatedAt": datetime.now(), "status": "success"})
                except Exception as e:
                    db.collection("events").document(change.document.id).update({"updatedAt": datetime.now(), "status": "failed", "reason": str(e)})
                    print(e)

        # print(read_time)
        callback_done.set()

    filter1 = FieldFilter("status", "==", "queued")
    filter2 = FieldFilter("status", "==", "processing")
    orFilter = Or(filters=[filter1, filter2])

    col_query = db.collection("events").where(filter=orFilter)

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

if __name__ == "__main__":
    listenEvent()

    while True:
        pass
