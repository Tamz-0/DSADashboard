class Solution {
public:
    int kItemsWithMaximumSum(int numOnes, int numZeros, int numNegOnes, int k) {
        if(k<=numOnes) return k;
        int ans=numOnes;
        k-=numOnes;
        if(k<=numZeros) return ans;
        k-=numZeros;
        ans-=k;
        return ans;


        
    }
};