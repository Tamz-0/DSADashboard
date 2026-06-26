class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int f[26]={0};
        for(char c:magazine){
            f[c-'a']++;
        }
        for(char c:ransomNote){
            if(f[c-'a']>0)f[c-'a']--;
            else return false;
        }
        return true;
        
    }
};