class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int l=0;
        int h=0;
        int r=INT_MAX;
        int s=0;
        for(h=0;h<nums.size();h++){
            s=s+nums[h];
            while(s>=target){
                int len=h-l+1;
                r=min(r,len);
                l++;
                s=s-nums[l-1];
            }
        }
        if(r==INT_MAX){
            r=0;
        }
        return r;
        
    }
};