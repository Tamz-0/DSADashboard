class Solution {
public:
    bool hasTrailingZeros(vector<int>& nums) {
        int c=0;
        for(int i:nums){
            if(i%2==0) c++;
        }
        return c>=2;
        
    }
};