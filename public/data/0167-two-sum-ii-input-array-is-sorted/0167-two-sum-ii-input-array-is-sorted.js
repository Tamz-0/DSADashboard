/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    let l=0;
    let r=numbers.length -1;
    while(l<r){
        let s=numbers[l]+numbers[r]
        if(s==target){
            return [l+1,r+1];
        }else if(s>target){
            r--;
        }else{
            l++;
        }
    }
    return [-1,-1];
    
};