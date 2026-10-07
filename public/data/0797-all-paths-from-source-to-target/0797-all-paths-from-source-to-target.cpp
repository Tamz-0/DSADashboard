class Solution {
public:
    void dfs(vector<vector<int>>&adj,vector<int>&temp,vector<vector<int>>&res,int s,int d){
        temp.push_back(s);
        if(s==d)res.push_back(temp);
        else{
            for(int v:adj[s]){
            dfs(adj,temp,res,v,d);
            }
        }
        temp.pop_back();
    }
    vector<vector<int>> allPathsSourceTarget(vector<vector<int>>& graph) {
        vector<vector<int>>res;
        vector<int>temp;
        int n=graph.size();
        dfs(graph,temp,res,0,n-1);
        return res;
    }
};