class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int,int>mp;
        for(int i:nums)mp[i]++;
        vector<pair<int,int>>t;
        for(auto i:mp){
            t.push_back({i.second,i.first});
        }
        sort(t.begin(),t.end());
        reverse(t.begin(),t.end());
        vector<int>res;
        for(int i=0;i<k;i++){
            res.push_back(t[i].second);
        }
        return res;
    }
};