class Solution:
    def sortedSquares(self, nums: List[int]) -> List[int]:
        n=len(nums)
        l=0
        r=n-1
        pos=n-1
        ans=[0]*n
        while l<=r:
            if(abs(nums[l])<abs(nums[r])):
                ans[pos]=nums[r]*nums[r]
                r-=1
            else:
                ans[pos]=nums[l]*nums[l]
                l+=1
            pos-=1

           
        return ans
        