class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int max_element=nums[0];
        int max_index=0;
        int n=nums.size();
        for (int i=1;i<n;i++){
            if(nums[i]>max_element){
                max_element=nums[i];
                max_index=i;
            }
        }
        return max_index;

        
    }
};