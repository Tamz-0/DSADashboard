class Solution {
public:
    int minimumCost(vector<int>& nums) {
        int s=nums[0];
        int m1=INT_MAX;
        int m2=INT_MAX;
        for(int i=1;i<nums.size();i++){
            if(nums[i]<m1){
                m2=m1;
                m1=nums[i];
            }else if(nums[i]<m2&&nums[i]>=m1){
                m2=nums[i];
            }
        }
        s+=m1+m2;
        return s;

    }
};