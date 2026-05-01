class Solution(object):
    def longestCommonPrefix(self, arr):
        ans=""
        for i in range(len(arr[0])):
            ch = arr[0][i]

            match = True 
            for j in range(1,len(arr)):

                if len(arr[j]) <= i or  ch!=arr[j][i]:
                    match = False 
                    break 
            if match == False:
                break 
            else:
                ans+=ch 
        return ans 
           
        