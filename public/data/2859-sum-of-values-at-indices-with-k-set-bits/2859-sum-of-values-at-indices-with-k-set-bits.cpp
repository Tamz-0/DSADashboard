class Solution {
public:
    int sumIndicesWithKSetBits(vector<int>& nums, int k) {
        int s=0;
        for(int i=0;i<nums.size();i++){
            if(__builtin_popcount(i)==k)s+=nums[i];
        }
        return s;
        
    }
};