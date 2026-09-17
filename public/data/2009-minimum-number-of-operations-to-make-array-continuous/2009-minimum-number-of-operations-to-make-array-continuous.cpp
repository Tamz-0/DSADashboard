class Solution {
public:
    int minOperations(vector<int>& nums) {
        set<int>s(nums.begin(),nums.end());
        vector<int>temp(s.begin(),s.end());
        int n=nums.size()-1;
        int res=INT_MAX;
        for(int j=0;j<temp.size();j++){
            int l=temp[j];
            int r=n+l;
            int k=upper_bound(temp.begin(),temp.end(),r)-temp.begin();
            int within_range=k-j;
            int out_of_range=n-within_range+1;
            res=min(res,out_of_range);

        }
        return res;
    }
};