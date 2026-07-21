class Solution {
public:
    string genword(string s){
        string res="";
        vector<int>f(26,0);
        for(char c:s){
            f[c-'a']++;
        }
        for(int i=0;i<26;i++){
            res+=string(f[i],i+'a');
        }
        return res;
    }
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string,vector<string>>mp;
        vector<vector<string>>res;
        for(string s:strs){
            string t=genword(s);
            mp[t].push_back(s);
        }
        for(auto i:mp){
            res.push_back(i.second);
        }
        return res;
        
    }
};