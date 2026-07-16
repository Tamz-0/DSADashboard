class Solution {
public:
    int finalValueAfterOperations(vector<string>& operations) {
     int x=0;
     for(string s:operations){
        for(int i=0;i<s.size();i++){
            if(s[i]=='x') continue;
            if(i<s.size()&&s[i]=='+'&&s[i+1]=='+')x++; 
            if(i<s.size()&&s[i]=='-'&&s[i+1]=='-')x--; 
                
        }
     }
     return x;   
    }
};