class Solution {
public:
    int findJudge(int n, vector<vector<int>>& trust) {
        vector<int>ind(n+1,0);
        vector<int>out(n+1,0);
        for(auto it:trust){
            int u=it[0];
            int v=it[1];
            ind[v]++;
            out[u]++;
        }
        for(int i=1;i<n+1;i++){
            if(ind[i]==n-1&&out[i]==0)return i;
        }
        return -1;
    }
};