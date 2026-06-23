class Solution {
public:
    int commonFactors(int a, int b) {
     int g=gcd(a,b);
     int c=0;
     for(int i=1;i*i<=g;i++){
        if(g%i==0){
            c++;
            if(i!=g/i)c++;    
        }
     }
     return c;
    }
};