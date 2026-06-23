class Solution {
public:
    int minMoves2(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        int s=0;
        int len=nums.size();
        
            for(int i=0;i<len;i++){
                s+=abs(nums[i]-nums[len/2]);
            }
        
        return s;
        
    }
};