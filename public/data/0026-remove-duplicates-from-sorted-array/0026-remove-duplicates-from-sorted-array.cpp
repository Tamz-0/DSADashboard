class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int i=0;
        int j=i+1;
        int k=0;
        if(nums.size()>0){
            k=1;
        }
        while(j<nums.size()){
            if(nums[i]==nums[j]){
                j++;
            }
            else{
                nums[i+1]=nums[j];
                i++;
                j++;
                k++;
            }
        }
        return k;
    }
};