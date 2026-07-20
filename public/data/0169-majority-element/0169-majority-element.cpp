class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate=0;
        int c=0;
        for(int i:nums){
            if(c==0)candidate=i;
            if(candidate==i)c++;
            else c--;
        }
        return candidate;
        
    }
};