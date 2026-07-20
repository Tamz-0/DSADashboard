class Solution {
public:
    vector<int> majorityElement(vector<int>& nums) {
        int candidate1=0;
        int candidate2=1;
        int c1=0;
        int c2=0;
        vector<int>res;
        for(int i:nums){
           if(candidate1==i)c1++;
           else if(candidate2==i)c2++;
           else if(c1==0){
            candidate1=i;
            c1++;
           }
           else if(c2==0){
            candidate2=i;
            c2++;
           }
           else{
            c1--;
            c2--;
           }
        }
        c1=c2=0;
        for(int i:nums){
            if(i==candidate1)c1++;
            else if(i==candidate2)c2++;
        }
        if(c1>nums.size()/3)res.push_back(candidate1);
        if(c2>nums.size()/3)res.push_back(candidate2);
        return res;
    }
};