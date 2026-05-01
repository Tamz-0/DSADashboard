class Solution {
public:
    int findMaxLength(vector<int>& arr) {
        int n=arr.size();
        int s=0;
        int maxlen=0;
        unordered_map<int, int> mp;
        mp[0]=-1;
        for(int i=0;i<n;i++){
            s+=(arr[i]==0)?1:-1;
            if(mp.find(s)!=mp.end()){
                maxlen=max(maxlen,(i-mp.at(s)));
            }
            else{
                mp[s]=i;
            }

        }
        return maxlen;
    }
};