# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from datetime import datetime

app = initialize_app()

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
    payload["status"] = "pending"
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
    payload["status"] = "pending"
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
    payload["status"] = "pending"
    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    firestore_client.collection("deliveryOrdertoSalesInvoice").document(payload["deliveryOrderDocNo"]).set(payload)

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Message with ID {payload["deliveryOrderDocNo"]} added.")
