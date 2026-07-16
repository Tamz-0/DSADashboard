class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
       unordered_set<int>s1(nums1.begin(),nums1.end());
       vector<int>res;
       for(int i:nums2){
        if(s1.erase(i))res.push_back(i);
       }
       return res; 
    }
};