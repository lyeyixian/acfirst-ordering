#Updated 18 Jan 2024
import Common

global ComServer
ComServer = Common.ComServer 

def getStockBalanceByItemCode(itemCode):
    lSQL = "SELECT  ItemCode, Sum(Qty) Qty  FROM ST_TR "
    lSQL = lSQL + "WHERE ITEMCODE = '{}' ".format(itemCode)
    lSQL = lSQL + "GROUP BY ItemCode"

    print(lSQL)
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        while not lDataSet.eof:
            print("==================")
            print("Item | Qty")
            print(lDataSet.FindField('ItemCode').AsString + " | " + lDataSet.FindField('Qty').AsString)
            print("==================")
            lDataSet.Next()
    else:
        print ("Record Not Found")

def getAllStocksBalanceByItemCodeAndLocationAndBatch():
    lSQL = "SELECT  ItemCode, Location, Batch, Sum(Qty) Qty  FROM ST_TR   "
    # lSQL = lSQL + "WHERE ITEMCODE ='ANT' "
    lSQL = lSQL + "GROUP BY ItemCode, Location, Batch "
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        while not lDataSet.eof:
            print("===================================")
            print("Item Code | Location | Batch | Qty")
            print(lDataSet.FindField('ItemCode').AsString + " | " +  lDataSet.FindField('Location').AsString + " | " + lDataSet.FindField('Batch').AsString + " | " + lDataSet.FindField('Qty').AsString)
            lDataSet.Next()
    else:
        print ("Record Not Found")


def getAllStocksBalanceItemCode():
    lSQL = "SELECT  ItemCode, Sum(Qty) Qty  FROM ST_TR   "
    # lSQL = lSQL + "WHERE ITEMCODE ='ANT' "
    lSQL = lSQL + "GROUP BY ItemCode "
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        while not lDataSet.eof:
            print("===================================")
            print("Item Code | Qty")
            print(lDataSet.FindField('ItemCode').AsString + " | " + lDataSet.FindField('Qty').AsString)
            lDataSet.Next()
    else:
        print ("Record Not Found")
