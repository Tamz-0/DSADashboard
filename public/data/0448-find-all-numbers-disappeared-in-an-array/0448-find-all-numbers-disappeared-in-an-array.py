class Solution:
    def findDisappearedNumbers(self, nums: List[int]) -> List[int]:
        ret=[]
        n=set(nums)
        for i  in range(1,len(nums)+1):
            if i not in n:
                ret.append(i)
        return ret