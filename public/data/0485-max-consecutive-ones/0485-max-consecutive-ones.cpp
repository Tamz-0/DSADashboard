class Solution {
public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int res=0;
        int c=0;
        for(int i:nums){
            if(i==1){
                res=max(res,++c);
            }else{
                c=0;
            }
        }
        return res;

        
    }
};