class Solution {
public:
    int maxAbsoluteSum(vector<int>& arr) {
        int maxsum=arr[0];
        int minsum=arr[0];
        int ansmax=arr[0];
        int ansmin=arr[0];
        for(int i=1;i<arr.size();i++){
            maxsum=max(maxsum+arr[i],arr[i]);
            ansmax=max(maxsum,ansmax);
            minsum=min(minsum+arr[i],arr[i]);
            ansmin=min(ansmin,minsum);
        }
        return max(ansmax,abs(ansmin));
    }
};