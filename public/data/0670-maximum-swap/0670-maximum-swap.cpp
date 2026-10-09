class Solution {
public:
    int maximumSwap(int num) {
        string s=to_string(num);
        int n=s.length();
        vector<int>maxright(10,-1);
        for(int i=0;i<n;i++){
            maxright[s[i]-'0']=i;
        }
        for(int i=0;i<n;i++){
            char currchar=s[i];
            int currdigit=s[i]-'0';
            for(int k=9;k>currdigit;k--){
                if(maxright[k]>i){
                    swap(s[i],s[maxright[k]]);
                    return stoi(s);
                }
            }
        }
        return num;
    }
};