class Solution:
    def smallestRangeI(self, nums: List[int], k: int) -> int:
        maximum = max(nums)
        minimum = min(nums)

        result = (maximum - k) - (minimum + k)

        return max(0, result)