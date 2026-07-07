class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
    int row[4]={0,0,1,-1};
    int col[4]={1,-1,0,0};
     int fresh=0;
     int min=0;
     int n=grid.size();
     int m=grid[0].size();
     queue<pair<int,int>>q;
     for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            if(grid[i][j]==1)fresh++;
            if(grid[i][j]==2)q.push({i,j});
        }
     }
     if(fresh==0)return 0;
     while(!q.empty()){
        int sz=q.size();
        while(sz--)
        {
            int a=q.front().first;
            int b=q.front().second;
            q.pop();
            for(int k=0;k<4;k++){
                int newrow=a+row[k];
                int newcol=b+col[k];
                if(newrow>=0&&newrow<n&&newcol>=0&&newcol<m&&grid[newrow][newcol]==1){
                grid[newrow][newcol]=2;
                fresh--;
                q.push({newrow,newcol});   
                }
            }
        }
        if(!q.empty())min++;
     }

     return fresh==0?min:-1;   
    }
};