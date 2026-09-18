class Solution {
public:
    bool findSubarrays(vector<int>& nums) {
      set<int>mp;
      for(int i=1;i<nums.size();i++){
            int s=nums[i]+nums[i-1];
            if(mp.find(s)!=mp.end())return true;
            mp.insert(s);

      }
      return false;

    }
};