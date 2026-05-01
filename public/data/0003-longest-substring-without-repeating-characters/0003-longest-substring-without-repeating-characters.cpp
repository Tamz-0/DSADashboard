class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char,int>f;
        int l=0;
        int h=0;
        int r=0;
        for(h;h<s.size();h++){
            f[s[h]]++;
            while(f[s[h]]>1){
                f[s[l]]--;
                l++;
            }
            int len=h-l+1;
            r=max(len,r);
        }
        return r;

        
    }
};