class Solution {
public:
    bool isprime(int n){
        if(n<2)return false;
        for(int i=2;i*i<=n;i++){
            if(n%i==0){
                return false;
            }
        }
        return true;
    }
    int sumFourDivisors(vector<int>& nums) {
        int s=0;
        for(int i:nums){
            int p=round(cbrt(i));
            if(i==p*p*p&&isprime(p)){
                s+=1+p+(p*p)+(p*p*p);
                continue;
            }
            for(int j=2;j*j<=i;j++){
                if(i%j==0){
                    int q=i/j;
                    if(j!=q&&isprime(j)&&isprime(q)){
                        s+=1+j+q+i;
                    }
                    break;
                }

            }
        }
        return s;
        
    }
};