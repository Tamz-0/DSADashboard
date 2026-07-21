class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string,vector<string>>mp;
        vector<vector<string>>res;
        for(string s:strs){
            vector<int>f(26,0);
            for(char c:s){
                f[c-'a']++;

            }
            string key;
            for(int i:f){
                key+="#";
                key+=to_string(i);
            }
            mp[key].push_back(s);
        }
        for(auto i:mp){
            res.push_back(i.second);
        }
        return res;
        
    }
};