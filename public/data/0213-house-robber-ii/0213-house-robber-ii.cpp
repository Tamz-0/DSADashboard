class Solution {
public:
    vector<int>t;
    int fun(vector<int>&nums,int i,int n){
        if(i>=n)return 0;
        if(t[i]!=-1)return t[i];
        int take=nums[i]+fun(nums,i+2,n);
        int skip=fun(nums,i+1,n);
        return t[i]=max(skip,take);
        return max(skip,take);
    }
    int rob(vector<int>& nums) {
        int n=nums.size();
        if(n==1)return nums[0];
        t.assign(101,-1);
        int x=fun(nums,0,n-1);
        t.assign(101,-1);
        int y=fun(nums,1,n);
        return max(x,y);
        
    }
};