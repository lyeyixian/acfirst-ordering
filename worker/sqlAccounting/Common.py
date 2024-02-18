#Updated 03 Oct 2023
import win32com.client
import os
from time import sleep
import pythoncom


ComServer = win32com.client.Dispatch("SQLAcc.BizApp", pythoncom.CoInitialize())

def KillApp():
    os.system('cmd /c "taskkill /IM "SQLACC.exe" /F"')
    sleep(2) #sleep 2 sec


def CheckLogin():
    global ComServer
    ComServer = win32com.client.Dispatch("SQLAcc.BizApp", pythoncom.CoInitialize())
    B = ComServer.IsLogin
    if B == False:
        ComServer = win32com.client.Dispatch("SQLAcc.BizApp", pythoncom.CoInitialize())
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
        result = {}
        count = 1
        while not ADataset.eof:
            result[count] = {}
            fc = ADataset.Fields.Count
            for x in range(fc):
                fn = ADataset.Fields.Items(x).FieldName
                fv = ADataset.FindField(fn).AsString
                result[count][fn] = fv
                # lresult = "Index : "+ str(x) + " FieldName : " + fn + " Value : " + fv
                # print (lresult)
            ADataset.Next()
            count += 1
        return result
    else:
        print ("Record Not Found")
        
        
def QuotedStr(ACode):
    return "'" + ACode.replace("'", "''") + "'"
