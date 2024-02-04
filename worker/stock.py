#Updated 21 Dec 2023
import Common
       
def GetListData():
    lSQL = "SELECT A.*, B.UOM, B.RATE, B.REFCOST, B.REFPRICE, B.ISBASE FROM ST_ITEM A "
    lSQL = lSQL + "INNER JOIN ST_ITEM_UOM B ON (A.CODE=B.CODE) "
    lSQL = lSQL + "WHERE A.ISACTIVE='T' "
    lSQL = lSQL + "ORDER BY A.CODE, B.RATE" 
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
        
    Common.ShowResult(lDataSet)

def PostData():
    BizObject = ComServer.BizObjects.Find("ST_ITEM")
    lMain = BizObject.DataSets.Find("MainDataSet")
    lDtl = BizObject.DataSets.Find("cdsUOM")
    LBar = BizObject.DataSets.Find("cdsBarcode")
    
    lDocKey = BizObject.FindKeyByRef("CODE", "FAIRY")
        
    if lDocKey is None:
        BizObject.New()
        lMain.FindField("CODE").value = "FAIRY"
        lMain.FindField("DESCRIPTION").value = "FAIRY TAIL"
        lMain.FindField("STOCKGROUP").value = "DEFAULT";
        lMain.FindField("STOCKCONTROL").value = "T";
        lMain.FindField("ISACTIVE").value = "T";

        lDtl.Edit() #For 1St UOM
        lDtl.FindField("UOM").AsString = "PCS"
        lDtl.FindField("Rate").AsFloat = 1
        lDtl.FindField("RefCost").AsFloat = 10.2
        lDtl.FindField("RefPrice").AsFloat = 25
        lDtl.Post()

        lDtl.Append() #For 2nd UOM
        lDtl.FindField("UOM").AsString = "CTN"
        lDtl.FindField("Rate").AsFloat = 12
        lDtl.FindField("RefCost").AsFloat = 102
        lDtl.FindField("RefPrice").AsFloat = 240
        lDtl.Post()
        
        LBar.Append() #For 1St UOM Barcode
        LBar.FindField("Barcode").AsString = "123456"
        LBar.FindField("UOM").AsString = "PCS"
        LBar.Post()

        LBar.Append() #For 2nd UOM Barcode
        LBar.FindField("Barcode").AsString = "7890123"
        LBar.FindField("UOM").AsString = "CTN"
        LBar.Post()
    else:
        BizObject.Params.Find("Dockey").Value = lDocKey
        BizObject.Open()
        BizObject.Edit()
        lMain.FindField("DESCRIPTION").value = "FAIRY TAIL WIZARD"
        
        while lDtl.RecordCount > 0:
            lDtl.First()
            lDtl.Delete()

        #Insert back with new Price
        lDtl.Append() #For 1St UOM
        lDtl.FindField("UOM").AsString = "PCS" #Make sure this always same as b4 delete data
        lDtl.FindField("Rate").AsFloat = 1     #Make sure this always same as b4 delete data
        lDtl.FindField("RefCost").AsFloat = 22.3
        lDtl.FindField("RefPrice").AsFloat = 52
        lDtl.FindField("ISBASE").AsFloat = 1 
        lDtl.Post();

        lDtl.Append()  #For 2nd UOM
        lDtl.FindField("UOM").AsString = "CTN" #Make sure this always same as b4 delete data
        lDtl.FindField("Rate").AsFloat = 12    #Make sure this always same as b4 delete data
        lDtl.FindField("RefCost").AsFloat = 102.5
        lDtl.FindField("RefPrice").AsFloat = 260.45
        lDtl.FindField("ISBASE").AsFloat = 0 
        lDtl.Post()
    
        while LBar.RecordCount > 0:
            LBar.First()
            LBar.Delete()    

        LBar.Append() #For 1St UOM Barcode
        LBar.FindField("Barcode").AsString = "888888"
        LBar.FindField("UOM").AsString = "PCS"
        LBar.Post()

        LBar.Append() #For 2nd UOM Barcode
        LBar.FindField("Barcode").AsString = "999999"
        LBar.FindField("UOM").AsString = "CTN"
        LBar.Post()
    try:
        BizObject.Save()          
    except Exception as e:
        print("Oops!", e)    
    BizObject.Close()
    print ("Posting/Update Done")

def DelData():
    #Deleting only work if the record never use in other document
    BizObject = ComServer.BizObjects.Find("ST_ITEM")
    
    lDocKey = BizObject.FindKeyByRef("CODE", "FAIRY")
        
    if lDocKey is None:
        print ("Record Not Found")
    else:
        BizObject.Params.Find("Dockey").Value = lDocKey
        BizObject.Open()
        BizObject.Delete()        
        print ("Deleting Done")

try:
    Common.CheckLogin()
    global ComServer
    ComServer = Common.ComServer
    GetListData()
    PostData()
    
    answer = input("Continue To delete?")
    if answer.lower() in ["y","yes"]:
        DelData()
    elif answer.lower() in ["n","no"]:
        print ("Deleting Aborted")
    else:
       print ("Invalid Input")
    ComServer.Logout()
finally:
    ComServer = None
    Common.KillApp()
