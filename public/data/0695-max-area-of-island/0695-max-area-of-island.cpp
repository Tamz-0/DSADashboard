class Solution {
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int row[4]={1,-1,0,0};
        int col[4]={0,0,-1,1};
        int n=grid.size();
        int m=grid[0].size();
        queue<pair<int,int>>q;
        int res=0;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                int c=0;
                if(grid[i][j]==1){
                        // c++;
                    q.push({i,j});
                    grid[i][j]=0;
                    while(!q.empty()){
                        c++;
                        int a=q.front().first;
                        int b=q.front().second;
                        q.pop();
                        for(int k=0;k<4;k++){
                            int newrow=a+row[k];
                            int newcol=b+col[k];
                            if(newrow>=0&&newrow<n){
                                if(newcol>=0&&newcol<m){
                                    if(grid[newrow][newcol]==1){
                                        // c++;
                                        grid[newrow][newcol]=0;
                                        q.push({newrow,newcol});
                                    }
                                }
                            }
                        }
                    }
                    res=max(c,res);
                }
            }
        }
        return res;
        
    }
};