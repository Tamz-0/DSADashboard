class Solution {
public:
    void bfs(vector<vector<char>>&board,vector<vector<int>>&vis,int row,int col,int n,int m){
        auto isSafe=[&](int i,int j){
            return i>=0&&i<n&&j>=0&&j<m;
        };
        vector<int>dr{-1,1,0,0};
        vector<int>dc{0,0,-1,1};
       queue<pair<int,int>>q;
        vis[row][col]=1;
       q.push({row,col});
       while(!q.empty()){
        auto[r,c]=q.front();
        q.pop();
        for(int i=0;i<4;i++){
            int nr=r+dr[i];
            int nc=c+dc[i];
            if(isSafe(nr,nc)&&!vis[nr][nc]&&board[nr][nc]=='O'){q.push({nr,nc});vis[nr][nc]=1;}
        }
       }
    }
    void solve(vector<vector<char>>& board) {
        int n=board.size();
        int m=board[0].size();
        vector<vector<int>>vis(n,vector<int>(m,0));
        for(int i=0;i<n;i++){
            if(board[i][0]=='O'&&!vis[i][0])bfs(board,vis,i,0,n,m);
            if(board[i][m-1]=='O'&&!vis[i][m-1])bfs(board,vis,i,m-1,n,m);
        }
        for(int j=0;j<m;j++){
            if(board[0][j]=='O'&&!vis[0][j])bfs(board,vis,0,j,n,m);
            if(board[n-1][j]=='O'&&!vis[n-1][j])bfs(board,vis,n-1,j,n,m);
        }
        for(int i=1;i<n-1;i++){
            for(int j=1;j<m-1;j++){
                if(!vis[i][j])board[i][j]='X';
            }
        }
    }
};