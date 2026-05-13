class Solution:
    def findLengthOfLCIS(self, nums: List[int]) -> int:
        if not nums:
            return 0
            
        n = len(nums)
        max_len = 1
        curr_len = 1

        # Scan the array once
        for i in range(1, n):
            # If current element is greater than the previous, increment streak
            if nums[i-1] < nums[i]:
                curr_len += 1
            else:
                # Streak broken, reset to 1
                curr_len = 1

            # Keep track of the highest streak found
            max_len = max(max_len, curr_len)

        return max_len