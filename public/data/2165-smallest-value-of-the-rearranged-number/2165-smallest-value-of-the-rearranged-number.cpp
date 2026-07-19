class Solution {
public:
    long long smallestNumber(long long num) {
        if(num==0)return 0;
        bool neg=(num<0);
        num=llabs(num);
        vector<int>res;
        while(num){
            res.push_back(num%10);
            num/=10;
        }
        if(neg){
            sort(res.begin(),res.end());
            reverse(res.begin(),res.end());
        }else{
            sort(res.begin(),res.end());
            if(res[0]==0){
                int i=0;
                while(res[i]==0)i++;
                swap(res[0],res[i]);
            }
        }
        long long ans=0;
        for(int i:res){
            ans=ans*10+i;
        }
        return neg?-ans:ans;
        
    }
};