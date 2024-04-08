#Updated 18 Jan 2024
import Common

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
            strCount = str(count)
            result[strCount] = {}
            result[strCount]["itemCode"] = itemCode
            result[strCount]["location"] = lDataSet.FindField('Location').AsString
            result[strCount]["batch"] = lDataSet.FindField('batch').AsString
            result[strCount]["quantity"] = lDataSet.FindField('Qty').AsString
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
        result = []
        while not lDataSet.eof:
            stock = {}
            stock["itemCode"] = lDataSet.FindField('ItemCode').AsString
            stock["location"] = lDataSet.FindField('Location').AsString
            stock["batch"] = lDataSet.FindField('batch').AsString
            stock["quantity"] = lDataSet.FindField('Qty').AsString
            print(stock)
            # print("===================================")
            # print("Item Code | Location | Batch | Qty")
            # print(lDataSet.FindField('ItemCode').AsString + " | " +  lDataSet.FindField('Location').AsString + " | " + lDataSet.FindField('Batch').AsString + " | " + lDataSet.FindField('Qty').AsString)
            result.append(stock)
            lDataSet.Next()
        return result
    else:
        print ("Record Not Found")

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
