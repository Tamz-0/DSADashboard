class Solution:
    def smallerNumbersThanCurrent(self, nums: List[int]) -> List[int]:
        temp=sorted(nums)
        d={}
        for i,val in enumerate(temp):
            if val not in d:
                d[val]=i
        ret=[]
        for i in nums:
            ret.append(d[i])
        return ret
        