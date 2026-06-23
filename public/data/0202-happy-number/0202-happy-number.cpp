class Solution {
public:
    bool isHappy(int n) {
     int s=0;
     while(n!=1&&n!=4){
        while(n){
            int rem=n%10;
            s+=(rem*rem);
            n/=10;
        }
        n=s;
        s=0;
     }
     
     return n==1;   
    
    }
};