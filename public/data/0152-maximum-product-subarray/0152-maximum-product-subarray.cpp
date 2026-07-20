class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxp=nums[0];
        int minp=nums[0];
        int ans=nums[0];
        for(int i=1;i<nums.size();i++){
            int v1=maxp*nums[i];
            int v2=minp*nums[i];
            int v3=nums[i];
            maxp=max({v3,v1,v2});
            minp=min({v1,v3,v2});
            ans=max({ans,maxp,minp});
            
        }
        return ans;
        
    }
};