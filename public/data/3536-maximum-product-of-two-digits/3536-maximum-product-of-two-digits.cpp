class Solution {
public:
    int maxProduct(int n) {
       int f=-1;
       int s=-1;
       while(n){
        int d=n%10;
        if(f<d){
            s=f;
            f=d;
        }
        else if(s<d){
            s=d;
        }
        n/=10;
       } 
       return f*s;
    }
};