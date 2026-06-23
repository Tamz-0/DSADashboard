class Solution {
public:
    bool isThree(int n) {
        if(n<=2)return false;
        int x=sqrt(n);
        if(x*x!=n) return false;
        for(int i=2;i*i<=x;i++){
            if(x%i==0) return false;
        }
        return true;        
    }
};