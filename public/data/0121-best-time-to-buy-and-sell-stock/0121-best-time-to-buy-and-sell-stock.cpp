class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int l=0;
        int h=1;
        int r=0;
        for(h=1;h<prices.size();h++){
            if(prices[l]<prices[h]){
                int d=prices[h]-prices[l];
                r=max(d,r);
            }
            while(prices[l]>prices[h]){
                l++;
                if(l==h){
                    break;
                }
            }
        }
        return r;
    }
};