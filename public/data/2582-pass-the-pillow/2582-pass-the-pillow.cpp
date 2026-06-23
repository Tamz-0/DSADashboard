class Solution {
public:
    int passThePillow(int n, int time) {
        int r=time/(n-1);
        int rem=time%(n-1);
        return r%2==0?1+rem:n-rem;
        
    }
};