class Solution {
public:
    vector<int> replaceElements(vector<int>& arr) {
        int cmax=-1;
        for(int i=arr.size()-1;i>=0;i--){
            int temp=arr[i];
            arr[i]=cmax;
            cmax=max(cmax,temp);
        }
        return arr;
        
    }
};