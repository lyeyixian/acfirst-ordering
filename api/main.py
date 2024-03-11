# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
from google.cloud.firestore import Client
from datetime import datetime

app = initialize_app()
firestore_client: Client = firestore.client()


@https_fn.on_request()
def getStockByItemCode(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    itemCode = req.args.get("itemCode")
    user = req.args.get("user")

    if itemCode is None or user is None:
        return {
            "message": "No itemCode or user parameter provided"
        }, 400

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("stockByItemCodeQuery").add(
        {"itemCode": itemCode, "user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {doc_ref.id} added."}


@https_fn.on_request()
def getAllStock(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return {"message": "No text parameter provided"}, 400

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("allStocksQuery").add(
        {"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {doc_ref.id} added."}


@https_fn.on_request()
def getSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return {"message": "No user parameter provided"}, 400

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("salesInvoiceQuery").add(
        {"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {doc_ref.id} added."}


@https_fn.on_request()
def getDeliveryOrder(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    if user is None:
        return {"message": "No user parameter provided"}, 400

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    _, doc_ref = firestore_client.collection("deliveryOrderQuery").add(
        {"user": user, "timestamp": datetime.now()})

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {doc_ref.id} added."}


@https_fn.on_request()
def createSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    payload = req.get_json(silent=True)
    if payload is None:
        return {"message": "Mising payload"}, 400

    if user is None:
        return {"message": "No user parameter provided"}, 400

    payload["requestAt"] = datetime.now()
    payload["user"] = user
    payload["status"] = "pending"

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("salesInvoice").document(
        payload["DocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {payload["DocNo"]} added."}


@https_fn.on_request()
def createDeliveryOrder(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    payload = req.get_json(silent=True)
    if payload is None:
        return {"message": "Mising payload"}, 400

    if user is None:
        return {"message": "No user parameter provided"}, 400

    payload["requestAt"] = datetime.now()
    payload["user"] = user
    payload["status"] = "pending"

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("deliveryOrder").document(
        payload["DocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {payload["DocNo"]} added."}


@https_fn.on_request()
def convertDeliveryOrderToSalesInvoice(req: https_fn.Request) -> https_fn.Response:
    # Grab the text parameter.
    user = req.args.get("user")

    payload = req.get_json(silent=True)
    if payload is None:
        return {"message": "Mising payload"}, 400

    if user is None:
        return {"message": "No user parameter provided"}, 400

    payload["requestAt"] = datetime.now()
    payload["user"] = user
    payload["status"] = "pending"

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("deliveryOrdertoSalesInvoice").document(
        payload["deliveryOrderDocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return {"message": f"Message with ID {payload["deliveryOrderDocNo"]} added."}
