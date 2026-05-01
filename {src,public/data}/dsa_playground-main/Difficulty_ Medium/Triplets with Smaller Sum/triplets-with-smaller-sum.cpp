class Solution {

  public:
    long long countTriplets(int n, long long sum, long long arr[]) {
        sort(arr,arr+n);
        long long res=0;
        for(int i=0;i<n-2;i++){
            int l=i+1;
            int r=n-1;
            while(l<r){
                long long s=arr[i]+arr[l]+arr[r];
                if(s>=sum){
                    r--;
                }else{
                    res+=(r-l);
                    l++;
                }
            }
        }
        
        return res;
        
    }
};