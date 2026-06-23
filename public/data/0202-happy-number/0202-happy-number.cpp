class Solution {
public:
    int digitalsqroot(int n){
        int s=0;
        while(n){
            int rem=n%10;
            s+=rem*rem;
            n/=10;
        }
        return s;
    }
    bool isHappy(int n) {
        int slow=n;
        int fast=n;
        do{
        slow=digitalsqroot(slow);
        fast=digitalsqroot(digitalsqroot(fast));

        }while(slow!=fast);
        return slow==1;
    }
};