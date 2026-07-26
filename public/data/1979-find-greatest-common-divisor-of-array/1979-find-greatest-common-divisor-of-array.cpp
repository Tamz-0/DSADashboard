class Solution {
public:
    int findGCD(vector<int>& nums) {
        int s=INT_MAX;
        int l=INT_MIN;
        for(int i:nums){
            if(i>l)l=i;
            if(i<s)s=i;
        }
        return gcd(s,l);
    }
};