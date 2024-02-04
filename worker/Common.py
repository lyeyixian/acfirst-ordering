#Updated 03 Oct 2023
import win32com.client
import Common
import os
from time import sleep

ComServer = win32com.client.Dispatch("SQLAcc.BizApp")

def KillApp():
    os.system('cmd /c "taskkill /IM "SQLACC.exe" /F"')
    sleep(2) #sleep 2 sec


def CheckLogin():
    global ComServer
    ComServer = win32com.client.Dispatch("SQLAcc.BizApp")
    B = ComServer.IsLogin
    if B == False:
        ComServer = win32com.client.Dispatch("SQLAcc.BizApp")
        try:     
            ComServer.Login("ADMIN", "ADMIN", #UserName, Password
                            # "D:\\Happy\\DB\\Default.DCF",
                            "C:\\eStream\\SQLAccounting\\Share\\Default.DCF",  #DCF file
                            "ACC-0002.FDB") #Database Name
            print("Success!")
        except Exception as e:
            print("Oops !", e)


def ShowResult(ADataset):
    if ADataset.RecordCount > 0:
        while not ADataset.eof:
            fc = ADataset.Fields.Count
            for x in range(fc):
                fn = ADataset.Fields.Items(x).FieldName
                fv = ADataset.FindField(fn).AsString
                lresult = "Index : "+ str(x) + " FieldName : " + fn + " Value : " + fv
                print (lresult)
            print("====")
            ADataset.Next()
    else:
        print ("Record Not Found")
        
        
def QuotedStr(ACode):
    return "'" + ACode.replace("'", "''") + "'"
