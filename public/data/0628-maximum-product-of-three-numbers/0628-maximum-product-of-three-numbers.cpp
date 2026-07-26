class Solution {
public:
    int maximumProduct(vector<int>& nums) {
        int first_max=INT_MIN;
        int second_max=INT_MIN;
        int third_max=INT_MIN;
        int first_min=INT_MAX;
        int second_min=INT_MAX;
        for(int i:nums){
            if(i>first_max){
                third_max=second_max;
                second_max=first_max;
                first_max=i;
            }else if(i>second_max){
                third_max=second_max;
                second_max=i;
            }else if(i>third_max)third_max=i;
            if(i<first_min){
                second_min=first_min;
                first_min=i;
            }else if(i<second_min){
                second_min=i;
            }
        }
        return max(first_max*second_max*third_max,first_max*first_min*second_min);
    }
};