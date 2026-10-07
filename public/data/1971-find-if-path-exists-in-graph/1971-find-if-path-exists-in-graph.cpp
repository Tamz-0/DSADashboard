class Solution {
public:
    bool bfs(vector<vector<int>>&adj,vector<int>&vis,int s, int d){
        if(s==d)return 1;
        vis[s]=1;
        queue<int>q;
        q.push(s);
        while(!q.empty()){
            int u=q.front();
            q.pop();
            if(u==d)return 1;
            for(int v:adj[u]){
                if(!vis[v]){
                    vis[v]=1;
                    q.push(v);
                }
            }
            
        }
        return 0;
    }
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
        if(source==destination)return  1;
        vector<vector<int>>adj(n);
        for(auto it:edges){
            int u=it[0];
            int v=it[1];
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        vector<int>vis(n,0);
        return bfs(adj,vis,source,destination);
    }
};