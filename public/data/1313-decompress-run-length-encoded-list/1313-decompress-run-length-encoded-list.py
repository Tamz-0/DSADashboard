class Solution:
    def decompressRLElist(self, nums: List[int]) -> List[int]:
        n = len(nums)
        output = []
        for i in range(0, n, 2):
            freq, val = nums[i], nums[i+1]
            output.extend([val]*freq)
        return output