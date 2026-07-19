class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minprice=INT_MAX;
        int maxprofit=0;
        for(int i:prices){
            minprice=min(i,minprice);
            maxprofit=max(maxprofit,i-minprice);
        }
        return maxprofit;
        
    }
};