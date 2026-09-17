class Solution {
public:
    int characterReplacement(string s, int k) {
        unordered_map<char,int>f;
        int l=0;
        int res=INT_MIN;
        int mx=0;
        for(int h=0;h<s.size();h++){
            f[s[h]]++;
            int len=h-l+1;
            mx=max(mx,f[s[h]]);
            while(len-mx>k){
                f[s[l]]--;
                l++;
            len=h-l+1;
            }
            res=max(res,len);
        }
        return res;
    }
};