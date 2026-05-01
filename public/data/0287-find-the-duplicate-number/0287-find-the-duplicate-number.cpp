class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int s=0;
        int f=0;
        while(true){
            s=nums[s];
            f=nums[f];
            f=nums[f];
            if(f==s){
                s=0;
                while(s!=f){
                    s=nums[s];
                    f=nums[f];

                }
                return s;
            }
        }
            return -1;
    }
};