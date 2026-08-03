class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
       if(k<=1)return 0;
        int l=0;
        int h=0;
        int res=0;
        int p=1;
        while(h<nums.size()){
            p*=nums[h];
            while(p>=k){
                p/=nums[l];
                l++;
            }
            res+=(h-l+1);
            h++;
        }
        return res;
    }
};