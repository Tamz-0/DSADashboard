class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int n=intervals.size();
        bool f=false;
        for(int i=0;i<n;i++){
            int s=intervals[i][0];
            if(f==false&&s>=newInterval[0]){
                res.push_back(newInterval);
                f=true;
            }
            res.push_back({intervals[i][0],intervals[i][1]});
        }
        if (!f) res.push_back(newInterval);
        int s1=res[0][0];
        int e1=res[0][1];
        n=res.size();
        vector<vector<int>>ans;
        for(int i=1;i<n;i++){
           int s2=res[i][0];
           int e2=res[i][1];
            if(e1>=s2){
                s1=s1;
                e1=max(e2,e1);
                continue;
            }
            else{
            ans.push_back({s1,e1});
            s1=s2;
            e1=e2;
            }
        }
        ans.push_back({s1,e1});
        return ans;
    }
};