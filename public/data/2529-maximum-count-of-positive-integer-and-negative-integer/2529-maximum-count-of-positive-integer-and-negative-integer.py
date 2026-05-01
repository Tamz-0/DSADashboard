class Solution:
    def maximumCount(self, nums: List[int]) -> int:
        count = 0
        n = len(nums)
        num_0 = 0
        for num in nums:
            if num>0:
                count+=1
            if num==0:
                num_0+=1
        n-=num_0
        return max(count, n-count)