class Solution {
public:
    int subarraysDivByK(vector<int>& arr, int k) {
        int s=0;
        int res=0;
        unordered_map<int,int>f;
        f[0]++;
        int n=arr.size();
        for(int i=0;i<n;i++){
            s+=arr[i];
            int rem = ((s % k) + k) % k;
            res+=f[rem];
            f[rem]++;

        }
        return res;
        
    }
};