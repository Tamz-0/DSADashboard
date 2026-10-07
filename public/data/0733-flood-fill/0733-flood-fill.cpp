class Solution {
public:
    void bfs(vector<vector<int>>&image,int sr,int sc,int color,int oldcolor,int n,int m){
        if(oldcolor==color)return;
        vector<int>dr{-1,1,0,0};
        vector<int>dc{0,0,-1,1};
        queue<pair<int,int>>q;
        q.push({sr,sc});
        while(!q.empty()){
            int r=q.front().first;
            int c=q.front().second;
            image[r][c]=color;
            q.pop();
            for(int i=0;i<4;i++){
                int nr=dr[i]+r;
                int nc=dc[i]+c;
                if(nr>=0&&nc>=0&&nr<n&&nc<m&&image[nr][nc]==oldcolor){
                    image[nr][nc]=color;
                    q.push({nr,nc});
                }
            }
        }
        
    }
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int oldcolor=image[sr][sc];
        int n=image.size();
        int m=image[0].size();
        bfs(image,sr,sc,color,oldcolor,n,m);
        return image;
    }
};