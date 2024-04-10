#Updated 08 Jan 2024
import Common
from datetime import datetime

def convertDOtoSI(deliveryOrderDocNo, customerAccount, companyName):
    global ComServer
    ComServer = Common.ComServer

    # Check Is transfered or not
    lSQL = "SELECT DocKey FROM SL_IVDTL "
    lSQL = lSQL + "WHERE FromDockey=(SELECT DocKey FROM SL_DO " 
    lSQL = lSQL + "WHERE DocNo='{}') ".format(deliveryOrderDocNo)
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    if lDataSet.RecordCount == 0:
        # Get DO information (Not transferred)
        lSQL = "SELECT * FROM SL_DODTL "
        lSQL = lSQL + "WHERE Dockey=(SELECT DocKey FROM SL_DO " 
        lSQL = lSQL + "WHERE DocNo='{}') ".format(deliveryOrderDocNo)
        lDoDetail = ComServer.DBManager.NewDataSet(lSQL)

	    # Find and Create the Biz Objects and set dataset
        BizObject = ComServer.BizObjects.Find("SL_IV")
        lMain = BizObject.DataSets.Find("MainDataSet") #lMain contains master data
        lDetail = BizObject.DataSets.Find("cdsDocDetail") #lDetail contains detail data

        # Insert Data
        lDate = datetime.now()
        lDate.strftime('%m/%d/%Y')
            
        BizObject.New()
        lMain.FindField("DocDate").value = lDate
        lMain.FindField("PostDate").value = lDate
        lMain.FindField("Description").AsString = "Generated from Delivery Order {}".format(deliveryOrderDocNo)
        lMain.FindField("DocKey").value = -1
        lMain.FindField("Code").AsString        = customerAccount
        lMain.FindField("CompanyName").AsString = companyName

        if lDoDetail.RecordCount > 0:
            count = 1
            while not lDoDetail.eof:
                lDetail.Append()
                lDetail.FindField("DtlKey").value         = -1
                lDetail.FindField("DocKey").value         = -1
                lDetail.FindField("Seq").value            = count
                lDetail.FindField("ItemCode").AsString    = lDoDetail.FindField("ItemCode").AsString
                lDetail.FindField("Description").AsString = lDoDetail.FindField("Description").AsString
                lDetail.FindField("UOM").AsString         = lDoDetail.FindField("UOM").AsString
                lDetail.FindField("Qty").AsFloat          = lDoDetail.FindField("Qty").AsFloat
                lDetail.FindField("DISC").AsString        = lDoDetail.FindField("Disc").AsString
                lDetail.FindField("Tax").AsString         = lDoDetail.FindField("Tax").AsString
                lDetail.FindField("TaxRate").AsString     = lDoDetail.FindField("TaxRate").AsString
                lDetail.FindField("TaxInclusive").value   = lDoDetail.FindField("TaxInclusive").Value
                lDetail.FindField("UnitPrice").AsFloat    = lDoDetail.FindField("UnitPrice").AsFloat
                lDetail.FindField("Amount").AsFloat       = lDoDetail.FindField("Amount").AsFloat
                lDetail.FindField("TaxAmt").AsFloat       = lDoDetail.FindField("TaxAmt").AsFloat
                lDetail.FindField("FromDocType").AsString = "DO"
                lDetail.FindField("FromDockey").AsFloat   = lDoDetail.FindField("DocKey").AsFloat
                lDetail.FindField("FromDtlkey").AsFloat   = lDoDetail.FindField("DtlKey").AsFloat

                # fields = lDoDetail.Fields.Count
                # for field in range(fields):
                #     fieldName = lDoDetail.Fields.Items(field).FieldName
                #     fieldValue = lDoDetail.FindField(fieldName).AsString
                #     print(fieldName, fieldValue)
                #     try:
                #         lDetail.FindField(fieldName).AsString = fieldValue
                #     except Exception as e:
                #         print(e)
                #         print("Delivery Order does not have this field: {}".format(fieldName))
                lDetail.Post()
                lDoDetail.Next()
                count += 1
    else:
        print("Delivery Order has been transferred to Sales Inovice! No changes is made.")
        return
    
    try:
        BizObject.Save()          
    except Exception as e:
        print("Oops!", e)    
    BizObject.Close()
    print ("Posting/Update Done")
