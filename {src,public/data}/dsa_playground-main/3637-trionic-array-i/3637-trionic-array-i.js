/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isTrionic = function(nums) {
    const n=nums.length;
    if(n<3)return false;
    let i=0;
    while(i+1<n&&nums[i]<nums[i+1])i++;
    if(i==0||i==n-1)return false;
    let mid=i;
    while(i+1<n&&nums[i]>nums[i+1])i++;
    if(i==mid||i==n-1)return false;
    while(i+1<n&&nums[i]<nums[i+1])i++;
    return i==n-1;

    
    
};