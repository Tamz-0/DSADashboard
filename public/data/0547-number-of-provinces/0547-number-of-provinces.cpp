class Solution {
public:
    void dfs(int node,vector<int>&vis,vector<vector<int>>&isConnected,int n){
        vis[node]=1;
        for(int j=0;j<n;j++){
            if(!vis[j]&&isConnected[node][j]==1)dfs(j,vis,isConnected,n);
        }
    }
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n=isConnected.size();
        int c=0;
        vector<int>vis(n,0);
        for(int i=0;i<n;i++){
            if(!vis[i]){
                c++;
                dfs(i,vis,isConnected,n);
            }
        }
        return c;
    }
};