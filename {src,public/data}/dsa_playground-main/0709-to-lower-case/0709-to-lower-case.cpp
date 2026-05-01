class Solution {
public:
    string toLowerCase(string s) {
        string res="";
        for(int i=0;i<s.length();i++){
            if(s[i]>='A'&&s[i]<='Z'){
                s[i]=(char)(s[i]| ' ');
            }
            res+=s[i];
        }
        return res;
    }
};