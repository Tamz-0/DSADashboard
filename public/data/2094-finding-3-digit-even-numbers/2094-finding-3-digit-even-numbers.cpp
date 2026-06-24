class Solution {
public:
    vector<int> findEvenNumbers(vector<int>& digits) {
        vector<int>res;
        int freq[10]={0};
        for(int i:digits){
            freq[i]++;
        }
        for(int i=100;i<999;i+=2){
            int tempfreq[10];
            memcpy(tempfreq,freq,sizeof(freq));
            int temp=i;
            int f=1;
            while(temp){
                int d=temp%10;
                if(tempfreq[d]==0){
                    f=0;
                    break;
                            }
                tempfreq[d]--;
                temp/=10;
            }
            if(f)res.push_back(i);
        }
        return res;
    }
};