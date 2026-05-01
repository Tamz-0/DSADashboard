class Solution:
    def productExceptSelf(nums: List[int]) -> List[int]:
        prodZeros = 1
        prodWithoutZeros = 1
        numZeros = 0
        for num in nums:
            if num == 0:
                numZeros += 1
            
            if numZeros > 1:
                return [0] * len(nums)

            prodZeros *= num 
            prodWithoutZeros *= num if num != 0 else 1
        

        return [(prodZeros // num) if num != 0 else prodWithoutZeros for num in nums ]
        
    f = open('user.out', 'w')
    for i in stdin:
        nums = list(map(int,i.rstrip()[1:-1].split(r',')))
        print(str(productExceptSelf(nums)).replace(" ", ""), file=f)
        
    exit(0)
