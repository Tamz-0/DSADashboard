class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char,int>hash={{'I',1},
                                        {'V',5},
                                        {'X',10},
                                        {'L',50},
                                        {'C',100},
                                        {'D',500},
                                        {'M',1000}};
        int n=s.size();
        int ans=0;
        for(int i=0;i+1<n;i++){
            int temp=hash[s[i]];
            
            int temp2=hash[s[i+1]];
            if(temp<temp2){
                ans-=temp;
            }else{
            
            ans+=temp;} 
        }
        return ans+hash[s[n-1]];

        
        
    }
};