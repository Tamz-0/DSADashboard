class Solution {
public:
    int findMin(vector<int>& nums) {
        int res=INT_MAX;
        int l=0;
        int n=nums.size()-1;
        int h=n;
        while(l<=h){
            int m=(l+h)/2;
            if(nums[m]>nums[n]) l=m+1;
            else{
                res=nums[m];
                h=m-1;
            }
        }
        return res;
        
    }
};