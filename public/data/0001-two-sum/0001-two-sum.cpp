class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int>f;
        for(int i=0;i<nums.size();i++){
            int rem=target-nums[i];
            if(f.find(rem)!=f.end()){
                return {f[rem],i};
            }
            else{
                f[nums[i]]=i;
            }
            
        }
        return {-1,-1};
    }
};