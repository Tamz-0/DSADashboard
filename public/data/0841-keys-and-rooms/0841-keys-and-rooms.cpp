class Solution {
public:
    void dfs(vector<vector<int>>&rooms,vector<int>&vis,int node){
        vis[node]=1;
        for(int v:rooms[node]){
            if(!vis[v])dfs(rooms,vis,v);

        }

    }
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        int n=rooms.size();
        vector<int>vis(n,0);
        dfs(rooms,vis,0);
        for(int i:vis){
            if(!i)return 0;
        }
        return 1;
    }
};