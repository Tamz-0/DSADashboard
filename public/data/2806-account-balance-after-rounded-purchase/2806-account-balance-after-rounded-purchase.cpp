class Solution {
public:
    int accountBalanceAfterPurchase(int purchaseAmount) {
        int rem =purchaseAmount%10;
        if(rem==0)return 100- purchaseAmount;
        if(rem<5)  purchaseAmount-=rem;
        if(rem>=5) purchaseAmount+=(10-rem);
        return 100-(purchaseAmount);
    }
};