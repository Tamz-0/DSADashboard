class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
       if(nums.size()==0)return false;
       sort(nums.begin(),nums.end());
       int c=1;
       for(int i=0;i+1<nums.size();i++){
        if(nums[i]==nums[i+1])c++;
       }
       return c>=2;
        
    }
    
};