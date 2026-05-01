class Solution {
public:
    int hammingWeight(int n) {
         int i=1,wt=0;

    while(n){
        wt+=n&1;
        n>>=1;
    }
    return wt;
        
    }
};