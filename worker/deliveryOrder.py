#Updated 08 Jan 2024
import Common
from datetime import datetime

global ComServer
ComServer = Common.ComServer 

def getAllDeliveryOrder():
    lSQL = "SELECT A.DOCNO, A.DOCDATE, A.CODE, A.COMPANYNAME, A.DESCRIPTION, A.DOCAMT, "
    lSQL = lSQL + "A.AGENT, A.AREA, "
    lSQL = lSQL + "B.ITEMCODE, B.DESCRIPTION ITEMDESC, B.QTY, B.UOM, B.UNITPRICE, B.DISC,  "
    lSQL = lSQL + "B.TAX, B.TAXRATE, B.TAXAMT, B.TAXINCLUSIVE, B.AMOUNT "
    lSQL = lSQL + "FROM SL_DO A "
    lSQL = lSQL + "INNER JOIN SL_DODTL B ON (A.DOCKEY=B.DOCKEY) "
    # lSQL = lSQL + "WHERE A.CODE='300-A0002' "
    lSQL = lSQL + "AND A.CANCELLED='F' "
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
        
    return Common.ShowResult(lDataSet)

def createDeliverOrder(salesData):
    global ComServer
    ComServer = Common.ComServer 
    BizObject = ComServer.BizObjects.Find("SL_DO")
    lMain = BizObject.DataSets.Find("MainDataSet") #lMain contains master data
    lDetail = BizObject.DataSets.Find("cdsDocDetail") #lDetail contains detail data
    
    lDate = datetime.now()
    lDate.strftime('%m/%d/%Y')
    
    parsedData = salesData
        
    BizObject.New()
    lMain.FindField("DocDate").value = lDate
    lMain.FindField("PostDate").value = lDate

    for field in parsedData:
        if field == "requestAt" or field == "user":
            continue
        print(field)
        if field == "Data":
            deliveryData = parsedData[field]
            count = 1
            for item in deliveryData:
                print(item)
                lDetail.Append()
                lDetail.FindField("Seq").value = count
                for fieldItem in item:
                    print(fieldItem)
                    lDetail.FindField(fieldItem).AsString = item[fieldItem]
                lDetail.Post()
                count += 1
        else:
            lMain.FindField(field).AsString = parsedData[field]        
    try:
        BizObject.Save()          
    except Exception as e:
        print("Oops!", e)    
    BizObject.Close()
    print ("Posting/Update Done")

def editDeliveryOrder(editData):
    BizObject = ComServer.BizObjects.Find("SL_DO")
    lMain = BizObject.DataSets.Find("MainDataSet") #lMain contains master data
    lDetail = BizObject.DataSets.Find("cdsDocDetail") #lDetail contains detail data
    
    lDate = datetime.now()
    lDate.strftime('%m/%d/%Y')
    
    lDocKey = BizObject.FindKeyByRef("DocNo", editData["DocNo"])

    if lDocKey is None:
        print ("Record Not Found, nothing to edit!")
        return
    else:
        BizObject.Params.Find("Dockey").Value = lDocKey
        BizObject.Open()
        BizObject.Edit()
        lMain.Edit()

        totalRecords = lDetail.RecordCount
        for field in editData:
            if field == "Data":
                deliveryData = editData[field]
                for item in deliveryData:
                    lDetail.First()
                    itemCode = item["ItemCode"]
                    count = 0
                    while lDetail.FindField("ItemCode").AsString != item["ItemCode"] and count < totalRecords:
                        lDetail.Next()
                        print(lDetail.FindField("ItemCode").AsString)
                        count += 1
                    if count == totalRecords: #New record added
                        lDetail.Append()
                    else: #Current Record Found
                        lDetail.Edit()
                    for fieldItem in item:
                        lDetail.FindField(fieldItem).AsString = item[fieldItem]
                    lDetail.Post()
            else:
                lMain.FindField(field).AsString = editData[field]        
    try:
        BizObject.Save()          
    except Exception as e:
        print("Oops!", e)    
    BizObject.Close()
    print ("Posting/Update Done") 

def deleteDeliveryOrder(deliveryId):
    #Deleting only work if the record never not knock off by Payment or Credit Note
    BizObject = ComServer.BizObjects.Find("SL_DO")    
    lDocKey = BizObject.FindKeyByRef("DocNo", deliveryId)
        
    if lDocKey is None:
        print ("Record Not Found")
    else:
        BizObject.Params.Find("Dockey").Value = lDocKey
        BizObject.Open()
        BizObject.Delete()     
        print ("Deleting Done")

def deleteDeliveryRecord(deliveryId, itemCode):
    #Deleting only work if the record never not knock off by Payment or Credit Note
    BizObject = ComServer.BizObjects.Find("SL_DO")
    lMain = BizObject.DataSets.Find("MainDataSet") #lMain contains master data
    lDetail = BizObject.DataSets.Find("cdsDocDetail") #lDetail contains detail data

    lDocKey = BizObject.FindKeyByRef("DocNo", deliveryId)
        
    if lDocKey is None:
        print ("Record Not Found")
    else:
        BizObject.Params.Find("Dockey").Value = lDocKey
        BizObject.Open()
        BizObject.Edit()     
        lMain.Edit()

        totalRecords = lDetail.RecordCount
        count = 0
        lDetail.First()
        while lDetail.FindField("ItemCode").AsString != itemCode and count < totalRecords:
            lDetail.Next()
            count += 1
        if lDetail.FindField("ItemCode").AsString == itemCode:
            print(itemCode)
            lDetail.Delete()
            print ("Deleting Done")
        
        else:
            print("No Deletion")
    try:
        BizObject.Save()          
    except Exception as e:
        print("Oops!", e)    

