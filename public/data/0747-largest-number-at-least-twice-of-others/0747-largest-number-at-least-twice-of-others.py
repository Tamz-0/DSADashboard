class Solution:
    def dominantIndex(self, nums: List[int]) -> int:
        
        largest = max(nums)
        nums1 = nums.copy()
        nums1.remove(largest)

        for i in range(len(nums1)):
            if largest < nums1[i]*2:
                return -1
                break
        else:
            return nums.index(largest)