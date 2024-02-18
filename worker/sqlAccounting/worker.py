import sys, os
import Common
import stock
import deliveryOrder
import salesInvoice
import stockQtyBalance
import deliveryOrderToSalesInvoice
import json

def main():
    global ComServer
    ComServer = Common.ComServer

    while True:
        print("1: Check stock balance by itemcode\n" +
              "2: Check all stocks balance (Group by Item Code, Location, Batch)\n" +
              "3: Check all stocks balance group by Item Code\n" + 
              "4: Get all stocks details\n" +
              "5: Create Sales Invoice\n" + 
              "6: Create Delivery Order\n" +
              "7: Edit Sales Invoice\n" +
              "8: Edit Delivery Order\n" +
              "9: Delete Sales Inovice\n" +
              "10: Delete Delivery Order\n" +
              "11: Transfer Delivory Order to Sales Invoice\n" +
              "12: Get all Sales Invoice\n" +
              "13: Get all Delivery Orders\n" +
              "0: Exit SQL App")
        
        inputType = input("Input a number to select the function to execute: ")

        try: 
            match int(inputType):
                case 0:
                    ComServer = None
                    Common.KillApp()
                    sys.exit(0)
                case 1:
                    itemcode = input("Enter item code: ")
                    stockQtyBalance.getStockBalanceByItemCode(itemcode)
                case 2:
                    itemcode = input("Enter item code: ")
                    result = stockQtyBalance.getAllStocksBalanceByItemCodeAndLocationAndBatch(itemcode)
                    print(result)
                case 3:
                    stockQtyBalance.getAllStocksBalanceItemCode()
                case 4:
                    result = stock.GetListData()
                    print(result)
                case 5:
                    salesInvoiceFilePath = input("Enter sales invoice json file path (Example (/sampleData/testSalesInvoice1.json)): ") #/sampleData/testSalesInvoice1.json
                    absolutePath = os.path.dirname(__file__)
                    fullPath = os.path.join(absolutePath + salesInvoiceFilePath)
                    salesInvoiceFile = open(fullPath)
                    salesInvoiceData = json.load(salesInvoiceFile)
                    salesInvoice.createSalesInvoice(salesInvoiceData)
                case 6:
                    deliveryOrderFilePath = input("Enter delivery order json file path (Example (/sampleData/testDeliveryOrder1.json)): ") #/sampleData/testDeliveryOrder1.json
                    absolutePath = os.path.dirname(__file__)
                    fullPath = os.path.join(absolutePath + deliveryOrderFilePath)
                    deliveryOrderFile = open(fullPath)
                    deliveryOrderData = json.load(deliveryOrderFile)
                    deliveryOrder.createDeliverOrder(deliveryOrderData)
                case 7:
                    salesInvoiceFilePath = input("Enter sales invoice file path (Example (/sampleData/testSalesInvoice1.json)): ") #/sampleData/testSalesInvoice1.json
                    absolutePath = os.path.dirname(__file__)
                    fullPath = os.path.join(absolutePath + salesInvoiceFilePath)
                    salesInvoiceFile = open(fullPath)
                    salesInvoiceData = json.load(salesInvoiceFile)
                    print(salesInvoiceData)
                    salesInvoice.editSalesInvoice(salesInvoiceData)
                case 8:
                    deliveryOrderFilePath = input("Enter delivery order json file path (Example (/sampleData/testDeliveryOrder1.json)): ") #/sampleData/testDeliveryOrder1.json
                    absolutePath = os.path.dirname(__file__)
                    fullPath = os.path.join(absolutePath + deliveryOrderFilePath)
                    deliveryOrderFile = open(fullPath)
                    deliveryOrderData = json.load(deliveryOrderFile)
                    deliveryOrder.editDelivoryOrder(deliveryOrderData)
                case 9:
                    salesInvoiceId = input("Enter sales invoice id to delete (Example (test2)): ") #/sampleData/testDeliveryOrder1.json
                    salesInvoice.deleteSalesInvoice(salesInvoiceId)
                case 10:
                    deliveryId = input("Enter delivery id to delete (Example (test2)): ") #/sampleData/testDeliveryOrder1.json
                    deliveryOrder.deleteDeliveryOrder(deliveryId)
                case 11:
                    deliveryOrderDocNo = input("Enter Delivery Order Doc No: ")
                    salesInvoiceDocNo = input("Enter Sales Invoice Doc No: ")
                    customerAccount = input("Customer Account (Code)")
                    companyName = input("Company Name")
                    deliveryOrderToSalesInvoice.convertDOtoSI(deliveryOrderDocNo, salesInvoiceDocNo, customerAccount, companyName)
                case 12:
                    result = salesInvoice.getAllSalesInvoice()
                    print(result)
                case 13:
                    result = deliveryOrder.getAllDeliveryOrder()
                    print(result)
                case _:
                    print("No actions available for " + inputType)
        except Exception as e:
            print(e)

if __name__ == '__main__':
    try:
        Common.CheckLogin()
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
    finally:
        ComServer = None
        # Common.KillApp()
