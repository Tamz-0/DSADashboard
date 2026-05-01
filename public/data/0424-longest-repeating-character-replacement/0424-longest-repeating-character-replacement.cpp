class Solution {
public:
    int characterReplacement(string s, int k) {
        int l=0;int h=0;int r=0;
        int f[256];
        for(int h=0;h<s.size();h++){
            f[s[h]]++;
            int len=h-l+1;
            int mx = *max_element(f, f+256);

            int diff=len-mx;
            while(diff>k){
                f[s[l]]--;
                l++;
                 mx = *max_element(f, f+256);

                len=h-l+1;
                diff=len-mx;
            }
            len=h-l+1;
            r=max(len,r);
        }
        return r;
        
    }
};