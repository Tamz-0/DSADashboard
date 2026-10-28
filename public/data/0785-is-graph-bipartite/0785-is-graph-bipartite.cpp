class Solution {
public:
    bool dfs(vector<vector<int>>&adj,vector<int>&color,int node,int col){
        color[node]=col;
        for(int v:adj[node]){
            if(color[v]==color[node])return 0;
            if(color[v]==-1){
                if(!dfs(adj,color,v,1-col))return 0;
        }
    }
        return 1;
    }
    bool isBipartite(vector<vector<int>>& graph) {
        int V=graph.size();
        vector<int>color(V,-1);
        for(int i=0;i<V;i++){
            if(color[i]==-1){
                if(!dfs(graph,color,i,0))return 0;
            }
        }
        return 1;
    }
};