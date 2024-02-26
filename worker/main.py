# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from datetime import datetime, timedelta
from sqlAccounting import Common
from sqlAccounting import deliveryOrder
from sqlAccounting import deliveryOrderToSalesInvoice
from sqlAccounting import salesInvoice
from sqlAccounting import stock
from sqlAccounting import stockQtyBalance
import threading
from time import sleep

from google.cloud.firestore_v1.base_query import FieldFilter
app = initialize_app()

global ComServer
ComServer = Common.ComServer

@https_fn.on_request()
def getStockByItemCode(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    itemCode = req.args.get("itemCode")
    user = req.args.get("user")

    if itemCode is None or user is None:
        return https_fn.Response("No text parameter provided", status=400)

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("stockByItemCodeQuery").add({"itemCode": itemCode, "user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@https_fn.on_request()
def getAllStock(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return https_fn.Response("No text parameter provided", status=400)

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("allStocksQuery").add({"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@https_fn.on_request()
def getSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return https_fn.Response("No user parameter provided", status=400)

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("salesInvoiceQuery").add({"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@https_fn.on_request()
def getDeliveryOrder(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return https_fn.Response("No user parameter provided", status=400)

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("deliveryOrderQuery").add({"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@https_fn.on_request()
def createSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    payload = req.get_json(silent=True)
    if payload is None:
        return https_fn.Response(status=400, response="Mising payload")

    if user is None:
        return https_fn.Response("No user parameter provided", status=400)
    
    payload["requestAt"] = datetime.now()
    payload["user"] = user
    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("salesInvoice").document(payload["DocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {payload["DocNo"]} added.")

@https_fn.on_request()
def createDeliveryOrder(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    payload = req.get_json(silent=True)
    if payload is None:
        return https_fn.Response(status=400, response="Mising payload")

    if user is None:
        return https_fn.Response("No user parameter provided", status=400)

    payload["requestAt"] = datetime.now()
    payload["user"] = user
    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("deliveryOrder").document(payload["DocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {payload["DocNo"]} added.")

@https_fn.on_request()
def convertDeliveryOrderToSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")
    
    payload = req.get_json(silent=True)
    if payload is None:
        return https_fn.Response(status=400, response="Mising payload")

    if user is None:
        return https_fn.Response("No user parameter provided", status=400)
    
    payload["requestAt"] = datetime.now()
    payload["user"] = user
    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("deliveryOrdertoSalesInvoice").document(payload["deliveryOrderDocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {payload["deliveryOrderDocNo"]} added.")

def listenStockByItemCodeQuery():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
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

        print(read_time)
        callback_done.set()

    col_query = db.collection("stockByItemCodeQuery").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenAllStocksQuery():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenAllStocksQuery: {change.document.id}")
                Common.CheckLogin()
                result = stockQtyBalance.getAllStocksBalanceByItemCodeAndLocationAndBatch()
                print(result)
                db.collection("allStocks").document("itemcodes").set(result)
            elif change.type.name == "MODIFIED":
                print(f"Added stockqty: {change.document.id}")

        print(read_time)
        callback_done.set()

    col_query = db.collection("allStocksQuery").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenSalesInvoicePost():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenSalesInvoicePost: {change.document.id}")
                data = change.document._data
                print(data)
                Common.CheckLogin()
                result = salesInvoice.createSalesInvoice(data)
                print(result)
                db.collection("salesInvoice").document(change.document.id).update({"createdAt": datetime.now()})

        print(read_time)
        callback_done.set()

    col_query = db.collection("salesInvoice").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

def listenDeliveryOrderPost():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenDeliveryOrderPost: {change.document.id}")
                data = change.document._data
                print(data)
                Common.CheckLogin()
                result = deliveryOrder.createDeliverOrder(data)
                print(result)
                db.collection("deliveryOrder").document(change.document.id).update({"createdAt": datetime.now()})

        print(read_time)
        callback_done.set()

    col_query = db.collection("deliveryOrder").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()


def listenDeliveryOrderToSalesInvoicePost():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New listenDeliveryOrderToSalesInvoicePost: {change.document.id}")
                data = change.document._data
                deliveryOrderDocNo = data["deliveryOrderDocNo"]
                salesInvoiceDocNo = data["salesInvoiceDocNo"]
                customerAccount = data["customerAccount"]
                companyName = data["companyName"]
                print(data)
                Common.CheckLogin()
                result = deliveryOrderToSalesInvoice.convertDOtoSI(deliveryOrderDocNo, salesInvoiceDocNo, customerAccount, companyName)
                print(result)
                db.collection("deliveryOrdertoSalesInvoice").document(change.document.id).update({"createdAt": datetime.now()})

        print(read_time)
        callback_done.set()

    col_query = db.collection("deliveryOrdertoSalesInvoice").where(filter=FieldFilter("timestamp", ">=", datetime.now()-timedelta(minutes=1)))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

listenStockByItemCodeQuery()
listenAllStocksQuery()
listenSalesInvoicePost()
listenDeliveryOrderPost()
listenDeliveryOrderToSalesInvoicePost()