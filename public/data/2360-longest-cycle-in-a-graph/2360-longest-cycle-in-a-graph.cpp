class Solution {
public:
    int dfs(vector<int>&edges,vector<int>&vis,vector<int>&inr,vector<int>&count,int u,int &res){
        if(u!=-1){
            vis[u]=1;
            inr[u]=1;
            int v=edges[u];
            if(v!=-1&&!vis[v]){
                count[v]=count[u]+1;
                dfs(edges,vis,inr,count,v,res);
                }
            else if(v!=-1&&inr[v])res=max(res,count[u]-count[v]+1);
            inr[u]=0;
            
        }


        return res;
    }
    int longestCycle(vector<int>& edges) {
        int res=-1;
        int n=edges.size();
        vector<int>vis(n,0);
        vector<int>inr(n,0);
        vector<int>count(n,1);
        for(int u=0;u<n;u++){
            if(!vis[u]){
                dfs(edges,vis,inr,count,u,res);
            }
        }
        return res;
        
    }
};