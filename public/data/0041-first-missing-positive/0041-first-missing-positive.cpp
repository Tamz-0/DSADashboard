class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        unordered_set<int>s;
        for(int i:nums){
            s.insert(i);
        }
        int ans=1;
        while(s.count(ans)) ans++;
        return ans;


        
    }
};