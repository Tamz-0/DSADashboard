class Solution {
public:
    int maximumSwap(int num) {
        string nums=to_string(num);
        int n=nums.length();
        vector<int>maxright(n);
        maxright[n-1]=n-1;
        for(int i=n-2;i>=0;i--){
            if(nums[i]>nums[maxright[i+1]]){
                maxright[i]=i;
            }else{
                maxright[i]=maxright[i+1];
            }
        }
        for(int i=0;i<n;i++){
            if(nums[i]<nums[maxright[i]]){
                swap(nums[i],nums[maxright[i]]);
                return stoi(nums);
            }
        }
        return num;
    }
};