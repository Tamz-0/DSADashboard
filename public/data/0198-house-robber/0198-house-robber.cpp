class Solution {
public:
    vector<int>t=vector<int>(101,-1);
    int fun(vector<int>&nums,int i,int n){
        if(i>=n)return 0;
        if(t[i]!=-1)return t[i];
        int take=nums[i]+fun(nums,i+2,n);
        int skip=fun(nums,i+1,n);
        return t[i]=max(take,skip);
    }
    int rob(vector<int>& nums) {
        return fun(nums,0,nums.size());
    }
};