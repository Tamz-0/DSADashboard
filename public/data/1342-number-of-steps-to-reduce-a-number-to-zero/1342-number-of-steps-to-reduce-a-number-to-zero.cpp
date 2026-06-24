class Solution {
public:
    int numberOfSteps(int n) {
        int c=0;
        while(n){
            while(n%2==0){
                n/=2;
                c++;
            }
            while(n%2==1){
                n--;
                c++;
            }
        }
        return c;
    }
};