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
from google.cloud.firestore_v1.base_query import FieldFilter
from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate('../firebase-creds.json')
app = initialize_app(cred)
db = firestore.client()

global ComServer
ComServer = Common.ComServer

def listenStockByItemCodeQuery():
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Received query snapshot: StockByItemCodeQuery")
        print("DEBUG changes: ", changes)
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenStockByItemCodeQuery: {change.document.id}")
                itemCode = change.document.get("itemCode")
                print(itemCode)
                Common.CheckLogin()
                result = stockQtyBalance.getStocksBalanceByItemCodeAndLocationAndBatch(itemCode)
                print(result)
                db.collection("stockItemsByItemCodeBatchLocation").document(itemCode).set(result)
            elif change.type.name == "MODIFIED":
                print(f"Added stockqty: {change.document.id}")

        # print(read_time)
        callback_done.set()

    col_query = db.collection("stockByItemCodeQuery").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenAllStocksQuery():
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Received query snapshot: AllStocksQuery")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenAllStocksQuery: {change.document.id}")
                Common.CheckLogin()
                result = stockQtyBalance.getAllStocksBalanceByItemCodeAndLocationAndBatch()
                print(result)
                db.collection("allStocks").document("itemcodes").set(result)
            elif change.type.name == "MODIFIED":
                print(f"Added stockqty: {change.document.id}")

        # print(read_time)
        callback_done.set()

    col_query = db.collection("allStocksQuery").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenSalesInvoicePost():
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Received query snapshot: SalesInvoicePost")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenSalesInvoicePost: {change.document.id}")
                data = change.document._data
                print(data)
                Common.CheckLogin()
                result = salesInvoice.createSalesInvoice(data)
                print(result)
                db.collection("salesInvoice").document(change.document.id).update({"createdAt": datetime.now(), "status": "success"})

        # print(read_time)
        callback_done.set()

    col_query = db.collection("salesInvoice").where(filter=FieldFilter("requestAt", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenDeliveryOrderPost():
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Received query snapshot: DeliveryOrderPost")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenDeliveryOrderPost: {change.document.id}")
                data = change.document._data
                print(data)
                Common.CheckLogin()
                result = deliveryOrder.createDeliverOrder(data)
                print(result)
                db.collection("deliveryOrder").document(change.document.id).update({"createdAt": datetime.now(), "status": "success"})
                deliveryOrderDocNo = data["DocNo"]
                salesInvoiceDocNo = data["DocNo"]
                customerAccount = data["Code"]
                # companyName = data["CompanyName"] #TODO Add companyname in deliveryOrder field
                companyName = "test"
                convertResults = deliveryOrderToSalesInvoice.convertDOtoSI(deliveryOrderDocNo, salesInvoiceDocNo, customerAccount, companyName)
                db.collection("deliveryOrdertoSalesInvoice").document(change.document.id).update({"createdAt": datetime.now(), "status": "success"})
                print(convertResults)
        # print(read_time)
        callback_done.set()

    col_query = db.collection("deliveryOrder").where(filter=FieldFilter("requestAt", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()


# Called in listenDeliveryOrder. Sales Invoice created after delivery order is created.
# def listenDeliveryOrderToSalesInvoicePost():
#     db = firestore.client()
#     # [START firestore_listen_query_snapshots]

#     # Create an Event for notifying main thread.
#     callback_done = threading.Event()

#     # Create a callback on_snapshot function to capture changes
#     def on_snapshot(col_snapshot, changes, read_time):
#         print("Callback received query snapshot.")
#         for change in changes:
#             if change.type.name == "ADDED":
#                 print(f"New listenDeliveryOrderToSalesInvoicePost: {change.document.id}")
#                 data = change.document._data
#                 deliveryOrderDocNo = data["deliveryOrderDocNo"]
#                 salesInvoiceDocNo = data["salesInvoiceDocNo"]
#                 customerAccount = data["customerAccount"]
#                 companyName = data["companyName"]
#                 print(data)
#                 Common.CheckLogin()
#                 result = deliveryOrderToSalesInvoice.convertDOtoSI(deliveryOrderDocNo, salesInvoiceDocNo, customerAccount, companyName)
#                 print(result)
#                 db.collection("deliveryOrdertoSalesInvoice").document(change.document.id).update({"createdAt": datetime.now()})

#         print(read_time)
#         callback_done.set()

#     col_query = db.collection("deliveryOrdertoSalesInvoice").where(filter=FieldFilter("requestAt", ">=", datetime.now()-timedelta(minutes=1)))

#     # Watch the collection query
#     query_watch = col_query.on_snapshot(on_snapshot)
#     # query_watch.unsubscribe()
# listenDeliveryOrderToSalesInvoicePost()

if __name__ == "__main__":
    listenStockByItemCodeQuery()
    listenAllStocksQuery()
    listenSalesInvoicePost()
    listenDeliveryOrderPost()

    # docs = db.collection("stockByItemCodeQuery").stream()

    # for doc in docs:
    #     print(f"{doc.id} => {doc.to_dict()["timestamp"]}")

    # time = datetime.now(timezone.utc)-timedelta(minutes=1)
    # print(time)
    # docs = db.collection("stockByItemCodeQuery").where(filter=FieldFilter("timestamp", ">=", time)).stream()

    # for doc in docs:
    #     print(f"{doc.id} => {doc.to_dict()}")
    while True:
        pass
