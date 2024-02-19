#Updated 18 Jan 2024
import sqlAccounting.Common

def getStockBalanceByItemCode(itemCode):
    global ComServer
    ComServer = Common.ComServer 

    lSQL = "SELECT  ItemCode, Sum(Qty) Qty  FROM ST_TR "
    lSQL = lSQL + "WHERE ITEMCODE = '{}' ".format(itemCode)
    lSQL = lSQL + "GROUP BY ItemCode"

    print(lSQL)
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        qty = -1
        while not lDataSet.eof:
            print("==================")
            print("Item | Qty")
            print(lDataSet.FindField('ItemCode').AsString + " | " + lDataSet.FindField('Qty').AsString)
            qty = lDataSet.FindField('Qty').AsString
            print("==================")
            lDataSet.Next()
        return qty
    else:
        print ("Record Not Found")

def getStocksBalanceByItemCodeAndLocationAndBatch(itemCode):
    global ComServer
    ComServer = Common.ComServer 

    lSQL = "SELECT  ItemCode, Location, Batch, Sum(Qty) Qty  FROM ST_TR   "
    lSQL = lSQL + "WHERE ITEMCODE = '{}' ".format(itemCode)
    lSQL = lSQL + "GROUP BY ItemCode, Location, Batch "
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        result = {}
        count  = 1
        while not lDataSet.eof:
            result[count] = {}
            result[count]["itemCode"] = itemCode
            result[count]["location"] = lDataSet.FindField('Location').AsString
            result[count]["batch"] = lDataSet.FindField('batch').AsString
            result[count]["quantity"] = lDataSet.FindField('Qty').AsString
            # print("===================================")
            # print("Item Code | Location | Batch | Qty")
            # print(lDataSet.FindField('ItemCode').AsString + " | " +  lDataSet.FindField('Location').AsString + " | " + lDataSet.FindField('Batch').AsString + " | " + lDataSet.FindField('Qty').AsString)
            lDataSet.Next()
            count += 1
        return result
    else:
        print ("Record Not Found")

def getAllStocksBalanceByItemCodeAndLocationAndBatch():
    global ComServer
    ComServer = Common.ComServer 

    lSQL = "SELECT  ItemCode, Location, Batch, Sum(Qty) Qty  FROM ST_TR   "
    # lSQL = lSQL + "WHERE ITEMCODE = '{}' ".format(itemCode)
    lSQL = lSQL + "GROUP BY ItemCode, Location, Batch "
    
    lDataSet = ComServer.DBManager.NewDataSet(lSQL)
    
    if lDataSet.RecordCount > 0:
        result = {}
        count  = 1
        while not lDataSet.eof:
            result[count] = {}
            result[count]["itemCode"] = lDataSet.FindField('ItemCode').AsString
            result[count]["location"] = lDataSet.FindField('Location').AsString
            result[count]["batch"] = lDataSet.FindField('batch').AsString
            result[count]["quantity"] = lDataSet.FindField('Qty').AsString
            # print("===================================")
            # print("Item Code | Location | Batch | Qty")
            # print(lDataSet.FindField('ItemCode').AsString + " | " +  lDataSet.FindField('Location').AsString + " | " + lDataSet.FindField('Batch').AsString + " | " + lDataSet.FindField('Qty').AsString)
            lDataSet.Next()
            count += 1
        return result
    else:
        print ("Record Not Found")

def getAllStocksBalanceItemCode():
    global ComServer
    ComServer = Common.ComServer 

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
