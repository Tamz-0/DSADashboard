class Solution {
public:
    int find(int x,vector<int>&par){
        if(x==par[x])return x;
        return par[x]=find(par[x],par);
    }
    void unite(int a,int b,vector<int>&par,vector<int>&rank){
        int a_par=find(a,par);
        int b_par=find(b,par);
        if(a_par==b_par)return;
        if(rank[a_par]>rank[b_par])par[b_par]=a_par;
        else if(rank[a_par]<rank[b_par])par[a_par]=b_par;
        else{
            par[b_par]=a_par;
            rank[a_par]++;
        }
    }
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n=isConnected.size();
        vector<int>par(n);
        vector<int>rank(n,0);
        for(int i=0;i<n;i++){
            par[i]=i;
        }
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if(isConnected[i][j]==1){
                    unite(i,j,par,rank);
                }
            }
        }
        int c=0;
        for(int i=0;i<n;i++){
            if(find(i,par)==i)c++;
        }
        return c;
    }
};