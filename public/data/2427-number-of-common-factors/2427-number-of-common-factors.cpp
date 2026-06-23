class Solution {
public:
    int commonFactors(int a, int b) {
        int x=(a>b?b:a);
        int c=1;
        for(int i=2;i<=x;i++){
            if(a%i==0&&b%i==0) c++;
        }
        return c;
        
    }
};