class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int row[4]={-1,0,1,0};
        int col[4]={0,1,0,-1};
        int n=grid.size();
        int m=grid[0].size();
        int c=0;
        queue<pair<int,int>>q;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(grid[i][j]=='1'){
                    q.push({i,j});
                    while(!q.empty()){
                        int a=q.front().first;
                        int b=q.front().second;
                        q.pop();
                        for(int k=0;k<4;k++){
                            int newrow=a+row[k];
                            int newcol=b+col[k];
                            if(newrow>=0&&newrow<n){
                                if(newcol>=0&&newcol<m){
                            if(grid[newrow][newcol]=='1'){
                                q.push({newrow,newcol});
                                grid[newrow][newcol]=0;
                            }
                            }
                            }
                        }

                    }
                    c++;
                }
            }
        }
        return c;
    }
};