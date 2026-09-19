class Solution {
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n=isConnected.size();
        vector<int>vis(n,0);
        int c=0;
        for(int i=0;i<n;i++){
            if(!vis[i]){
                c++;
                queue<int>q;
                q.push(i);
                vis[i]=1;
                while(!q.empty()){
                    int node=q.front();
                    q.pop();
                    for(int it=0;it<n;it++){
                        if(!vis[it]&&isConnected[node][it]==1){
                            vis[it]=1;
                            q.push(it);
                        }
                    }
                }
            }
        }
        return c;
    }
};