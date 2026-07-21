class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n=nums.size();
        vector<int>res(n,1);
        for(int i=0;i+1<n;i++){
            res[i+1]=res[i]*nums[i];
        }
        int s=1;
        for(int i=n-1;i>=0;i--){
            res[i]*=s;
            s*=nums[i];
        }
        return res;
        
    }
};