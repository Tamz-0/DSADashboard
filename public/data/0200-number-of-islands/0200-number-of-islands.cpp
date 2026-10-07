class Solution {
public:
    void dfs(vector<vector<char>>&adj,vector<vector<int>>&vis,int r,int c,int n,int m){
        vis[r][c]=1;
        vector<int>dr{-1,1,0,0};
        vector<int>dc{0,0,-1,1};
        for(int k=0;k<4;k++){
            int nr=dr[k]+r;
            int nc=dc[k]+c;
            if(nr>=0&&nr<n&&nc>=0&&nc<m&&!vis[nr][nc]&&adj[nr][nc]=='1')dfs(adj,vis,nr,nc,n,m);
        }

    }
    int numIslands(vector<vector<char>>& grid) {
        int n=grid.size();
        int m=grid[0].size();
        int ans=0;
        vector<vector<int>>vis(n,vector<int>(m,0));
        for(int r=0;r<n;r++){
            for(int c=0;c<m;c++){
                if(!vis[r][c]&&grid[r][c]=='1'){
                    dfs(grid,vis,r,c,n,m);
                    ans++;
                }
            }
        }
        return ans;
    }
};