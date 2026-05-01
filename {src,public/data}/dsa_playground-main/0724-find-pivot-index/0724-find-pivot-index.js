/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
    let l=0;
    let s=0;
    for(let i=0;i<nums.length;i++){
        s+=nums[i];
    }
    for(let i=0;i<nums.length;i++){
        if (l === s - l - nums[i]) {
            return i;
        }
        l += nums[i];
    }
    
    
    return -1;
    
};