class Solution {
public:
    int find(int x,vector<int>&parent){
        if(x==parent[x])return x;
        return parent[x]=find(parent[x],parent);
    }
    void unite(int a,int b,vector<int>&parent,vector<int>&rank ){
        int a_par=find(a,parent);
        int b_par=find(b,parent);
        if(a_par==b_par)return;
        if(rank[a_par]>rank[b_par])parent[b_par]=a_par;
        else if(rank[a_par]<rank[b_par])parent[a_par]=b_par;
        else{
            parent[a_par]=b_par;
            rank[b_par]++;
        }
    }
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
        vector<int>par(n);
        for(int i=0;i<n;i++){
            par[i]=i;
        }
        vector<int>rank(n,0);
        for(auto it:edges){
            int u=it[0];
            int v=it[1];
            unite(u,v,par,rank);
        }
        return find(source,par)==find(destination,par);
    }
};