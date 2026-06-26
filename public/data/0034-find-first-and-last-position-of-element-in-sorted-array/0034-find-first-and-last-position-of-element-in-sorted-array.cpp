class Solution {
public:
    int first(vector<int>arr,int x){
        int l=0;
        int h=arr.size()-1;
        int res=-1;
        while(l<=h){
            int m=(l+h)/2;
            if(arr[m]>x) h=m-1;
            else if(arr[m]<x) l=m+1;
            else{
                res=m;
                h=m-1;
            }
        }
        return res;
    }
    int second(vector<int>nums,int k){
        int res=-1;
        int l=0;
        int h=nums.size()-1;
        while(l<=h){
            int m=(l+h)/2;
            if(nums[m]>k) h=m-1;
            else if(nums[m]<k)l=m+1;
            else{
                res=m;
                l=m+1;

            }
        }
        return res;
    }
    vector<int> searchRange(vector<int>& nums, int target) {
        vector<int>res={first(nums,target),second(nums,target)};

        return res;
    }
};