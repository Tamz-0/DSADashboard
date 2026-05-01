class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& arr) {
        vector<vector<int>> vec;
        int n=arr.size();
        sort(arr.begin(), arr.end());

        for(int i =0;i<n-2;i++){
            if(i>0&&arr[i]==arr[i-1]){
                continue;
            }
            int t=-1*arr[i];
            int j=i+1;
            int k=arr.size()-1;
            while(j<k){
                int s=arr[j]+arr[k];
                if(s==t){
                    vec.push_back({arr[i],arr[j],arr[k]});
                    j++;
                    k--;
                    while(j<n&&arr[j]==arr[j-1]){
                        j++;
                    }
                    
                    while(k>=0&&arr[k]==arr[k+1]){
                        k--;
                    }
                    
                }
                else if(s<t){
                    j++;
                }
                else{
                    k--;
                }
            }
        }
        return vec;
    }
};