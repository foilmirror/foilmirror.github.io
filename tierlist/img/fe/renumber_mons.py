import os
import re
from string import digits
from collections import OrderedDict


for folder in os.listdir("."):
    count = 0
    if not folder.endswith(".py"):
        print(folder)
        dict = OrderedDict()
        for filename in os.listdir("./" + folder):
            if filename.endswith(".png"):
                dexname = filename.split(".")[0]
                dexnum = int(re.match("([0-9]*)",dexname).groups()[0])
                dict[dexname] = dexnum
        dict = OrderedDict(sorted(dict.items(), key=lambda x:x[1]))

        for name, num in dict.items():
            os.rename(folder + "/" + name + ".png", folder + "/" + str(count) + ".png")
            count += 1
