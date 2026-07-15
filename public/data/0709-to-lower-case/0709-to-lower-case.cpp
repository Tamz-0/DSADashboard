class Solution {
public:
    string toLowerCase(string s) {
        string res;
        for(char c:s){
            res+=tolower(c);
        }
        return res;
    }
};