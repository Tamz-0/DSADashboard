class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int z=0;
        int l=0;
        int r=0;
        int n=nums.size();
        int res=0;
        while(r<n){
            if(nums[r]==0)z++;
            if(z>k&&l<n){
                if(nums[l]==0)z--;
                l++;
            }
            if(z<=k){
                int len=r-l+1;
                res=max(res,len);
            }
            r++;
        }
        return res;
    }
};