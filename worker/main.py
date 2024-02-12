# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from datetime import datetime
from sqlAccounting import Common
from sqlAccounting import stockQtyBalance
import threading
from time import sleep

from google.cloud.firestore_v1.base_query import FieldFilter
app = initialize_app()

global ComServer
ComServer = Common.ComServer

@https_fn.on_request()
def getStockQtyByItemCode(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    itemCode = req.args.get("itemCode")
    user = req.args.get("user")

    if itemCode is None:
        return https_fn.Response("No text parameter provided", status=400)

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("stockQtyByItemCodeQuery").add({"itemCode": itemCode, "user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {doc_ref.id} added.")

@firestore_fn.on_document_created(document="stockQtyByItemCodeQuery/{pushId}")
def getStockQtyByItemCodeTrigger(event: firestore_fn.Event[firestore_fn.DocumentSnapshot | None]) -> None:
    print("TEST")

    # Get the value of "original" if it exists.
    if event.data is None:
        return
    try:
        itemCode = event.data.get("itemCode")
    except KeyError:
        # No "original" field, so do nothing.
        return

    # Set the "uppercase" field.
    print(f"Getting {event.params['pushId']}: {itemCode}")
    Common.CheckLogin()
    stockQty = stockQtyBalance.getStockBalanceByItemCode(itemCode)
    # upper = original.upper()
    event.data.reference.update({"quantity": int(stockQty)})

def listen_document():
    db = firestore.client()
    # [START firestore_listen_document]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(doc_snapshot, changes, read_time):
        for doc in doc_snapshot:
            print(f"Received document snapshot: {doc.id}")
        callback_done.set()

    doc_ref = db.collection("cities").document("SF")

    # Watch the document
    doc_watch = doc_ref.on_snapshot(on_snapshot)
    # [END firestore_listen_document]

    # Creating document
    data = {
        "name": "San Francisco",
        "state": "CA",
        "country": "USA",
        "capital": False,
        "population": 860000,
    }
    doc_ref.set(data)
    # Wait for the callback.
    callback_done.wait(timeout=60)
    # [START firestore_listen_detach]
    # Terminate watch on a document
    doc_watch.unsubscribe()
    # [END firestore_listen_detach]


def listen_multiple():
    db = firestore.client()
    # [START firestore_listen_query_snapshots]

    # Create an Event for notifying main thread.
    callback_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New query: {change.document.id}")
                itemCode = change.document.get("itemCode")
                print(itemCode)
                # itemCode = newData["itemCode"]
                Common.CheckLogin()
                stockQty = stockQtyBalance.getStockBalanceByItemCode(itemCode)
                db.collection("stockQtyByItemCodeQuery").document(change.document.id).update({"quantity": -1 if  stockQty == None else int(stockQty)})
                print(stockQty)
            elif change.type.name == "MODIFIED":
                print(f"Added stockqty: {change.document.id}")

        print(read_time)
        callback_done.set()

    col_query = db.collection("stockQtyByItemCodeQuery")

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)
    # query_watch.unsubscribe()

    # query_watch.unsubscribe()


    # [END firestore_listen_query_snapshots]
    # # Creating document
    # data = {
    #     "name": "San Francisco",
    #     "state": "CA",
    #     "country": "USA",
    #     "capital": False,
    #     "population": 860000,
    # }
    # db.collection("cities").document("SF").set(data)
    # Wait for the callback.
    # callback_done.wait(timeout=60)
    # query_watch.unsubscribe()


def listen_for_changes():
    db = firestore.client()
    # [START firestore_listen_query_changes]

    # Create an Event for notifying main thread.
    delete_done = threading.Event()

    # Create a callback on_snapshot function to capture changes
    def on_snapshot(col_snapshot, changes, read_time):
        print("Callback received query snapshot.")
        print("Current cities in California: ")
        for change in changes:
            if change.type.name == "ADDED":
                print(f"New city: {change.document.id}")
            elif change.type.name == "MODIFIED":
                print(f"Modified city: {change.document.id}")
            elif change.type.name == "REMOVED":
                print(f"Removed city: {change.document.id}")
                delete_done.set()

    col_query = db.collection("cities").where(filter=FieldFilter("state", "==", "CA"))

    # Watch the collection query
    query_watch = col_query.on_snapshot(on_snapshot)

    # [END firestore_listen_query_changes]
    mtv_document = db.collection("cities").document("MTV")
    # Creating document
    mtv_document.set(
        {
            "name": "Mountain View",
            "state": "CA",
            "country": "USA",
            "capital": False,
            "population": 80000,
        }
    )
    sleep(1)

    # Modifying document
    mtv_document.update(
        {
            "name": "Mountain View",
            "state": "CA",
            "country": "USA",
            "capital": False,
            "population": 90000,
        }
    )
    sleep(1)

    # Delete document
    mtv_document.delete()

    # Wait for the callback captures the deletion.
    delete_done.wait(timeout=60)
    query_watch.unsubscribe()


listen_multiple()