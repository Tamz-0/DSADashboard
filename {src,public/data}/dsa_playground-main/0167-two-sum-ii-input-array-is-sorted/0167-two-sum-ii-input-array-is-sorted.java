class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l=0;int r=numbers.length-1;
        int s=0;
        while(l<r){
           s=numbers[l]+numbers[r];
           if(s==target){
            return new int[]{l+1,r+1}; 
           }
           else if(s>target){
            r--;
           }else{
            l++;
           }
        }
        return new int[]{-1,-1};

        
    }
}