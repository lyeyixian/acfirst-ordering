# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from datetime import datetime
from sqlAccounting import Common
from sqlAccounting import stockQtyBalance
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