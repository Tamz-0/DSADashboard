class Solution {
    public int maxProduct(int[] nums) {
        int i=0;
        int minp=nums[i];
        int maxp=nums[i];
        int ans=nums[i];
        for(i=1;i<nums.length;i++){
            int v1=minp*nums[i];
            int v2=maxp*nums[i];
            int v3=nums[i];
            maxp=Math.max(v3,Math.max(v1,v2));
            minp=Math.min(v3,Math.min(v1,v2));
            ans=Math.max(ans,Math.max(maxp,minp));
        }
        return ans;
        
    }
}