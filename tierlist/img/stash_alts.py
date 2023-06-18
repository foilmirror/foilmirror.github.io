import os

for filename in os.listdir("."):
    if filename.endswith(".png"):
        #print(os.path.basename(filename))
        dexnum = filename.split(".")[0]
        if dexnum.isdigit():
            print(dexnum)
        else:
            os.rename(filename, "alts/" + filename)
