class Solution {
public:
    void bfs(vector<vector<int>>&rooms,vector<int>&vis,int node){
        vis[node]=1;
        queue<int>q;
        q.push(node);
        while(!q.empty()){
            int u=q.front();
            q.pop();
            for(int v:rooms[u]){
                if(!vis[v]){
                    vis[v]=1;
                    q.push(v);
                }
            }
        }
    }
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        int n=rooms.size();
        vector<int>vis(n,0);
        bfs(rooms,vis,0);
        for(int i:vis){
            if(!i)return 0;
        }
        return 1;
    }
};