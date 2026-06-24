class Solution {
public:
    int countEven(int num) {
        int x=num;
        int s=0;
        while(x){
            s+=x%10;
            x/=10;
        }
        return(num-(s&1))/2;
        
    }
};